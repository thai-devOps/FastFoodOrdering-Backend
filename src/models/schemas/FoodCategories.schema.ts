import { ObjectId } from 'mongodb'

interface IFoodCategories {
  _id?: ObjectId
  food_id: ObjectId
  category_id: ObjectId
  created_at?: Date
  updated_at?: Date
}
export class FoodCategories {
  _id: ObjectId
  food_id: ObjectId
  category_id: ObjectId
  created_at: Date
  updated_at: Date
  constructor(foodCategories: IFoodCategories) {
    const date = new Date()
    this._id = foodCategories._id || new ObjectId()
    this.food_id = foodCategories.food_id
    this.category_id = foodCategories.category_id
    this.created_at = foodCategories.created_at || date
    this.updated_at = foodCategories.updated_at || date
  }
}
