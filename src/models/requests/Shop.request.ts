import { IAddress, IImage } from '../schemas/Partner.schema'
import { ShopStyles } from '../schemas/Shop.schemas'

export interface ShopRequestBody {
  shop_image: IImage
  shop_name: string
  description: string
  shop_style: ShopStyles
  shop_address: IAddress
  hotline: string
  open_time: string
  close_time: string
  partner_id?: string
}
