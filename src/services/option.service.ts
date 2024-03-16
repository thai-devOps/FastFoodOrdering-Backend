import { OptionRequestBody } from '~/models/requests/Option.request'
import databaseSetvices from './database.service'
import { Option } from '~/models/schemas/Option.schema'
import { ObjectId } from 'mongodb'

class OptionServices {
  public async createOption(payload: OptionRequestBody, food_option_id: ObjectId | string) {
    return databaseSetvices.options.insertOne(
      new Option({
        ...payload,
        food_option_id: new ObjectId(food_option_id)
      })
    )
  }
  public async getAllOptionsByFoodOptionId(food_option_id: string) {
    return databaseSetvices.options.find({ food_option_id: new ObjectId(food_option_id) }).toArray()
  }
  public async deleteOptionsByFoodOptionId(food_option_id: string) {
    return databaseSetvices.options.deleteMany({ food_option_id: new ObjectId(food_option_id) })
  }
}
const optionServices = new OptionServices()
export default optionServices
