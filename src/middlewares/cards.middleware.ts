import { checkSchema } from 'express-validator'
import validateSchema from '~/utils/validationSchema'

const createCardValidator = validateSchema(
  checkSchema(
    {
      card_number: {
        notEmpty: {
          errorMessage: 'Card number is required'
        }
      },
      is_active: {
        notEmpty: {
          errorMessage: 'Card active status is required'
        }
      },
      card_holder_name: {
        notEmpty: {
          errorMessage: 'Card holder name is required'
        }
      },
      expiration_date: {
        notEmpty: {
          errorMessage: 'Card expiration date is required'
        }
      },
      security_code: {
        notEmpty: {
          errorMessage: 'Card cvv is required'
        }
      }
    },
    ['body']
  )
)
const cardMiddlewares = {
  createCardValidator
}
export default cardMiddlewares
