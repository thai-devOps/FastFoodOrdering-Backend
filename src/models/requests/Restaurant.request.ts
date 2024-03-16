import { RestaurantStyle } from '~/constants/enums'
import { IAddress } from '../schemas/Partner.schema'

export interface RestaurantRequestBody {
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
}
