import { Router } from 'express'
import restaurantControllers from '~/controllers/restaurant.controller'
import authMiddlewares from '~/middlewares/auth.middleware'
import commonMiddlewares from '~/middlewares/common.middleware'
import restaurantMiddlewares from '~/middlewares/restaurants.middleware'
import { wrapRequestHanlers } from '~/utils/handles'

const restaurantRoutes = Router()

// route for create restaurant
restaurantRoutes.post(
  '/create-restaurant',
  restaurantMiddlewares.createRestaurantValidator,
  authMiddlewares.accessTokenValidator,
  commonMiddlewares.isVerifiedUser,
  commonMiddlewares.isPartner,
  wrapRequestHanlers(restaurantControllers.create)
)
// route for get restaurant by partner id
restaurantRoutes.get(
  '/get-restaurant-by-partner-id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(restaurantControllers.getRestaurantByPartnerId)
)
// route for update restaurant status
restaurantRoutes.put(
  '/update-restaurant-status',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(restaurantControllers.updateRestaurantStatus)
)
// route for update restaurant
restaurantRoutes.put(
  '/update-restaurant/:r_id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(restaurantControllers.updateRestaurant)
)
export default restaurantRoutes
