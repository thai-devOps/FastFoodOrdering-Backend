import { ObjectId } from 'mongodb'
interface ICategory {
  _id?: ObjectId
  name: string
  description: string
  created_at?: Date
  updated_at?: Date
}
export class Category {
  _id: ObjectId
  name: string
  description: string
  created_at: Date
  updated_at: Date
  constructor(type: ICategory) {
    const date = new Date()
    this._id = type._id || new ObjectId()
    this.name = type.name
    this.description = type.description
    this.created_at = type.created_at || date
    this.updated_at = type.updated_at || date
  }
}
