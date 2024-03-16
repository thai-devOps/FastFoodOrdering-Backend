import { ObjectId } from 'mongodb'
import { GENDER_TYPE, PARTNER_STATUS, UserVerifyStatus } from '~/constants/enums'
export interface IAddress {
  province: string // Tỉnh/Thành phố
  district: string // Quận/Huyện
  ward: string // Phường/Xã
  houseNumber_street: string // Số nhà, tên đường
}
export interface IImage {
  url: string
  public_id: string
}
interface IPartner {
  _id?: ObjectId
  user_id: ObjectId
}
export default class Partner {
  _id: ObjectId
  user_id: ObjectId
  constructor(partner: IPartner) {
    this._id = partner._id || new ObjectId()
    this.user_id = partner.user_id
  }
}
