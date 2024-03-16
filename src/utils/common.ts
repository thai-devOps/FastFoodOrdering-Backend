import { Request } from 'express'
import { ErrorWithMessage, UnauthorizedError } from './errors'
import response_messages from '~/constants/messages'
import statusCode from '~/constants/statusCode'
import jwtModule from './jwt'
import { TOKEN_TYPE } from '~/constants/enums'
import { capitalize } from 'lodash'
import { JsonWebTokenError } from 'jsonwebtoken'
import refreshTokenServices from '~/services/refresh_tokens.service'
export const verifyAccessToken = async (access_token: string, req?: Request) => {
  if (!access_token)
    throw new ErrorWithMessage({
      message: response_messages.unauthorized.access_token.required,
      status: statusCode.UNAUTHORIZED
    })
  try {
    const decoded_authorization = await jwtModule.decodedToken({
      token: access_token,
      tokenType: TOKEN_TYPE.ACCESS_TOKEN
    })
    if (req) req.decoded_access_token = decoded_authorization
    return decoded_authorization
  } catch (error) {
    if ((error as JsonWebTokenError).message === 'jwt expired') {
      throw new UnauthorizedError({
        message: response_messages.unauthorized.expired_token,
        errors: {
          message: response_messages.unauthorized.access_token.expired,
          type: TOKEN_TYPE.ACCESS_TOKEN
        }
      })
    } else throw new ErrorWithMessage({ message: (error as JsonWebTokenError).message, status: statusCode.UNAUTHORIZED })
  }
}
export const verifyRefreshToken = async (refresh_token: string, req?: Request) => {
  if (!refresh_token)
    throw new ErrorWithMessage({
      message: response_messages.unauthorized.refresh_token.required,
      status: statusCode.UNAUTHORIZED
    })
  try {
    const [decoded_authorization, refresh_token_db] = await Promise.all([
      jwtModule.decodedToken({
        token: refresh_token,
        tokenType: TOKEN_TYPE.REFRESH_TOKEN
      }),
      refreshTokenServices.findRefreshToken({ token: refresh_token })
    ])
    if (!refresh_token_db) {
      throw new ErrorWithMessage({
        message: response_messages.unauthorized.refresh_token.used_or_not_exists,
        status: statusCode.UNAUTHORIZED
      })
    }
    if (req) req.decoded_refresh_token = decoded_authorization
    return decoded_authorization
  } catch (error) {
    throw new ErrorWithMessage({
      message: capitalize((error as JsonWebTokenError).message.replace('jwt ', 'Refresh token ')),
      status: statusCode.UNAUTHORIZED
    })
  }
}
