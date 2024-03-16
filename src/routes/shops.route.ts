import { Router } from 'express'
import shopControllers from '~/controllers/shops.controller'
import authMiddlewares from '~/middlewares/auth.middleware'
import shopMiddlewares from '~/middlewares/shops.middleware'
import { wrapRequestHanlers } from '~/utils/handles'

const shopRoutes = Router()
export const URL_SHOP = {
  CREATE: '/shops-create',
  GET_BY_PARTNER_ID: '/shops-partner',
  GET_BY_ID: '/shops/:id',
  UPDATE_BY_ID: '/shops/:id',
  UPDATE_STATUS: '/shops-update-status'
}

/**
 * description: Create a new shop
 * body: ShopRequestBody
 * method: POST
 * route: /shops/create
 */
shopRoutes.post(
  URL_SHOP.CREATE,
  shopMiddlewares.createShopValidator,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(shopControllers.createShop)
)
/**
 * description: Get shop by partner id
 * method: GET
 * route: /shops-partner
 */
shopRoutes.get(
  URL_SHOP.GET_BY_PARTNER_ID,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(shopControllers.getShopByPartnerId)
)
/**
 * description: Get shop by id
 * method: GET
 * route: /shops/:id
 */
shopRoutes.get(
  URL_SHOP.GET_BY_ID,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(shopControllers.getShopById)
)

/**
 * description: Update shop by id
 * body: ShopRequestBody
 * method: PUT
 * route: /shops/:id
 */
shopRoutes.put(
  URL_SHOP.UPDATE_BY_ID,
  shopMiddlewares.createShopValidator,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(shopControllers.updateShopById)
)
/**
 * description: Update shop status by id
 * method: PUT
 * route: /shops/update-status
 * body: {is_active: boolean}
 */
shopRoutes.put(
  URL_SHOP.UPDATE_STATUS,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(shopControllers.updateShopStatus)
)
export default shopRoutes
