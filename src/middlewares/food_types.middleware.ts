import { checkSchema } from 'express-validator'
import validateSchema from '~/utils/validationSchema'

const createFoodTypeValidator = validateSchema(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: 'Name is required'
        }
      },
      value: {
        notEmpty: {
          errorMessage: 'Icon is required'
        }
      }
    },
    ['body']
  )
)
const foodTypeMiddlewares = {
  createFoodTypeValidator
}
export default foodTypeMiddlewares
