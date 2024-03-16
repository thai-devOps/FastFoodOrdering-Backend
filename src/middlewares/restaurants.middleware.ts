import { checkSchema } from 'express-validator'
import validateSchema from '~/utils/validationSchema'

const createRestaurantValidator = validateSchema(
  checkSchema(
    {
      r_background: {
        notEmpty: {
          errorMessage: 'Background is required'
        }
      },
      restaurant_name: {
        notEmpty: {
          errorMessage: 'Restaurant name is required'
        }
      },
      description: {
        notEmpty: {
          errorMessage: 'Description is required'
        }
      },
      restaurant_cuisine: {
        notEmpty: {
          errorMessage: 'Restaurant cuisine is required'
        }
      },
      restaurant_style: {
        notEmpty: {
          errorMessage: 'Restaurant style is required'
        }
      },
      open_time: {
        notEmpty: {
          errorMessage: 'Open time is required'
        }
      },
      close_time: {
        notEmpty: {
          errorMessage: 'Close time is required'
        }
      },
      hotline: {
        notEmpty: {
          errorMessage: 'Hotline is required'
        }
      },
      restaurant_address: {
        notEmpty: {
          errorMessage: 'Restaurant address is required'
        }
      }
    },
    ['body']
  )
)

const restaurantMiddlewares = {
  createRestaurantValidator
}
export default restaurantMiddlewares
