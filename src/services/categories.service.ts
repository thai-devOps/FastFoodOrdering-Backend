import databaseSetvices from './database.service'
import { Category } from '~/models/schemas/Category.schema'
import { ObjectId } from 'mongodb'
import { CategoryRequestBody } from '~/models/requests/Category.request'

class CategoryServices {
  public async createCategory(payload: CategoryRequestBody) {
    return await databaseSetvices.categories.insertOne(new Category({ ...payload }))
  }
  public async getCategories() {
    return await databaseSetvices.categories.find().toArray()
  }
  public async getCategoryById(id: string) {
    return await databaseSetvices.categories.findOne({ _id: new ObjectId(id) })
  }
  public async updateCategoryById(id: string, payload: CategoryRequestBody) {
    return await databaseSetvices.categories.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...payload, updated_at: new Date() } }
    )
  }
  public async deleteCategory(id: string) {
    return await databaseSetvices.categories.deleteOne({ _id: new ObjectId(id) })
  }
}
const categoryServices = new CategoryServices()
export default categoryServices
