import { checkSchema } from 'express-validator'
import response_messages from '~/constants/messages'
import validateSchema from '~/utils/validationSchema'
const updateInfoValidator = validateSchema(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: response_messages.unprocessable_entity.errors.profile.name.notEmpty
        },
        isLength: {
          errorMessage: response_messages.unprocessable_entity.errors.profile.name.isLength,
          options: { min: 2, max: 50 }
        }
      },
      phone: {
        notEmpty: {
          errorMessage: response_messages.unprocessable_entity.errors.profile.phone.notEmpty
        },
        isMobilePhone: {
          errorMessage: response_messages.unprocessable_entity.errors.profile.phone.isMobilePhone,
          options: 'vi-VN'
        }
      },
      date_of_birth: {
        notEmpty: {
          errorMessage: response_messages.unprocessable_entity.errors.profile.date_of_birth.notEmty
        },
        isDate: {
          errorMessage: response_messages.unprocessable_entity.errors.profile.date_of_birth
        },
        isISO8601: {
          errorMessage: response_messages.unprocessable_entity.errors.profile.date_of_birth.notIsISO8601
        }
      },
      gender: {
        notEmpty: {
          errorMessage: response_messages.unprocessable_entity.errors.profile.gender
        }
      },
      identity_number: {
        notEmpty: {
          errorMessage: response_messages.unprocessable_entity.errors.profile.identity_number.notEmpty
        },
        isLength: {
          errorMessage: response_messages.unprocessable_entity.errors.profile.identity_number.isLength,
          options: { min: 9, max: 12 }
        }
      },
      address: {
        notEmpty: {
          errorMessage: response_messages.unprocessable_entity.errors.profile.address
        }
      }
    },
    ['body']
  )
)
const partnerMiddlewares = {
  updateInfoValidator
}
export default partnerMiddlewares
