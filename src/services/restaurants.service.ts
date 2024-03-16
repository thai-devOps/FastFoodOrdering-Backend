import { RestaurantRequestBody } from '~/models/requests/Restaurant.request'
import databaseSetvices from './database.service'
import { Restaurant } from '~/models/schemas/Restaurant.schema'
import { ObjectId } from 'mongodb'
import { RESTAURANT_STATUS } from '~/constants/enums'

class RestaurantService {
  public async createRestaurant(partner_id: string, restaurant: RestaurantRequestBody) {
    return await databaseSetvices.restaurants.insertOne(
      new Restaurant({
        ...restaurant,
        partner_id: new ObjectId(partner_id)
      })
    )
  }
  public async updateRestaurantStatus(partner_id: string, restaurant_id: string, status: RESTAURANT_STATUS) {
    return await databaseSetvices.restaurants.updateOne(
      { _id: new ObjectId(restaurant_id), partner_id: new ObjectId(partner_id) },
      { $set: { is_active: status, updated_at: new Date() } }
    )
  }
  public async getRestaurantById(id: string) {
    return await databaseSetvices.restaurants.findOne({ _id: new ObjectId(id) })
  }
  // get restaurants by partner_id
  public async getRestaurantsByPartnerId(partner_id: string) {
    return await databaseSetvices.restaurants.findOne({ partner_id: new ObjectId(partner_id) })
  }
  // update restaurant
  public async updateRestaurant(partner_id: string, restaurant_id: string, restaurant: RestaurantRequestBody) {
    return await databaseSetvices.restaurants.updateOne(
      { _id: new ObjectId(restaurant_id), partner_id: new ObjectId(partner_id) },
      { $set: { ...restaurant, _id: new ObjectId(restaurant_id), updated_at: new Date() } }
    )
  }
}
const restaurantService = new RestaurantService()
export default restaurantService
