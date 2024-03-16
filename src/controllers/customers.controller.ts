import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import response_messages from '~/constants/messages'
import { CustomerLoginRequest, CustomerRegisterRequest } from '~/models/requests/Customer.request'
import Customer from '~/models/schemas/Customer.schema'
import customerServices from '~/services/customers.service'
import { TokenPayload } from '~/type'
import { responseError, responseSuccess } from '~/utils/response'
const registerController = async (req: Request<ParamsDictionary, any, CustomerRegisterRequest, any>, res: Response) => {
  const formData = req.body
  const result = await customerServices.createCustomer(formData)
  if (result) {
    responseSuccess(res, {
      message: 'Đăng ký tài khoản khách hàng thành công',
      data: result
    })
  }
}
const verifyEmailController = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const email_payload = req.decoded_email_verify_token as TokenPayload
  const result = await customerServices.verifyEmail(email_payload._id)
  if (result) {
    responseSuccess(res, {
      message: response_messages.unauthorized.verify_email.success,
      data: result
    })
  } else {
    responseError(res, {
      message: response_messages.unauthorized.verify_email.error
    })
  }
}
const loginController = async (req: Request<ParamsDictionary, any, CustomerLoginRequest, any>, res: Response) => {
  const { _id, verify } = req.customer as Customer
  const result = await customerServices.customerLogin({ _id: _id.toString(), verify })
  responseSuccess(res, {
    message: response_messages.unprocessable_entity.errors.login.success,
    data: result
  })
}
const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body as { refresh_token: string }
  const result = await customerServices.customerLogout(refresh_token)
  responseSuccess(res, {
    message: 'Đăng xuất thành công'
  })
}
const customerControllers = {
  registerController,
  loginController,
  verifyEmailController,
  logoutController
}
export default customerControllers
