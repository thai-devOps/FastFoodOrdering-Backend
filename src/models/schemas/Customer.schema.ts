import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'

interface ICustomer {
  _id?: ObjectId
  name: string
  phone: string
  date_of_birth?: string
  email: string
  address: string
  password: string
  avatar?: string
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  created_at?: Date
  updated_at?: Date
}
export default class Customer {
  _id: ObjectId
  name: string
  email: string
  address: string
  phone: string
  password: string
  date_of_birth: string
  avatar: string
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus
  created_at: Date
  updated_at: Date
  constructor(customer: ICustomer) {
    const date = new Date()
    this._id = customer._id || new ObjectId()
    this.name = customer.name
    this.phone = customer.phone
    this.email = customer.email
    this.date_of_birth = customer.date_of_birth || ''
    this.address = customer.address
    this.password = customer.password
    this.avatar = customer.avatar || ''
    this.email_verify_token = customer.email_verify_token || ''
    this.forgot_password_token = customer.forgot_password_token || ''
    this.verify = customer.verify || UserVerifyStatus.Unverified
    this.created_at = customer.created_at || date
    this.updated_at = customer.updated_at || date
  }
}
