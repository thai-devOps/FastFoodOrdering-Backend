import { Router } from 'express'
import menuControllers from '~/controllers/menus.controller'
import authMiddlewares from '~/middlewares/auth.middleware'
import menuMiddlewares from '~/middlewares/menus.middleware'
import { wrapRequestHanlers } from '~/utils/handles'

const menuRouter = Router()

const URL_MENUS = {
  CREATE: '/menu-create',
  GET_BY_SHOP_ID: '/menu-shop/:shop_id',
  GET_BY_PARTNER_ID: '/menu-partner',
  GET_ALL_BY_PARTNER_PAGINATION: '/menu-partner-pagination',
  GET_BY_ID: '/menu/:menu_id',
  UPDATE: '/menu/:menu_id',
  DELETE: '/menu/:menu_id'
}

/**
 * description: Create a new menu
 * method: POST
 * path: /menu/create
 * body: {
 *  name: string,
 * description: string,
 * partner_id: string,
 * is_draft: boolean,
 * shop_id: string
 * }
 */
menuRouter.post(
  '/menu-create',
  menuMiddlewares.createMenuValidator,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(menuControllers.createMenu)
)
/**
 * description: Get all menus by shop id
 * method: GET
 * path:
 * params: {
 * restaurant_id: string
 * }
 */
menuRouter.get(
  '/menu-shop/:shop_id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(menuControllers.getMenusByShopId)
)
/**
 * description: Get all menu by partner id
 * method: GET
 * path: /menu/partner/:partner_id
 * params: {
 * partner_id: string
 * }
 */
menuRouter.get(
  '/menu-partner',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(menuControllers.getMenusByPartnerId)
)
/**
 * description: Get menu by id
 * method: GET
 * path: /menu/:menu_id
 * params: {
 * menu_id: string
 * }
 */
menuRouter.get('/menu/:menu_id', authMiddlewares.accessTokenValidator, wrapRequestHanlers(menuControllers.getMenuById))

/**
 * description: Get all by partner id paginated
 * method: GET
 * path: /menu-partner-pagination
 * query: {
 * page: number,
 * limit: number
 * }
 */
menuRouter.get(
  '/menu-partner-pagination',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(menuControllers.getAllMenusByPartnerIdPagination)
)
/**
 * description: Update menu by id
 * method: PUT
 * path: /menu/:menu_id
 * params: {
 * menu_id: string
 * }
 * body: {
 *  name: string,
 * description: string,
 * is_draft: boolean
 * }
 */
menuRouter.put(
  '/menu-active/:menu_id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(menuControllers.activeMenu)
)
menuRouter.put(
  '/menu/:menu_id',
  menuMiddlewares.createMenuValidator,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(menuControllers.updateMenu)
)

/**
 * description: Delete menu by id
 * method: DELETE
 * path: /menu/:menu_id
 * params: {
 * menu_id: string
 * }
 */
menuRouter.delete(
  '/menu/:menu_id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(menuControllers.deleteMenu)
)

export default menuRouter
