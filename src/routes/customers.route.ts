import { Router } from 'express'
import { Request, Response } from 'express'
import authControllers from '~/controllers/auth.controller'
import customerControllers from '~/controllers/customers.controller'
import authMiddlewares from '~/middlewares/auth.middleware'
import commonMiddlewares from '~/middlewares/common.middleware'
import customerMiddlewares from '~/middlewares/customers.middleware'
import { wrapRequestHanlers } from '~/utils/handles'

const customerRoutes = Router()

customerRoutes.post(
  '/register',
  commonMiddlewares.registerValidator,
  wrapRequestHanlers(customerControllers.registerController)
)
customerRoutes.post(
  '/login',
  customerMiddlewares.loginValidator,
  customerMiddlewares.checkLoginSuccess,
  wrapRequestHanlers(customerControllers.loginController)
)
// create route for customer verify email here
customerRoutes.get(
  '/verify-email',
  customerMiddlewares.verifyEmailValidator,
  wrapRequestHanlers(customerControllers.verifyEmailController)
)
/**
 * description: Logout customer
 * method: POST
 * path: /logout
 * headers: { Authorization: Bearer <access_token> }
 * body: { refresh_token: <refresh_token> }
 */
customerRoutes.post(
  '/logout',
  authMiddlewares.accessTokenValidator,
  authMiddlewares.refreshTokenValidator,
  wrapRequestHanlers(customerControllers.logoutController)
)
/**
 * description: Refresh access token
 * method: POST
 * path: /refresh-token
 * body: { refresh_token: <refresh_token> }
 */
customerRoutes.post(
  '/refresh-access-token',
  authMiddlewares.refreshTokenValidator,
  wrapRequestHanlers(authControllers.refreshToken)
)
export default customerRoutes
