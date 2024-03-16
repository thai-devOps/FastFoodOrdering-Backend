import { GENDER_TYPE, PARTNER_STATUS, UserVerifyStatus } from '~/constants/enums'
import { IAddress, IImage } from '../schemas/Partner.schema'

export interface PartnerRegisterRequest {
  email: string
  password: string
  name: string
  phone: string
}
export interface PartnerProfileRequest {
  avatar?: IImage
  name: string
  phone: string
  address: IAddress
  gender: GENDER_TYPE
  identity_card: string
  date_of_birth: string
}
export interface PartnerLoginRequest {
  email: string
  password: string
}
