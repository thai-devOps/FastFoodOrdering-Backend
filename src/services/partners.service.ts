import databaseSetvices from './database.service'
import hashPassword from '~/utils/crypto'
import jwtModule from '~/utils/jwt'
import { PARTNER_STATUS, TOKEN_TYPE, UserRole, UserVerifyStatus } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import { sendEmailVerify } from '~/utils/email'
import { omit } from 'lodash'
import response_messages from '~/constants/messages'
import refreshTokenServices from './refresh_tokens.service'
import { PartnerProfileRequest, PartnerRegisterRequest } from '~/models/requests/Partner.request'
import Partner from '~/models/schemas/Partner.schema'
import { UnauthorizedError } from '~/utils/errors'
import userServices from './users.service'

class PartnerServices {
  public async findPartnerByEmail(email: string) {
    return databaseSetvices.partners.findOne({ email })
  }
  public async createPartner(user_id: ObjectId, partner: PartnerRegisterRequest) {
    const partner_id = new ObjectId()
    const email_verify_token = await jwtModule.signEmailVerifyToken({
      _id: user_id.toString(),
      verify: UserVerifyStatus.Unverified,
      role: UserRole.Partner
    })
    await userServices.updateVerifyToken(user_id, email_verify_token)
    // send email verify token
    await sendEmailVerify(partner.email, 'Xác thực email', email_verify_token, UserRole.Partner)
    const result = await databaseSetvices.partners.insertOne(
      new Partner({
        _id: partner_id,
        user_id
      })
    )
    const partner_db = await userServices.findUserById(user_id)
    // sign access token and refresh token
    return omit(partner_db, ['password', 'created_at', 'updated_at'])
  }
  public async partnerLogin({ _id, verify }: { _id: string; verify: UserVerifyStatus }) {
    if (verify === UserVerifyStatus.Banned) {
      throw new Error(response_messages.unauthorized.verify_email.banned)
    }
    const [token, updated_user] = await Promise.all([
      jwtModule.signAccessRefreshToken({ _id, verify, role: UserRole.Partner }),
      databaseSetvices.users.findOne({ _id: new ObjectId(_id) })
    ])
    if (!updated_user) {
      throw new Error(response_messages.user_not_found)
    }
    const [decoded_access_token, decoded_refresh_token] = await Promise.all([
      jwtModule.decodedToken({ token: token[0], tokenType: TOKEN_TYPE.ACCESS_TOKEN }),
      jwtModule.decodedToken({ token: token[1], tokenType: TOKEN_TYPE.REFRESH_TOKEN })
    ])
    await refreshTokenServices.createRefreshToken({
      user_id: updated_user._id.toString(),
      token: token[1],
      iat: decoded_refresh_token.iat,
      exp: decoded_refresh_token.exp
    })
    return {
      partner: omit(updated_user, ['password', 'created_at', 'updated_at']),
      access_token: token[0],
      refresh_token: token[1],
      access_token_EXP: decoded_access_token.exp,
      refresh_token_EXP: decoded_refresh_token.exp
    }
  }
  public async verifyEmail(_id: string) {
    const partner_id = new ObjectId(_id)
    const partner_db = await userServices.findUserById(partner_id)
    if (!partner_db) {
      throw new Error(response_messages.user_not_found)
    }
    if (partner_db.verify === UserVerifyStatus.Verified) {
      throw new Error(response_messages.unauthorized.verify_email.verified)
    }
    // if account banned
    if (partner_db.verify === UserVerifyStatus.Banned) {
      throw new Error(response_messages.unauthorized.verify_email.banned)
    }
    await databaseSetvices.users.updateOne(
      { _id: partner_id },
      { $set: { verify: UserVerifyStatus.Verified, updated_at: new Date(), email_verify_token: '' } }
    )
    const [token, updated_user] = await Promise.all([
      jwtModule.signAccessRefreshToken({ _id, verify: UserVerifyStatus.Verified, role: UserRole.Partner }),
      databaseSetvices.users.findOne({ _id: partner_id })
    ])
    const decoded_refresh_token = await jwtModule.decodedToken({
      token: token[1],
      tokenType: TOKEN_TYPE.REFRESH_TOKEN
    })
    await refreshTokenServices.createRefreshToken({
      user_id: _id,
      token: token[1],
      iat: decoded_refresh_token.iat,
      exp: decoded_refresh_token.exp
    })
    return {
      partner: omit(updated_user, ['password', 'created_at', 'updated_at']),
      access_token: token[0],
      refresh_token: token[1],
      access_token_EXP: decoded_refresh_token.exp,
      refresh_token_EXP: decoded_refresh_token.exp
    }
  }
  public async partnerLogout(refresh_token: string) {
    const refresh_token_db = await refreshTokenServices.findRefreshToken({ token: refresh_token })
    if (!refresh_token_db) {
      throw new Error(response_messages.unauthorized.refresh_token.used_or_not_exists)
    }
    return await refreshTokenServices.deleteRefreshToken({ token: refresh_token })
  }
  public async findPartnerById(_id: string) {
    return databaseSetvices.users.findOne({ _id: new ObjectId(_id) })
  }
  public async refreshToken({
    _id,
    refresh_token,
    verify,
    exp
  }: {
    _id: string
    refresh_token: string
    verify: UserVerifyStatus
    exp: number
  }) {
    const [new_access_token, new_refresh_token, _] = await Promise.all([
      jwtModule.signAccessToken({ _id, verify, role: UserRole.Partner }),
      jwtModule.signRefreshToken({ _id, verify, exp, role: UserRole.Partner }),
      refreshTokenServices.deleteRefreshToken({ token: refresh_token })
    ])
    const decoded_refresh_token = await jwtModule.decodedToken({
      token: new_refresh_token,
      tokenType: TOKEN_TYPE.REFRESH_TOKEN
    })
    await refreshTokenServices.createRefreshToken({
      user_id: _id,
      token: new_refresh_token,
      iat: decoded_refresh_token.iat,
      exp: decoded_refresh_token.exp
    })
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }
  public async resendVerifyEmail({ _id, email }: { _id: string; email: string }) {
    const email_verify_token = await jwtModule.signEmailVerifyToken({
      _id,
      verify: UserVerifyStatus.Unverified,
      role: UserRole.Partner
    })
    await databaseSetvices.users.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { email_verify_token, updated_at: new Date() } }
    )
    await sendEmailVerify(email, 'Xác thực email', email_verify_token, UserRole.Partner)
    return {
      email_verify_token
    }
  }
  public async updatePartnerInfo(id: string, formData: PartnerProfileRequest) {
    const partner_id = new ObjectId(id)
    const partner_db = await databaseSetvices.users.findOne({ _id: partner_id })
    if (!partner_db) {
      throw new Error(response_messages.user_not_found)
    }
    const updated_partner = await databaseSetvices.users.updateOne(
      { _id: partner_id },
      { $set: { ...formData, is_active: PARTNER_STATUS.ACTIVE, updated_at: new Date(), _id: partner_id } }
    )
    if (!updated_partner) {
      throw new Error(response_messages.user_not_updated)
    }
    return await databaseSetvices.users.findOne({ _id: partner_id })
  }
}
const partnerServices = new PartnerServices()
export default partnerServices
