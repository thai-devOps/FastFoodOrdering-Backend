import { Router } from 'express'
import partnerControllers from '~/controllers/partner.controller'
import authMiddlewares from '~/middlewares/auth.middleware'
import commonMiddlewares from '~/middlewares/common.middleware'
import partnerMiddlewares from '~/middlewares/partners.middleware'
import { wrapRequestHanlers } from '~/utils/handles'

const partnerRoutes = Router()

/**
 * description: Register partner
 */
partnerRoutes.post(
  '/register',
  commonMiddlewares.registerValidator,
  wrapRequestHanlers(partnerControllers.registerController)
)
/**
 * description: Login partner
 */
partnerRoutes.post(
  '/login',
  commonMiddlewares.loginValidator,
  commonMiddlewares.checkLogin,
  wrapRequestHanlers(partnerControllers.loginController)
)
/**
 * description: Verify email partner
 */
partnerRoutes.get(
  '/verify-email',
  commonMiddlewares.verifyEmailValidator,
  wrapRequestHanlers(partnerControllers.verifyEmailController)
)
/**
 * description: Get user info partner
 */
partnerRoutes.get(
  '/get-user-info',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(partnerControllers.getUserInfoController)
)
/**
 * description: resend verify email partner
 */
partnerRoutes.post(
  '/resend-verify-email',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(partnerControllers.resendVerifyEmailController)
)

/**
 * description: Logout partner
 */
partnerRoutes.post(
  '/logout',
  authMiddlewares.accessTokenValidator,
  authMiddlewares.refreshTokenValidator,
  wrapRequestHanlers(partnerControllers.logoutController)
)
/**
 * description: Refresh access token
 */
partnerRoutes.post(
  '/refresh-access-token',
  authMiddlewares.refreshTokenValidator,
  wrapRequestHanlers(partnerControllers.refreshToken)
)
/**
 * description: Upload avatar partner
 */
/**
 * description: Update partner info
 * require: access token
 * method: PUT
 * body:  {name: string, phone: string, date_of_birth:string, gender: string, identity_card:string, address: {province: string, district: string, ward: string, houseNumber_street: string, avatar: string}
 * }
 * path: /partner/update-info
 * middleware: authMiddlewares.accessTokenValidator
 */
partnerRoutes.put(
  '/update-profile',
  partnerMiddlewares.updateInfoValidator,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(partnerControllers.updateInfoController)
)
export default partnerRoutes
