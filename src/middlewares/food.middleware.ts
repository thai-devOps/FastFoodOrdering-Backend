import { checkSchema } from 'express-validator'
import validateSchema from '~/utils/validationSchema'
/**
 * name: string
  description: string
  price_before_discount: number
  price: number
  menu_section_id: string
  shop_id: string
  quantity: number
  image: IImage
  categories: string[]
  discount: {
    status: boolean
    type: DiscountType
    value: number
  }
  publish_status: boolean // true for published, false for unpublished
  is_selling: SellingStatus
 */
const createFoodValidator = validateSchema(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: 'name is required'
        }
      },
      categories: {
        notEmpty: {
          errorMessage: 'categories is required'
        }
      },
      description: {
        notEmpty: {
          errorMessage: 'description is required'
        }
      },
      price: {
        notEmpty: {
          errorMessage: 'price is required'
        },
        isNumeric: {
          errorMessage: 'price must be a number'
        }
      },
      cost_of_goods_sold: {
        notEmpty: {
          errorMessage: 'cost_of_goods_sold is required'
        },
        isNumeric: {
          errorMessage: 'cost_of_goods_sold must be a number'
        }
      },
      menu_section_id: {
        notEmpty: {
          errorMessage: 'menu_section_id is required'
        }
      },
      shop_id: {
        notEmpty: {
          errorMessage: 'shop_id is required'
        }
      },
      discount: {
        notEmpty: {
          errorMessage: 'discount is required'
        }
      },
      publish_status: {
        notEmpty: {
          errorMessage: 'publish_status is required'
        }
      },
      is_selling: {
        notEmpty: {
          errorMessage: 'is_selling is required'
        }
      },
      quantity: {
        notEmpty: {
          errorMessage: 'quantity is required'
        },
        isNumeric: {
          errorMessage: 'quantity must be a number'
        }
      },
      image: {
        notEmpty: {
          errorMessage: 'image is required'
        }
      }
    },
    ['body']
  )
)
const foodMiddlewares = {
  createFoodValidator
}
export default foodMiddlewares
