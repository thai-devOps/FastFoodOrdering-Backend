import { ObjectId } from 'mongodb'
import { IImage } from './Partner.schema'
interface IFoodType {
  _id?: ObjectId
  name: string
  value: string
  created_at?: Date
  updated_at?: Date
}
export class FoodType {
  _id: ObjectId
  value: string
  name: string
  created_at?: Date
  updated_at?: Date
  constructor(label: IFoodType) {
    const date = new Date()
    this._id = label._id || new ObjectId()
    this.value = label.value
    this.name = label.name
    this.created_at = label.created_at || date
    this.updated_at = label.updated_at || date
  }
}
