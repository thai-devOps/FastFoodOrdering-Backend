import { Router } from 'express'
import menuSectionControllers from '~/controllers/menu_sections.controller'
import menuCategoriesControllers from '~/controllers/menu_sections.controller'
import authMiddlewares from '~/middlewares/auth.middleware'
import menuSectionMiddlewares from '~/middlewares/menu_sections.middleware'
import menuCategoriesMiddlewares from '~/middlewares/menu_sections.middleware'
import { wrapRequestHanlers } from '~/utils/handles'

const menuSectionRoutes = Router()

/**
 * description: Create a new menu category
 * method: POST
 * path: /menu-sections/create
 * body: {
 * name: string,
 * description: string,
 * menuId: string
 * }
 */
menuSectionRoutes.post(
  '/menu-sections/create',
  menuSectionMiddlewares.createMenuSectionValidator,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(menuSectionControllers.createMenuSection)
)
/**
 * description: Get all menu sections by menu id
 * method: GET
 * path: /menu-sections/menu/:m_id
 * params: {
 * m_id: string
 * }
 */
menuSectionRoutes.get(
  '/menu-sections/menu/:m_id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(menuSectionControllers.getMenuSectionByMenuId)
)
/**
 * description: Get a menu section by id
 * method: GET
 * path: /menu-sections/:mc_id
 */
menuSectionRoutes.get(
  '/menu-section/:mc_id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(menuSectionControllers.getMenuSectionById)
)

/**
 * description: Update menu category
 * method: PUT
 * path: /menu-category/:mc_id
 * params: {
 * mc_id: string
 * }
 * body: {
 * name: string,
 * description: string
 * }
 */
menuSectionRoutes.put(
  '/menu-sections/:mc_id',
  menuSectionMiddlewares.createMenuSectionValidator,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(menuSectionControllers.updateMenuSectionById)
)
/**
 * description: Delete menu category
 * method: DELETE
 * path: /menu-category/:mc_id
 * params: {
 * mc_id: string
 * }
 */
menuSectionRoutes.delete(
  '/menu-sections/:mc_id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(menuSectionControllers.deleteMenuSectionById)
)
export default menuSectionRoutes
