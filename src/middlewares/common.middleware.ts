import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import envConfig from '~/constants/config'
import { TOKEN_TYPE, UserRole, UserVerifyStatus } from '~/constants/enums'
import response_messages from '~/constants/messages'
import statusCode from '~/constants/statusCode'
import userServices from '~/services/users.service'
import { TokenPayload } from '~/type'
import hashPassword from '~/utils/crypto'
import { ErrorWithStatus, UnauthorizedError } from '~/utils/errors'
import jwtModule from '~/utils/jwt'
import validateSchema from '~/utils/validationSchema'

const registerValidator = validateSchema(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: response_messages.unprocessable_entity.errors.register.name.notEmpty
        },
        isLength: {
          errorMessage: response_messages.unprocessable_entity.errors.register.name.isLength,
          options: { min: 2, max: 50 }
        },
        isString: {
          errorMessage: response_messages.unprocessable_entity.errors.register.name.isString
        }
      },
      email: {
        notEmpty: {
          errorMessage: response_messages.unprocessable_entity.errors.register.email.notEmpty
        },
        isEmail: {
          errorMessage: response_messages.unprocessable_entity.errors.register.email.isEmail
        },
        isString: {
          errorMessage: response_messages.unprocessable_entity.errors.register.email.isString
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const email = value as string
            const exist_email = await userServices.findUserByEmail(email)
            if (exist_email) {
              throw new Error(response_messages.unprocessable_entity.errors.register.email.existedEmail)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: response_messages.unprocessable_entity.errors.register.password.notEmpty
        },
        isLength: {
          errorMessage: response_messages.unprocessable_entity.errors.register.password.isLength,
          options: { min: 6, max: 160 }
        }
      },
      password_confirmation: {
        optional: true,
        isLength: {
          errorMessage: response_messages.unprocessable_entity.errors.register.password_confirmation.isLength,
          options: { min: 6, max: 30 }
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(response_messages.unprocessable_entity.errors.register.password_confirmation.doesNotMatch)
            }
            return true
          }
        }
      },
      phone: {
        notEmpty: {
          errorMessage: response_messages.unprocessable_entity.errors.register.phone.notEmpty
        },
        isMobilePhone: {
          errorMessage: response_messages.unprocessable_entity.errors.register.phone.isMobilePhone,
          options: 'vi-VN'
        }
      }
    },
    ['body']
  )
)
const loginValidator = validateSchema(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: response_messages.unprocessable_entity.errors.login.email.notEmpty
      },
      isEmail: {
        errorMessage: response_messages.unprocessable_entity.errors.login.email.isEmail
      },
      isString: {
        errorMessage: response_messages.unprocessable_entity.errors.login.email.isString
      }
    },
    password: {
      notEmpty: {
        errorMessage: response_messages.unprocessable_entity.errors.login.password.notEmpty
      },
      isLength: {
        errorMessage: response_messages.unprocessable_entity.errors.login.password.isLength,
        options: { min: 6, max: 160 }
      }
    }
  })
)
const verifyEmailValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.query.token)
      throw new ErrorWithStatus({
        message: response_messages.unauthorized.verify_email.error,
        status: 401
      })
    const { token } = req.query
    // verify token
    const user = await jwtModule.verifyToken({
      token: token as string,
      secretKey: envConfig.EMAIL_VERIFY_TOKEN_SECRET_KEY as string
    })
    if (!user) {
      throw new ErrorWithStatus({
        message: response_messages.unauthorized.verify_email.error,
        status: 401
      })
    }
    req.decoded_email_verify_token = user
    next()
  } catch (error) {
    next(error)
  }
}
const verifiedUserValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { verify } = req.decoded_access_token as TokenPayload
    if (verify !== UserVerifyStatus.Verified) {
      throw new ErrorWithStatus({
        message: response_messages.unauthorized.verify_email.error,
        status: statusCode.FORBIDDEN // 403
      })
    }
    next()
  } catch (error) {
    next(error)
  }
}
const isVerifiedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { verify } = req.decoded_access_token as TokenPayload
    if (verify !== UserVerifyStatus.Verified) {
      throw new UnauthorizedError({
        message: response_messages.unauthorized.verify_email.unverified,
        errors: { message: response_messages.unauthorized.verify_email.unverified, type: TOKEN_TYPE.EMAIL_VERIFY_TOKEN }
      })
    }
    next()
  } catch (error) {
    next(error)
  }
}
const isPartner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.decoded_access_token as TokenPayload
    if (role !== UserRole.Partner) {
      throw new UnauthorizedError({
        message: response_messages.unauthorized.access_denied,
        errors: { message: response_messages.unauthorized.access_denied, type: TOKEN_TYPE.ACCESS_TOKEN }
      })
    }
    next()
  } catch (error) {
    next(error)
  }
}
const checkLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const user = await userServices.findUserByEmail(email)
    if (!user) {
      throw new ErrorWithStatus({
        message: response_messages.unprocessable_entity.errors.login.error,
        status: 401
      })
    }
    if (user.password !== hashPassword(password)) {
      throw new ErrorWithStatus({
        message: response_messages.unprocessable_entity.errors.login.error,
        status: 401
      })
    }
    req.partner = user
    next()
  } catch (e) {
    next(e)
  }
}
const commonMiddlewares = {
  loginValidator,
  checkLogin,
  registerValidator,
  verifyEmailValidator,
  verifiedUserValidator,
  isVerifiedUser,
  isPartner
}
export default commonMiddlewares
