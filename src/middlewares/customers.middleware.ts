import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import response_messages from '~/constants/messages'
import customerServices from '~/services/customers.service'
import hashPassword from '~/utils/crypto'
import { ErrorWithStatus } from '~/utils/errors'
import validateSchema from '~/utils/validationSchema'
import { ParamsDictionary } from 'express-serve-static-core'
import { CustomerLoginRequest } from '~/models/requests/Customer.request'
import jwtModule from '~/utils/jwt'
import envConfig from '~/constants/config'
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
        custom: {
          options: async (value, { req }) => {
            const customer = await customerServices.findCustomerByEmail(value)
            if (customer) {
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
          options: { min: 6, max: 30 }
        }
      },
      password_confirmation: {
        notEmpty: {
          errorMessage: response_messages.unprocessable_entity.errors.register.password_confirmation.notEmpty
        },
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
      },
      address: {
        notEmpty: {
          errorMessage: response_messages.unprocessable_entity.errors.register.address
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
        options: { min: 6, max: 30 }
      }
    }
  })
)
const checkLoginSuccess = async (
  req: Request<ParamsDictionary, any, CustomerLoginRequest, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    const customer = await customerServices.findCustomerByEmail(email)
    if (!customer) {
      throw new ErrorWithStatus({
        message: response_messages.unprocessable_entity.errors.login.error,
        status: 401
      })
    }
    if (customer.password !== hashPassword(password)) {
      throw new ErrorWithStatus({
        message: response_messages.unprocessable_entity.errors.login.error,
        status: 401
      })
    }
    req.customer = customer
    next()
  } catch (e) {
    next(e)
  }
}
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
  } catch (e) {
    next(e)
  }
}
const logoutValidator = () => {}
const customerMiddlewares = {
  registerValidator,
  loginValidator,
  checkLoginSuccess,
  verifyEmailValidator,
  logoutValidator
}
export default customerMiddlewares
