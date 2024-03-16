import { FoodTypeRequestBody } from '~/models/requests/FoodType.request'
import databaseSetvices from './database.service'
import { ObjectId } from 'mongodb'
import { FoodType } from '~/models/schemas/FoodType.schema'

class FoodTypeServices {
  public async create(payload: FoodTypeRequestBody) {
    return await databaseSetvices.food_types.insertOne(
      new FoodType({
        ...payload
      })
    )
  }
  public async getById(id: string) {
    return await databaseSetvices.food_types.findOne({ _id: new ObjectId(id) })
  }
  public async updateById(id: string, payload: FoodTypeRequestBody) {
    return await databaseSetvices.food_types.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...payload,
          updated_at: new Date()
        }
      }
    )
  }
  public async deleteById(id: string) {
    return await databaseSetvices.food_types.deleteOne({ _id: new ObjectId(id) })
  }
}
const foodTypeServices = new FoodTypeServices()
export default foodTypeServices
