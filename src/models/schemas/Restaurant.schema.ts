import { ObjectId } from 'mongodb'
import { RESTAURANT_STATUS, RestaurantStyle } from '~/constants/enums'
import { IAddress } from './Partner.schema'

interface IRestaurant {
  _id?: ObjectId
  r_background: {
    url: string
    public_id: string
  }
  restaurant_name: string
  description: string
  restaurant_cuisine: string
  restaurant_style: RestaurantStyle
  open_time: string
  close_time: string
  restaurant_address: IAddress
  hotline: string
  is_active?: RESTAURANT_STATUS
  partner_id: ObjectId
  created_at?: Date
  updated_at?: Date
}
export class Restaurant {
  _id: ObjectId
  r_background: {
    url: string
    public_id: string
  }
  restaurant_name: string
  restaurant_cuisine: string
  description: string
  restaurant_style: RestaurantStyle
  open_time: string
  close_time: string
  restaurant_address: IAddress
  hotline: string
  partner_id: ObjectId
  is_active: RESTAURANT_STATUS
  created_at: Date
  updated_at: Date
  constructor(restaurant: IRestaurant) {
    const date = new Date()
    this._id = restaurant._id || new ObjectId()
    this.r_background = restaurant.r_background
    this.description = restaurant.description
    this.restaurant_name = restaurant.restaurant_name
    this.restaurant_cuisine = restaurant.restaurant_cuisine
    this.restaurant_style = restaurant.restaurant_style
    this.open_time = restaurant.open_time
    this.close_time = restaurant.close_time
    this.restaurant_address = restaurant.restaurant_address
    this.hotline = restaurant.hotline
    this.is_active = restaurant.is_active || RESTAURANT_STATUS.PENDING
    this.partner_id = restaurant.partner_id
    this.created_at = restaurant.created_at || date
    this.updated_at = restaurant.updated_at || date
  }
}
