import RefreshToken from '~/models/schemas/RefreshToken.schema'
import databaseSetvices from './database.service'

class RefreshTokenServices {
  public async createRefreshToken({
    user_id,
    token,
    iat,
    exp
  }: {
    user_id: string
    token: string
    iat: number
    exp: number
  }) {
    return await databaseSetvices.refresh_tokens.insertOne(
      new RefreshToken({
        user_id,
        token,
        exp,
        iat
      })
    )
  }
  public async findRefreshToken({ token }: { token: string }) {
    return await databaseSetvices.refresh_tokens.findOne({ token })
  }
  public async deleteRefreshToken({ token }: { token: string }) {
    return await databaseSetvices.refresh_tokens.deleteOne({ token })
  }
}
const refreshTokenServices = new RefreshTokenServices()
export default refreshTokenServices
