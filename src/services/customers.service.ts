import Customer from '~/models/schemas/Customer.schema'
import databaseSetvices from './database.service'
import { CustomerRegisterRequest } from '~/models/requests/Customer.request'
import hashPassword from '~/utils/crypto'
import jwtModule from '~/utils/jwt'
import envConfig from '~/constants/config'
import { TOKEN_TYPE, UserRole, UserVerifyStatus } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import { sendEmailVerify } from '~/utils/email'
import { omit } from 'lodash'
import response_messages from '~/constants/messages'
import refreshTokenServices from './refresh_tokens.service'

class CustomerServices {
  public async findCustomerByEmail(email: string) {
    return databaseSetvices.customers.findOne({ email })
  }
  public async createCustomer(customer: CustomerRegisterRequest) {
    const customer_id = new ObjectId()
    const email_verify_token = await jwtModule.signEmailVerifyToken({
      _id: customer_id.toString(),
      verify: UserVerifyStatus.Unverified,
      role: UserRole.Customer
    })
    // insert customer
    const customer_bd = await databaseSetvices.customers.insertOne(
      new Customer({
        ...customer,
        _id: customer_id,
        email_verify_token,
        password: hashPassword(customer.password)
      })
    )
    const user_customer_created = await databaseSetvices.customers.findOne({ _id: customer_id })
    // send email verify
    await sendEmailVerify(customer.email, 'User activation', email_verify_token, UserRole.Customer)
    // sign access token and refresh token
    return {
      customer: omit(user_customer_created, ['password', 'created_at', 'updated_at'])
    }
  }
  public async customerLogin({ _id, verify }: { _id: string; verify: UserVerifyStatus }) {
    if (verify === UserVerifyStatus.Unverified) {
      throw new Error(response_messages.unauthorized.verify_email.unverified)
    }
    if (verify === UserVerifyStatus.Banned) {
      throw new Error(response_messages.unauthorized.verify_email.banned)
    }
    const [token, updated_user] = await Promise.all([
      jwtModule.signAccessRefreshToken({ _id, verify, role: UserRole.Customer }),
      databaseSetvices.customers.findOne({ _id: new ObjectId(_id) })
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
      customer: omit(updated_user, ['password', 'created_at', 'updated_at']),
      access_token: token[0],
      refresh_token: token[1],
      access_token_EXP: decoded_access_token.exp,
      refresh_token_EXP: decoded_refresh_token.exp
    }
  }
  public async verifyEmail(_id: string) {
    const customer_id = new ObjectId(_id)
    const customer_db = await databaseSetvices.customers.findOne({ _id: customer_id })
    if (!customer_db) {
      throw new Error(response_messages.user_not_found)
    }
    if (customer_db.verify === UserVerifyStatus.Verified) {
      throw new Error(response_messages.unauthorized.verify_email.verified)
    }
    // if account banned
    if (customer_db.verify === UserVerifyStatus.Banned) {
      throw new Error(response_messages.unauthorized.verify_email.banned)
    }
    await databaseSetvices.customers.updateOne(
      { _id: customer_id },
      { $set: { verify: UserVerifyStatus.Verified, updated_at: new Date(), email_verify_token: '' } }
    )
    const [token, updated_user] = await Promise.all([
      jwtModule.signAccessRefreshToken({
        _id: customer_id.toString(),
        verify: UserVerifyStatus.Verified,
        role: UserRole.Customer
      }),
      databaseSetvices.customers.findOne({ _id: customer_id })
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
      customer: omit(updated_user, [
        'password',
        'email_verify_token',
        'forgot_password_token',
        'created_at',
        'updated_at'
      ]),
      access_token: token[0],
      refresh_token: token[1]
    }
  }
  public async customerLogout(refresh_token: string) {
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
      jwtModule.signAccessToken({ _id, verify, role: UserRole.Customer }),
      jwtModule.signRefreshToken({ _id, verify, role: UserRole.Customer, exp }),
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
const customerServices = new CustomerServices()
export default customerServices
