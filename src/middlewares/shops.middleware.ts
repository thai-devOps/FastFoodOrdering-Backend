import { Request } from 'express'
import { checkSchema } from 'express-validator'
import shopServices from '~/services/shops.service'
import validateSchema from '~/utils/validationSchema'
/**
 * shop_image: IImage
  shop_name: string
  description: string
  shop_style: ShopStyles
  shop_address: IAddress
  hotline: string
  open_time: string
  close_time: string
  partner_id: string
 */
const shops_response_messages = {
  shop_image: {
    notEmpty: 'shop_image is required'
  },
  shop_name: {
    notEmpty: 'shop_name is required',
    isString: 'shop_name must be a string'
  },
  description: {
    notEmpty: 'description is required',
    isString: 'description must be a string'
  },
  shop_style: {
    notEmpty: 'shop_style is required',
    isString: 'shop_style must be a string'
  },
  shop_address: {
    notEmpty: 'shop_address is required'
  },
  hotline: {
    notEmpty: 'hotline is required',
    isString: 'hotline must be a string'
  },
  open_time: {
    notEmpty: 'open_time is required',
    isString: 'open_time must be a string'
  },
  close_time: {
    notEmpty: 'close_time is required',
    isString: 'close_time must be a string'
  },
  partner_id: {
    notEmpty: 'partner_id is required',
    isString: 'partner_id must be a string'
  }
}
const createShopValidator = validateSchema(
  checkSchema(
    {
      shop_image: {
        notEmpty: {
          errorMessage: shops_response_messages.shop_image.notEmpty
        }
      },
      shop_name: {
        notEmpty: {
          errorMessage: shops_response_messages.shop_name.notEmpty
        },
        isString: {
          errorMessage: shops_response_messages.shop_name.isString
        },
        custom: {
          options: async (value, { req }) => {
            const shop = await shopServices.getShopByName(value)
            const { id } = (req as Request).params
            if (id && shop && id !== shop._id.toString()) {
              return Promise.reject('Shop name already exists')
            }
            return true
          }
        }
      },
      description: {
        notEmpty: {
          errorMessage: shops_response_messages.shop_name.notEmpty
        },
        isString: {
          errorMessage: shops_response_messages.shop_name.isString
        }
      },
      shop_style: {
        notEmpty: {
          errorMessage: shops_response_messages.shop_style.notEmpty
        },
        isString: {
          errorMessage: shops_response_messages.shop_style.isString
        }
      },
      shop_address: {
        notEmpty: {
          errorMessage: shops_response_messages.shop_address.notEmpty
        }
      },
      hotline: {
        notEmpty: {
          errorMessage: shops_response_messages.hotline.notEmpty
        },
        isString: {
          errorMessage: shops_response_messages.hotline.isString
        }
      },
      open_time: {
        notEmpty: {
          errorMessage: shops_response_messages.open_time.notEmpty
        },
        isString: {
          errorMessage: shops_response_messages.open_time.isString
        }
      },
      close_time: {
        notEmpty: {
          errorMessage: shops_response_messages.close_time.notEmpty
        },
        isString: {
          errorMessage: shops_response_messages.close_time.isString
        }
      }
    },
    ['body']
  )
)
const shopMiddlewares = {
  createShopValidator
}
export default shopMiddlewares
