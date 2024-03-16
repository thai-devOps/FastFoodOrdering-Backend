import { ObjectId } from 'mongodb'
import { FoodOptionRequestBody } from '~/models/requests/FoodOptions.request'
import databaseSetvices from './database.service'
import { FoodOptions } from '~/models/schemas/FoodOptions.schema'

class FoodOptionServices {
  public async createFoodOption(payload: Omit<FoodOptionRequestBody, 'options'>, food_id: string) {
    return databaseSetvices.food_options.insertOne(
      new FoodOptions({
        ...payload,
        food_id: new ObjectId(food_id)
      })
    )
  }
  public async getAllFoodOptionsByFoodId(food_id: string) {
    return databaseSetvices.food_options.find({ food_id: new ObjectId(food_id) }).toArray()
  }
  public async deleteFoodOptionsByFoodId(food_id: string) {
    return databaseSetvices.food_options.deleteMany({ food_id: new ObjectId(food_id) })
  }
}
const foodOptionServices = new FoodOptionServices()
export default foodOptionServices
