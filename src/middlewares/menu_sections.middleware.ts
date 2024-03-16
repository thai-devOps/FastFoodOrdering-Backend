import { checkSchema } from 'express-validator'
import validateSchema from '~/utils/validationSchema'

const createMenuSectionValidator = validateSchema(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: 'Name is required'
        }
      },
      description: {
        notEmpty: {
          errorMessage: 'Description is required'
        }
      },
      menuId: {
        notEmpty: {
          errorMessage: 'Menu id is required'
        }
      }
    },
    ['body']
  )
)
const menuSectionMiddlewares = {
  createMenuSectionValidator
}
export default menuSectionMiddlewares
