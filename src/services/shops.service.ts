import { ShopRequestBody } from '~/models/requests/Shop.request'
import databaseSetvices from './database.service'
import { Shop } from '~/models/schemas/Shop.schemas'
import { ObjectId } from 'mongodb'

class ShopServices {
  public async createShop(payload: ShopRequestBody) {
    return databaseSetvices.shops.insertOne(new Shop({ ...payload, partner_id: new ObjectId(payload.partner_id) }))
  }
  public async getShopByPartnerId(partner_id: string) {
    return databaseSetvices.shops.findOne({ partner_id: new ObjectId(partner_id) })
  }
  public async getShopById(shop_id: string) {
    return databaseSetvices.shops.findOne({ _id: new ObjectId(shop_id) })
  }
  public async getShopByName(shop_name: string) {
    return databaseSetvices.shops.findOne({ shop_name })
  }
  public async updateShopById(shop_id: string, payload: ShopRequestBody) {
    return databaseSetvices.shops.findOneAndUpdate(
      { _id: new ObjectId(shop_id) },
      { $set: { ...payload, partner_id: new ObjectId(payload.partner_id), updated_at: new Date() } }
    )
  }
  public async updateShopStatus(partner_id: string, status: boolean) {
    return databaseSetvices.shops.findOneAndUpdate(
      { partner_id: new ObjectId(partner_id) },
      { $set: { is_active: status, updated_at: new Date() } }
    )
  }
}
const shopServices = new ShopServices()
export default shopServices
