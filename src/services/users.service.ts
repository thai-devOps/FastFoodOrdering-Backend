import { ObjectId } from 'mongodb'
import { RegisterRequestBody } from '~/models/requests/User.request'
import databaseSetvices from './database.service'
import jwtModule from '~/utils/jwt'
import { UserRole, UserVerifyStatus } from '~/constants/enums'
import { User } from '~/models/schemas/User.schema'
import hashPassword from '~/utils/crypto'

class UserServices {
  public async createUser(user: RegisterRequestBody) {
    return await databaseSetvices.users.insertOne(
      new User({
        ...user,
        password: hashPassword(user.password)
      })
    )
  }
  public async updateVerifyToken(_id: ObjectId, email_verify_token: string) {
    return await databaseSetvices.users.updateOne({ _id }, { $set: { email_verify_token, updated_at: new Date() } })
  }
  public async findUserById(_id: string | ObjectId) {
    return await databaseSetvices.users.findOne({ _id: new ObjectId(_id) })
  }
  public async findUserByEmail(email: string) {
    return await databaseSetvices.users.findOne({ email })
  }
}
const userServices = new UserServices()
export default userServices
