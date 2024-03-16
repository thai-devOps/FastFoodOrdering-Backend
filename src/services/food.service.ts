import { FoodEditRequestBody, FoodRequestBody } from '~/models/requests/Food.request'
import { Food, SellingStatus } from '~/models/schemas/Food.schema'
import databaseSetvices from './database.service'
import { ObjectId } from 'mongodb'

class FoodServices {
  public async createFood(payload: Omit<FoodRequestBody, 'categories' | 'foodOptions'>) {
    return databaseSetvices.food.insertOne(
      new Food({
        ...payload,
        is_selling: payload.is_selling as SellingStatus,
        menu_section_id: new ObjectId(payload.menu_section_id),
        shop_id: new ObjectId(payload.shop_id)
      })
    )
  }
  public async getAllFoodByMenuSectionId(menu_section_id: string) {
    return databaseSetvices.food.find({ menu_section_id: new ObjectId(menu_section_id) }).toArray()
  }
  public async getFoodById(id: string) {
    return databaseSetvices.food.findOne({ _id: new ObjectId(id) })
  }
  public async updateFood(id: string, payload: Omit<FoodEditRequestBody, 'categories' | 'food_options'>) {
    return databaseSetvices.food.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...payload,
          menu_section_id: new ObjectId(payload.menu_section_id),
          shop_id: new ObjectId(payload.shop_id),
          is_selling: payload.is_selling as SellingStatus,
          created_at: payload.created_at,
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' }
    )
  }
  public async deleteFoodById(id: string) {
    return databaseSetvices.food.findOneAndDelete({ _id: new ObjectId(id) })
  }
  public async getFoodByShopId(shop_id: string) {
    return databaseSetvices.food.find({ shop_id: new ObjectId(shop_id) }).toArray()
  }
  public async getFoodByShopIdPagination({
    shop_id,
    condition,
    food_ids,
    page,
    limit,
    sort_by,
    order_by
  }: {
    shop_id: string
    condition: any
    food_ids?: string[]
    page: number
    limit: number
    sort_by: string
    order_by: 'asc' | 'desc'
  }) {
    if (food_ids) {
      const result = await Promise.all([
        databaseSetvices.food
          .find({
            shop_id: new ObjectId(shop_id),
            _id: { $in: food_ids.map((id) => new ObjectId(id)) },
            ...condition
          })
          .sort({ [sort_by]: order_by === 'asc' ? 1 : -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .toArray(),
        databaseSetvices.food.countDocuments({ shop_id: new ObjectId(shop_id), ...condition })
      ])
      return {
        items: result[0],
        pagination: {
          total: Math.ceil(result[1] / limit),
          page,
          limit
        }
      }
    } else {
      const result = await Promise.all([
        databaseSetvices.food
          .find({
            shop_id: new ObjectId(shop_id),
            ...condition
          })
          .sort({ [sort_by]: order_by === 'asc' ? 1 : -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .toArray(),
        databaseSetvices.food.countDocuments({ shop_id: new ObjectId(shop_id), ...condition })
      ])
      return {
        items: result[0],
        pagination: {
          total: Math.ceil(result[1] / limit),
          page,
          limit
        }
      }
    }
  }
}
const foodServices = new FoodServices()
export default foodServices
