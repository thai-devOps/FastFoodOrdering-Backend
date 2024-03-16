import { DiscountType, Food, SellingStatus } from '../schemas/Food.schema'
import { IImage } from '../schemas/Partner.schema'
import { FoodOptionRequestBody, FoodOptionsEditRequestBody } from './FoodOptions.request'

export interface FoodRequestBody {
  name: string
  description: string
  price_before_discount: number
  price: number
  cost_of_goods_sold: number
  menu_section_id: string
  shop_id: string
  quantity: number
  image: IImage
  categories: string[]
  foodOptions: FoodOptionRequestBody[]
  discount: {
    status: boolean
    type: DiscountType
    value: number
  }
  publish_status: boolean // true for published, false for unpublished
  is_selling: SellingStatus // three status: waiting for approval, approved, rejected
}
export type FoodEditRequestBody = Food & { categories: string[]; food_options: FoodOptionsEditRequestBody[] }
