import { ObjectId } from 'mongodb'

interface IRefreshToken {
  _id?: ObjectId
  user_id: string
  token: string
  iat: number
  exp: number
  created_at?: Date
}
export default class RefreshToken {
  _id: ObjectId
  user_id: string
  token: string
  iat: number
  exp: number
  created_at: Date
  constructor(refresh_token: IRefreshToken) {
    this._id = refresh_token._id || new ObjectId()
    this.user_id = refresh_token.user_id
    this.token = refresh_token.token
    this.iat = refresh_token.iat
    this.exp = refresh_token.exp
    this.created_at = refresh_token.created_at || new Date()
  }
}
