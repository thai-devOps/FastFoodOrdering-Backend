import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import response_messages from '~/constants/messages'
import adminServices from '~/services/admin.service'
import { verifyAccessToken, verifyRefreshToken } from '~/utils/common'
import validateSchema from '~/utils/validationSchema'
import { ParamsDictionary } from 'express-serve-static-core'
import { AdminLoginRequest } from '~/models/requests/Admin.request'
import { ErrorWithStatus } from '~/utils/errors'
import hashPassword from '~/utils/crypto'
const accessTokenValidator = validateSchema(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: response_messages.unauthorized.access_token.required
        },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1]
            return await verifyAccessToken(access_token, req as Request)
          }
        }
      }
    },
    ['headers']
  )
)
const refreshTokenValidator = validateSchema(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: response_messages.unauthorized.refresh_token.required
        },
        custom: {
          options: async (value: string, { req }) => {
            const refresh_token = value as string
            return await verifyRefreshToken(refresh_token, req as Request)
          }
        }
      }
    },
    ['body']
  )
)
const checkAdminLoginSuccess = async (
  req: Request<ParamsDictionary, any, AdminLoginRequest, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    const admin = await adminServices.findAdminByEmail(email)
    if (!admin) {
      throw new ErrorWithStatus({
        message: response_messages.unprocessable_entity.errors.login.error,
        status: 401
      })
    }
    if (admin.password !== hashPassword(password)) {
      throw new ErrorWithStatus({
        message: response_messages.unprocessable_entity.errors.login.error,
        status: 401
      })
    }
    req.admin = admin
    next()
  } catch (e) {
    next(e)
  }
}
const authMiddlewares = {
  accessTokenValidator,
  refreshTokenValidator,
  checkAdminLoginSuccess
}
export default authMiddlewares
