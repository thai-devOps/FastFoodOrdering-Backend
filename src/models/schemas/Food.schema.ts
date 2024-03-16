import { ObjectId } from 'mongodb'
import { IImage } from './Partner.schema'

export enum DiscountType {
  PERCENTAGE = 'percentage',
  AMOUNT = 'amount'
}
export enum SellingStatus {
  IN_STORE = 'in_store',
  WAITING = 'waiting',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

interface IFood {
  _id?: ObjectId
  name: string
  description: string
  sold?: number
  favorites?: number
  cost_of_goods_sold: number
  price: number
  discount?: {
    status: boolean
    type: DiscountType
    value: number
  }
  publish_status: boolean // true for published, false for unpublished
  is_selling: SellingStatus // three status: waiting for approval, approved, rejected
  menu_section_id: ObjectId
  shop_id: ObjectId
  quantity: number
  image: IImage
  created_at?: Date
  updated_at?: Date
}
export class Food {
  _id: ObjectId
  name: string
  description: string
  sold: number
  favorites: number
  cost_of_goods_sold: number
  price: number
  discount: {
    status: boolean
    type: DiscountType
    value: number
  }
  publish_status: boolean
  is_selling: SellingStatus
  menu_section_id: ObjectId
  shop_id: ObjectId
  quantity: number
  image: IImage
  created_at: Date
  updated_at: Date
  constructor(food: IFood) {
    const date = new Date()
    this._id = food._id || new ObjectId()
    this.name = food.name
    this.description = food.description
    this.sold = food.sold || 0
    this.cost_of_goods_sold = food.cost_of_goods_sold
    this.favorites = food.favorites || 0
    this.discount = food.discount || { status: false, type: DiscountType.PERCENTAGE, value: 0 }
    this.publish_status = food.publish_status
    this.is_selling = food.is_selling
    this.price = food.price
    this.menu_section_id = food.menu_section_id
    this.shop_id = food.shop_id
    this.quantity = food.quantity
    this.image = food.image
    this.created_at = food.created_at || date
    this.updated_at = food.updated_at || date
  }
}
