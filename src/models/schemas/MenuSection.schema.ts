import { ObjectId } from 'mongodb'

interface IMenuSection {
  _id?: ObjectId
  name: string
  description: string
  menuId: ObjectId
  created_at?: Date
  updated_at?: Date
}
export class MenuSection {
  _id: ObjectId
  name: string
  description: string
  menuId: ObjectId
  created_at: Date
  updated_at: Date
  constructor(data: IMenuSection) {
    const date = new Date()
    this._id = data._id || new ObjectId()
    this.name = data.name
    this.description = data.description
    this.menuId = data.menuId
    this.created_at = data.created_at || date
    this.updated_at = data.updated_at || date
  }
}
