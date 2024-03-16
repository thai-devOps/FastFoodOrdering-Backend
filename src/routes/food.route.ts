import { Router } from 'express'
import foodControllers from '~/controllers/food.controller'
import authMiddlewares from '~/middlewares/auth.middleware'
import foodMiddlewares from '~/middlewares/food.middleware'
import { wrapRequestHanlers } from '~/utils/handles'

const foodRouters = Router()

const URL_FOOD = {
  CREATE: '/food-create',
  GET_BY_MENU_SECTION_ID: '/food-menu-sections/:mc_id',
  GET_BY_ID: '/food/:id',
  GET_FOOD_CATEGORIES_BY_FOOD_ID: '/food-categories/:id',
  GET_BY_SHOP_ID: '/food-shop/:shop_id',
  UPDATE: '/food/:id',
  DELETE: '/food/:id'
}
/**
 * description: Get food categories by food id
 * method: get
 * path: /food-categories/:id
 */
foodRouters.get(
  URL_FOOD.GET_FOOD_CATEGORIES_BY_FOOD_ID,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(foodControllers.getFoodCategoriesByFoodId)
)
/**
 * description: Create a new food item
 * requestBody: FoodRequestBody
 * method: post
 * path: /food/create
 *
 */
foodRouters.post(
  '/food-create',
  foodMiddlewares.createFoodValidator,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(foodControllers.createFood)
)
/**
 * description: Get all food items by menu section id
 * method: get
 * path: /food-menu-sections/:mc_id
 *
 */
foodRouters.get(
  '/food-menu-sections/:mc_id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(foodControllers.getAllFoodByMenuSectionId)
)
/**
 * description: Get a food item by id
 * method: get
 * path: /food/:id
 */
foodRouters.get('/food/:id', authMiddlewares.accessTokenValidator, wrapRequestHanlers(foodControllers.getFoodById))
/**
 * description: Get food items by shop id
 * method: get
 * path: /food-shop/:shop_id
 */
foodRouters.get(
  '/food-shop/:shop_id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(foodControllers.getFoodByShopId)
)
/**
 * description: Get food items by shop id pagination
 * method: get
 * path: /food-shop-pagination/:shop_id/
 */
foodRouters.get(
  '/food-shop-pagination/:shop_id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(foodControllers.getFoodByShopIdPagination)
)
/**
 * description: Update a food item by id
 * requestBody: FoodEditRequestBody
 * method: put
 * path: /food/:id
 */
foodRouters.put(
  '/food/:id',
  foodMiddlewares.createFoodValidator,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(foodControllers.updateFood)
)
/**
 * description: Delete a food item by id
 * method: delete
 * path: /food/:id
 */
foodRouters.delete('/food/:id', authMiddlewares.accessTokenValidator, wrapRequestHanlers(foodControllers.deleteFood))
export default foodRouters

