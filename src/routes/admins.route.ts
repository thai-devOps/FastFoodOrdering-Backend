import { Router } from 'express'
import authControllers from '~/controllers/auth.controller'
import authMiddlewares from '~/middlewares/auth.middleware'
import commonMiddlewares from '~/middlewares/common.middleware'
import customerMiddlewares from '~/middlewares/customers.middleware'
import { wrapRequestHanlers } from '~/utils/handles'
const authRoute = Router()

authRoute.post('/register', commonMiddlewares.registerValidator, wrapRequestHanlers(authControllers.registerController))

authRoute.post(
  '/login',
  commonMiddlewares.loginValidator,
  authMiddlewares.checkAdminLoginSuccess,
  wrapRequestHanlers(authControllers.loginController)
)
// create route for customer verify email here
authRoute.get(
  '/verify-email',
  customerMiddlewares.verifyEmailValidator,
  wrapRequestHanlers(authControllers.verifyEmailController)
)
/**
 * description: Logout customer
 * method: POST
 * path: /logout
 * headers: { Authorization: Bearer <access_token> }
 * body: { refresh_token: <refresh_token> }
 */
authRoute.post(
  '/logout',
  authMiddlewares.accessTokenValidator,
  authMiddlewares.refreshTokenValidator,
  wrapRequestHanlers(authControllers.logoutController)
)
/**
 * description: Refresh access token
 * method: POST
 * path: /refresh-token
 * body: { refresh_token: <refresh_token> }
 */
authRoute.post(
  '/refresh-access-token',
  authMiddlewares.refreshTokenValidator,
  wrapRequestHanlers(authControllers.refreshToken)
)

export default authRoute
