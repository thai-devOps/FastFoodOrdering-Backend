import { ObjectId } from 'mongodb'
import { IAddress, IImage } from './Partner.schema'
import { GENDER_TYPE, PARTNER_STATUS, UserVerifyStatus } from '~/constants/enums'

interface IUser {
  _id?: ObjectId
  // require
  email: string
  password: string
  phone: string
  name: string
  // optional
  date_of_birth?: string
  identity_number?: string
  address?: IAddress
  avatar?: IImage
  gender?: GENDER_TYPE
  // default
  email_verify_token?: string | null
  forgot_password_token?: string | null
  verify?: UserVerifyStatus
  is_active?: PARTNER_STATUS
  created_at?: Date
  updated_at?: Date
}
export class User {
  _id: ObjectId
  email: string
  password: string
  phone: string
  name: string
  gender: GENDER_TYPE
  date_of_birth: string
  identity_number: string
  address: IAddress
  avatar: IImage
  email_verify_token: string | null
  forgot_password_token: string | null
  verify: UserVerifyStatus
  is_active: PARTNER_STATUS
  created_at: Date
  updated_at: Date
  constructor(user: IUser) {
    const date = new Date()
    this._id = user._id || new ObjectId()
    this.email = user.email
    this.password = user.password
    this.phone = user.phone
    this.name = user.name
    this.gender = user.gender || GENDER_TYPE.Male
    this.date_of_birth = user.date_of_birth || new Date().toISOString()
    this.identity_number = user.identity_number || ''
    this.address = user.address || { houseNumber_street: '', province: '', district: '', ward: '' }
    this.avatar = user.avatar || { public_id: '', url: '' }
    this.email_verify_token = user.email_verify_token || null
    this.forgot_password_token = user.forgot_password_token || null
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.is_active = user.is_active || PARTNER_STATUS.INACTIVE
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
  }
}
