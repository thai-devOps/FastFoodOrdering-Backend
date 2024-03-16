import { ObjectId } from 'mongodb'
interface ICard {
  _id?: ObjectId
  card_number: string
  card_holder_name: string
  expiration_date: string
  security_code: string
  account_id: ObjectId
  is_active: boolean
  created_at?: Date
  updated_at?: Date
}
export class Card {
  _id: ObjectId
  card_number: string
  card_holder_name: string
  expiration_date: string
  security_code: string
  account_id: ObjectId
  is_active: boolean
  created_at: Date
  updated_at: Date

  constructor(card: ICard) {
    const date = new Date()
    this._id = card._id || new ObjectId()
    this.card_number = card.card_number
    this.card_holder_name = card.card_holder_name
    this.expiration_date = card.expiration_date
    this.security_code = card.security_code
    this.account_id = card.account_id
    this.is_active = card.is_active
    this.created_at = card.created_at || date
    this.updated_at = card.updated_at || date
  }
}
