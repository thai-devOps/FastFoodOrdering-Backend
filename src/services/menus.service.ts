import { MenuRequestBody } from '~/models/requests/Menu.request'
import databaseSetvices from './database.service'
import { Menu } from '~/models/schemas/Menu.schema'
import { ObjectId } from 'mongodb'

class MenuServices {
  public async createMenu(partner_id: string, payload: MenuRequestBody) {
    const result = await this.getMenuByPartnerId(partner_id)
    if (!result)
      return await databaseSetvices.menus.insertOne(
        new Menu({
          name: payload.name,
          description: payload.description,
          shop_id: new ObjectId(payload.shop_id),
          partner_id: new ObjectId(partner_id),
          is_active: true,
          is_draft: payload.is_draft
        })
      )
    else {
      if (payload.is_active) {
        // cập nhật tất cả các menu còn lại là inactive ngoại trừ menu đang active
        await databaseSetvices.menus.updateMany(
          { partner_id: new ObjectId(partner_id) },
          {
            $set: {
              is_active: false
            }
          }
        )
        return await databaseSetvices.menus.insertOne(
          new Menu({
            name: payload.name,
            description: payload.description,
            shop_id: new ObjectId(payload.shop_id),
            partner_id: new ObjectId(partner_id),
            is_active: true,
            is_draft: payload.is_draft
          })
        )
      } else {
        return await databaseSetvices.menus.insertOne(
          new Menu({
            name: payload.name,
            description: payload.description,
            shop_id: new ObjectId(payload.shop_id),
            partner_id: new ObjectId(partner_id),
            is_active: false,
            is_draft: payload.is_draft
          })
        )
      }
    }
  }
  public async getMenusByShopId(shop_id: string) {
    return await databaseSetvices.menus.find({ shop_id: new ObjectId(shop_id) }).toArray()
  }
  public async getAllMenusByPartnerId(p_id: string) {
    return await databaseSetvices.menus.find({ partner_id: new ObjectId(p_id) }).toArray()
  }
  public async getMenuById(m_id: string) {
    return await databaseSetvices.menus.findOne({ _id: new ObjectId(m_id) })
  }
  public async getMenuByPartnerId(p_id: string) {
    return await databaseSetvices.menus.findOne({ partner_id: new ObjectId(p_id) })
  }
  public async updateMenu(m_id: string, payload: MenuRequestBody) {
    if (payload.is_active) {
      await databaseSetvices.menus.updateMany(
        { _id: { $ne: new ObjectId(m_id) } },
        {
          $set: {
            is_active: false
          }
        }
      )
      return await databaseSetvices.menus.updateOne(
        { _id: new ObjectId(m_id) },
        {
          $set: {
            name: payload.name,
            description: payload.description,
            shop_id: new ObjectId(payload.shop_id),
            is_active: true,
            is_draft: payload.is_draft
          }
        }
      )
    } else {
      return await databaseSetvices.menus.updateOne(
        { _id: new ObjectId(m_id) },
        {
          $set: {
            name: payload.name,
            description: payload.description,
            shop_id: new ObjectId(payload.shop_id),
            is_active: false,
            is_draft: payload.is_draft
          }
        }
      )
    }
  }
  public async getAllMenusByPartnerIdPagination(
    partner_id: string,
    condition: any,
    page: number,
    limit: number,
    sort_by: string,
    order: string
  ) {
    const [menusData, totalMenus] = await Promise.all([
      databaseSetvices.menus
        .find({ partner_id: new ObjectId(partner_id), ...condition })
        .sort({ [sort_by]: order === 'asc' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      databaseSetvices.menus.countDocuments({ partner_id: new ObjectId(partner_id), ...condition })
    ])
    return {
      items: menusData,
      pagination: {
        limit: totalMenus,
        page: page,
        total: Math.ceil(totalMenus / limit)
      }
    }
  }
  public async deleteMenu(m_id: string) {
    const menuSections = await databaseSetvices.menu_sections.find({ menu_id: new ObjectId(m_id) }).toArray()
    for (const menuSection of menuSections) {
      const foods = await databaseSetvices.food.find({ menu_section_id: new ObjectId(menuSection._id) }).toArray()
      for (const food of foods) {
        await databaseSetvices.food_options.deleteMany({ food_id: new ObjectId(food._id) })
      }
    }
    await databaseSetvices.food.deleteMany({
      menu_section_id: { $in: menuSections.map((section) => new ObjectId(section._id)) }
    })
    return await databaseSetvices.menus.deleteOne({ _id: new ObjectId(m_id) })
  }
  public async activeMenu(m_id: string) {
    // cập nhật tất cả các menu còn lại là inactive
    // cập nhật menu đang active
    await databaseSetvices.menus.updateMany(
      { _id: { $ne: new ObjectId(m_id) } },
      {
        $set: {
          is_active: false
        }
      }
    )
    return await databaseSetvices.menus.updateOne(
      { _id: new ObjectId(m_id) },
      {
        $set: {
          is_active: true
        }
      }
    )
  }
}
const menuServices = new MenuServices()
export default menuServices
