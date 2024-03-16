import { MenuSectionRequestBody } from '~/models/requests/MenuSection.request'
import databaseSetvices from './database.service'
import { ObjectId } from 'mongodb'
import { MenuSection } from '~/models/schemas/MenuSection.schema'

class menuSectionServices {
  public async create(payload: MenuSectionRequestBody) {
    return await databaseSetvices.menu_sections.insertOne(
      new MenuSection({
        name: payload.name,
        description: payload.description,
        menuId: new ObjectId(payload.menuId)
      })
    )
  }
  public async getByMenuId(m_id: string) {
    return await databaseSetvices.menu_sections.find({ menuId: new ObjectId(m_id) }).toArray()
  }
  public async getById(ms_id: string) {
    return await databaseSetvices.menu_sections.findOne({ _id: new ObjectId(ms_id) })
  }
  public async updateById(ms_id: string, payload: MenuSectionRequestBody) {
    return await databaseSetvices.menu_sections.updateOne(
      { _id: new ObjectId(ms_id) },
      {
        $set: {
          name: payload.name,
          description: payload.description,
          updated_at: new Date()
        }
      }
    )
  }
  public async deleteById(ms_id: string) {
    try {
      // Find all foods associated with the given menu section id
      const foods = await databaseSetvices.food.find({ menu_section_id: new ObjectId(ms_id) }).toArray()

      // Extract food ids from the result
      const foodIds = foods.map((food) => new ObjectId(food._id))

      // Delete all foods associated with the given menu section id
      await databaseSetvices.food.deleteMany({ menu_section_id: new ObjectId(ms_id) })

      // Delete all food categories associated with the deleted foods
      await databaseSetvices.food_categories.deleteMany({ food_id: { $in: foodIds } })

      // Delete all food options associated with the deleted foods
      await databaseSetvices.food_options.deleteMany({ food_id: { $in: foodIds } })

      // Delete all options associated with the deleted food options
      await databaseSetvices.options.deleteMany({ food_option_id: { $in: foodIds } })

      // Delete the menu section itself
      await databaseSetvices.menu_sections.deleteOne({ _id: new ObjectId(ms_id) })
      // Return success
      return { success: true, message: 'Menu section and associated data deleted successfully.' }
    } catch (error) {
      // Handle errors
      console.error('Error deleting menu section:', error)
      return { success: false, message: 'An error occurred while deleting menu section.' }
    }
  }
}
const menuCategoriesService = new menuSectionServices()
export default menuCategoriesService
