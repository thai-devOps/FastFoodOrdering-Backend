import { ObjectId } from 'mongodb'

interface IFoodOptions {
  _id?: ObjectId
  name: string
  isSingleSelect: boolean
  food_id: ObjectId
  created_at?: Date
  updated_at?: Date
}
export class FoodOptions {
  _id: ObjectId
  name: string
  isSingleSelect: boolean
  food_id: ObjectId
  created_at: Date
  updated_at: Date
  constructor(foodOptions: IFoodOptions) {
    const date = new Date()
    this._id = foodOptions._id || new ObjectId()
    this.name = foodOptions.name
    this.isSingleSelect = foodOptions.isSingleSelect
    this.food_id = foodOptions.food_id
    this.created_at = foodOptions.created_at || date
    this.updated_at = foodOptions.updated_at || date
  }
}
