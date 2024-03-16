import { ObjectId } from 'mongodb'

interface IOption {
  _id?: ObjectId
  name: string
  price: number
  food_option_id: ObjectId
  created_at?: Date
  updated_at?: Date
}
export class Option {
  _id: ObjectId
  name: string
  price: number
  food_option_id: ObjectId
  created_at: Date
  updated_at: Date
  constructor(option: IOption) {
    const date = new Date()
    this._id = option._id || new ObjectId()
    this.name = option.name
    this.price = option.price
    this.food_option_id = option.food_option_id
    this.created_at = option.created_at || date
    this.updated_at = option.updated_at || date
  }
}
