import databaseSetvices from './database.service'
import hashPassword from '~/utils/crypto'
import jwtModule from '~/utils/jwt'
import { TOKEN_TYPE, UserRole, UserVerifyStatus } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import { sendEmailVerify } from '~/utils/email'
import { omit } from 'lodash'
import response_messages from '~/constants/messages'
import refreshTokenServices from './refresh_tokens.service'
import { AdminRegisterRequest } from '~/models/requests/Admin.request'
import Admin from '~/models/schemas/Admin.schema'

class AdminServices {
  public async findAdminByEmail(email: string) {
    return databaseSetvices.admins.findOne({ email })
  }
  public async createAdmin(admin: AdminRegisterRequest) {
    const admin_id = new ObjectId()
    const email_verify_token = await jwtModule.signEmailVerifyToken({
      _id: admin_id.toString(),
      verify: UserVerifyStatus.Unverified,
      role: UserRole.Admin
    })
    // insert customer
    const admin_db = await databaseSetvices.admins.insertOne(
      new Admin({
        ...admin,
        _id: admin_id,
        email_verify_token,
        password: hashPassword(admin.password)
      })
    )
    const user_admin_created = await databaseSetvices.admins.findOne({ _id: admin_id })
    if (!user_admin_created) {
      throw new Error(response_messages.user_not_found)
    }
    // send email verify
    await sendEmailVerify(user_admin_created.email, 'User activation', email_verify_token, UserRole.Admin)
    // sign access token and refresh token
    return {
      admin: omit(user_admin_created, ['password', 'created_at', 'updated_at'])
    }
  }
  public async adminLogin({ _id, verify }: { _id: string; verify: UserVerifyStatus }) {
    if (verify === UserVerifyStatus.Unverified) {
      throw new Error(response_messages.unauthorized.verify_email.unverified)
    }
    if (verify === UserVerifyStatus.Banned) {
      throw new Error(response_messages.unauthorized.verify_email.banned)
    }
    const [token, updated_user] = await Promise.all([
      jwtModule.signAccessRefreshToken({ _id, verify, role: UserRole.Admin }),
      databaseSetvices.admins.findOne({ _id: new ObjectId(_id) })
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
      admin: omit(updated_user, ['password', 'created_at', 'updated_at']),
      access_token: token[0],
      refresh_token: token[1],
      access_token_EXP: decoded_access_token.exp,
      refresh_token_EXP: decoded_refresh_token.exp
    }
  }
  public async verifyEmail(_id: string) {
    const admin_id = new ObjectId(_id)
    const admin_db = await databaseSetvices.admins.findOne({ _id: admin_id })
    if (!admin_db) {
      throw new Error(response_messages.user_not_found)
    }
    if (admin_db.verify === UserVerifyStatus.Verified) {
      throw new Error(response_messages.unauthorized.verify_email.verified)
    }
    // if account banned
    if (admin_db.verify === UserVerifyStatus.Banned) {
      throw new Error(response_messages.unauthorized.verify_email.banned)
    }
    await databaseSetvices.admins.updateOne(
      { _id: admin_id },
      { $set: { verify: UserVerifyStatus.Verified, updated_at: new Date(), email_verify_token: '' } }
    )
    const [token, updated_user] = await Promise.all([
      jwtModule.signAccessRefreshToken({ _id, verify: UserVerifyStatus.Verified, role: UserRole.Admin }),
      databaseSetvices.admins.findOne({ _id: admin_id })
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
      admin: omit(updated_user, [
        'password',
        'email_verify_token',
        'forgot_password_token',
        'created_at',
        'updated_at'
      ]),
      access_token: token[0],
      refresh_token: token[1],
      access_token_EXP: decoded_refresh_token.exp,
      refresh_token_EXP: decoded_refresh_token.exp
    }
  }
  public async adminLogout(refresh_token: string) {
    const refresh_token_db = await refreshTokenServices.findRefreshToken({ token: refresh_token })
    if (!refresh_token_db) {
      throw new Error(response_messages.unauthorized.refresh_token.used_or_not_exists)
    }
    return await refreshTokenServices.deleteRefreshToken({ token: refresh_token })
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
      jwtModule.signAccessToken({ _id, verify, role: UserRole.Admin }),
      jwtModule.signRefreshToken({ _id, verify, exp, role: UserRole.Admin }),
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
}
const adminServices = new AdminServices()
export default adminServices
