import { ObjectId } from 'mongodb'

interface IMenu {
  _id?: ObjectId
  name: string
  description: string
  partner_id: ObjectId
  is_draft: boolean
  is_active: boolean
  shop_id: ObjectId // This is the foreign key to the restaurant collection in the database
  created_at?: Date
  updated_at?: Date
}
export class Menu {
  _id: ObjectId
  name: string
  description: string
  partner_id: ObjectId
  is_draft: boolean
  is_active: boolean
  shop_id: ObjectId
  created_at: Date
  updated_at: Date

  constructor(menu: IMenu) {
    const date = new Date()
    this._id = menu._id || new ObjectId()
    this.name = menu.name
    this.description = menu.description
    this.partner_id = menu.partner_id
    this.is_draft = menu.is_draft
    this.is_active = menu.is_active
    this.shop_id = menu.shop_id
    this.created_at = menu.created_at || date
    this.updated_at = menu.updated_at || date
  }
}
