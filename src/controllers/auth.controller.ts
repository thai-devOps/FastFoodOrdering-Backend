import { Request, Response } from 'express'
import response_messages from '~/constants/messages'
import customerServices from '~/services/customers.service'
import { TokenPayload } from '~/type'
import { responseError, responseSuccess } from '~/utils/response'
import { ParamsDictionary } from 'express-serve-static-core'
import { CustomerLoginRequest } from '~/models/requests/Customer.request'
import { AdminRegisterRequest } from '~/models/requests/Admin.request'
import adminServices from '~/services/admin.service'
import Admin from '~/models/schemas/Admin.schema'
import { UserRole } from '~/constants/enums'

const registerController = async (req: Request<ParamsDictionary, any, AdminRegisterRequest, any>, res: Response) => {
  const formData = req.body
  const result = await adminServices.createAdmin(formData)
  if (result) {
    responseSuccess(res, {
      message: 'Đăng ký tài khoản admin thành công',
      data: result
    })
  }
}
const verifyEmailController = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const email_payload = req.decoded_email_verify_token as TokenPayload
  const result = await adminServices.verifyEmail(email_payload._id)
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
  const { _id, verify } = req.admin as Admin
  const result = await adminServices.adminLogin({ _id: _id.toString(), verify })
  responseSuccess(res, {
    message: response_messages.unprocessable_entity.errors.login.success,
    data: result
  })
}
const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body as { refresh_token: string }
  const result = await adminServices.adminLogout(refresh_token)
  responseSuccess(res, {
    message: 'Đăng xuất thành công'
  })
}
const refreshToken = async (req: Request, res: Response) => {
  const { refresh_token } = req.body as { refresh_token: string }
  const { _id, verify, exp, role } = req.decoded_refresh_token as TokenPayload
  if (role === UserRole.Admin) {
    const result = await adminServices.refreshToken({ _id, refresh_token, verify, exp })
    responseSuccess(res, {
      message: 'Lấy lại access token thành công',
      data: result
    })
  }
  if (role === UserRole.Customer) {
    const result = await customerServices.refreshToken({ _id, refresh_token, verify, exp })
    responseSuccess(res, {
      message: response_messages.token.refresh_token_success,
      data: result
    })
  }
  // if (role === UserRole.Partner) {
  //   const result = await partnerService.refreshToken({ _id, refresh_token, verify, exp })
  //   responseSuccess(res, {
  //     message: response_messages.token.refresh_token_success,
  //     data: result
  //   })
  // }
  // if (role === UserRole.Shipper) {
  //   const result = await shipperService.refreshToken({ _id, refresh_token, verify, exp })
  //   responseSuccess(res, {
  //     message: response_messages.token.refresh_token_success,
  //     data: result
  //   })
  // }
}
const authControllers = {
  refreshToken,
  registerController,
  loginController,
  verifyEmailController,
  logoutController
}
export default authControllers
