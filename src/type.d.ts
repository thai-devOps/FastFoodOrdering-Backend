import { JwtPayload } from 'jsonwebtoken'
import Customer from './models/schemas/Customer.schema'
import { TokenType, UserRole, UserVerifyStatus } from './constants/enums'
import Admin from './models/schemas/Admin.schema'
import Partner from './models/schemas/Partner.schema'
import { User } from './models/schemas/User.schema'

interface TokenPayload extends JwtPayload {
  _id: string
  token_type: TokenType
  verify: UserVerifyStatus
  role: UserRole
  iat: number
  exp: number
}

declare module 'express' {
  interface Request {
    customer?: Customer
    admin?: Admin
    partner?: User
    decoded_access_token?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
  }
}

interface SuccessResponse<T> {
  message: string
  data?: T
}
