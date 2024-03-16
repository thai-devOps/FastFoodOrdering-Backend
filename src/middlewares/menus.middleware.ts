import { checkSchema } from 'express-validator'
import response_messages from '~/constants/messages'
import validateSchema from '~/utils/validationSchema'

const createMenuValidator = validateSchema(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: response_messages.menu.name
        }
      },
      description: {
        notEmpty: {
          errorMessage: response_messages.menu.description
        }
      },
      shop_id: {
        notEmpty: {
          errorMessage: response_messages.menu.shop_id
        }
      },
      is_draft: {
        optional: true,
        isBoolean: {
          errorMessage: 'is_draft must be a boolean'
        }
      },
      is_active: {
        optional: true,
        isBoolean: {
          errorMessage: 'is_active must be a boolean'
        }
      }
    },
    ['body']
  )
)
const menuMiddlewares = {
  createMenuValidator
}
export default menuMiddlewares
