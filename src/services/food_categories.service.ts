import { ObjectId } from 'mongodb'
import { FoodCategories } from '~/models/schemas/FoodCategories.schema'
import databaseSetvices from './database.service'

class FoodCategoriesServices {
  public async createFoodCategory(payload: { food_id: string; category_id: string }) {
    return await databaseSetvices.food_categories.insertOne(
      new FoodCategories({
        food_id: new ObjectId(payload.food_id),
        category_id: new ObjectId(payload.category_id)
      })
    )
  }
  public async getFoodCategoriesByFoodId(food_id: string) {
    return await databaseSetvices.food_categories.find({ food_id: new ObjectId(food_id) }).toArray()
  }
  public deleteFoodCategoriesByFoodId(food_id: string) {
    return databaseSetvices.food_categories.deleteMany({ food_id: new ObjectId(food_id) })
  }
  public async getFoodCategoriesByCategoryId(category_id: string) {
    return await databaseSetvices.food_categories.find({ category_id: new ObjectId(category_id) }).toArray()
  }
}
const foodCategoriesServices = new FoodCategoriesServices()
export default foodCategoriesServices
