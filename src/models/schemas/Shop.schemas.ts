import { ObjectId } from 'mongodb'
import { IAddress, IImage } from './Partner.schema'
// ENUM('quán ăn', 'nhậu-lẩu-nướng', 'quán cà phê', 'quán trà sữa', 'quán bánh', 'quán nước')
export enum ShopStyles {
  FOOD = 'quán ăn',
  DRINK = 'nhậu-lẩu-nướng',
  COFFEE = 'quán cà phê',
  MILK_TEA = 'quán trà sữa',
  DESSERT = 'quán bánh',
  BEVERAGE = 'quán nước'
}
interface ISHOP {
  _id?: ObjectId
  shop_image: IImage
  shop_name: string
  description: string
  shop_style: ShopStyles
  shop_address: IAddress
  hotline: string
  open_time: string
  close_time: string
  is_active?: boolean
  rating?: number
  partner_id: ObjectId
  created_at?: Date
  updated_at?: Date
}
export class Shop {
  _id: ObjectId
  shop_image: IImage
  shop_name: string
  description: string
  shop_style: ShopStyles
  shop_address: IAddress
  hotline: string
  open_time: string
  close_time: string
  is_active: boolean
  rating: number
  partner_id: ObjectId
  created_at: Date
  updated_at: Date
  constructor(shop: ISHOP) {
    const date = new Date()
    this._id = shop._id || new ObjectId()
    this.shop_image = shop.shop_image
    this.shop_name = shop.shop_name
    this.description = shop.description
    this.shop_style = shop.shop_style
    this.shop_address = shop.shop_address
    this.hotline = shop.hotline
    this.open_time = shop.open_time
    this.close_time = shop.close_time
    this.is_active = shop.is_active || false
    this.rating = shop.rating || 0
    this.partner_id = shop.partner_id
    this.created_at = shop.created_at || date
    this.updated_at = shop.updated_at || date
  }
}

