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
import { PartnerLoginRequest, PartnerProfileRequest, PartnerRegisterRequest } from '~/models/requests/Partner.request'
import partnerServices from '~/services/partners.service'
import Partner from '~/models/schemas/Partner.schema'
import userServices from '~/services/users.service'
import { User } from '~/models/schemas/User.schema'

const registerController = async (req: Request<ParamsDictionary, any, PartnerRegisterRequest, any>, res: Response) => {
  const formData = req.body
  const { insertedId: user_id } = await userServices.createUser(formData)
  const result = await partnerServices.createPartner(user_id, formData)
  if (result) {
    responseSuccess(res, {
      message: 'Đăng ký tài khoản đối tác khách hàng thành công',
      data: result
    })
  }
}
const loginController = async (req: Request<ParamsDictionary, any, PartnerLoginRequest, any>, res: Response) => {
  const { _id, verify } = req.partner as User
  const result = await partnerServices.partnerLogin({ _id: _id.toString(), verify })
  responseSuccess(res, {
    message: response_messages.unprocessable_entity.errors.login.success,
    data: result
  })
}
const verifyEmailController = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const email_payload = req.decoded_email_verify_token as TokenPayload
  console.log(email_payload)
  const result = await partnerServices.verifyEmail(email_payload._id)
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

const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body as { refresh_token: string }
  const result = await partnerServices.partnerLogout(refresh_token)
  responseSuccess(res, {
    message: 'Đăng xuất thành công',
    data: result
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
  if (role === UserRole.Partner) {
    const result = await partnerServices.refreshToken({ _id, refresh_token, verify, exp })
    responseSuccess(res, {
      message: response_messages.token.refresh_token_success,
      data: result
    })
  }
  // if (role === UserRole.Shipper) {
  //   const result = await shipperService.refreshToken({ _id, refresh_token, verify, exp })
  //   responseSuccess(res, {
  //     message: response_messages.token.refresh_token_success,
  //     data: result
  //   })
  // }
}
const resendVerifyEmailController = async (req: Request, res: Response) => {
  const { _id } = req.decoded_access_token as TokenPayload
  const user = await userServices.findUserById(_id)
  if (user === null) {
    responseError(res, {
      message: response_messages.unauthorized.verify_email.error
    })
  }
  const result = await partnerServices.resendVerifyEmail({ _id: _id.toString(), email: user?.email as string })
  if (result) {
    responseSuccess(res, {
      message: response_messages.unauthorized.verify_email.rensend_success,
      data: result
    })
  } else {
    responseError(res, {
      message: response_messages.unauthorized.verify_email.error
    })
  }
}
const getUserInfoController = async (req: Request, res: Response) => {
  const { _id } = req.decoded_access_token as TokenPayload
  const result = await partnerServices.findPartnerById(_id)
  if (!result) {
    responseError(res, {
      message: 'Không tìm thấy thông tin tài khoản'
    })
  }
  responseSuccess(res, {
    message: 'Lấy thông tin tài khoản thành công',
    data: result
  })
}
const updateInfoController = async (req: Request<ParamsDictionary, any, PartnerProfileRequest>, res: Response) => {
  const { _id } = req.decoded_access_token as TokenPayload
  const formData = req.body
  const result = await partnerServices.updatePartnerInfo(_id, formData)
  if (!result) {
    responseError(res, {
      message: 'Cập nhật thông tin tài khoản thất bại'
    })
  }
  responseSuccess(res, {
    message: 'Cập nhật thông tin tài khoản thành công',
    data: result
  })
}
const partnerControllers = {
  refreshToken,
  registerController,
  loginController,
  verifyEmailController,
  resendVerifyEmailController,
  logoutController,
  getUserInfoController,
  updateInfoController
}
export default partnerControllers
