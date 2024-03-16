import { checkSchema } from 'express-validator'
import validateSchema from '~/utils/validationSchema'

const createCategoryValidator = validateSchema(
  checkSchema({
    name: {
      in: ['body'],
      isString: true,
      notEmpty: {
        errorMessage: 'Name is required'
      },
      isLength: {
        errorMessage: 'Name should be at least 3 characters long',
        options: { min: 3 }
      }
    },
    description: {
      in: ['body'],
      isString: true,
      notEmpty: {
        errorMessage: 'Description is required'
      },
      isLength: {
        errorMessage: 'Description should be at least 3 characters long',
        options: { min: 3 }
      }
    }
  })
)
const categoryMiddlewares = {
  createCategoryValidator
}
export default categoryMiddlewares
