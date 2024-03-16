import { Router } from 'express'
import foodOptionsControllers from '~/controllers/food_options.controller'
import authMiddlewares from '~/middlewares/auth.middleware'
import { wrapRequestHanlers } from '~/utils/handles'

const foodOptionsRouters = Router()

const URL_FOOD_OPTIONS = {
  GET_ALL_BY_FOOD_ID: '/food-options/:food_id',
  UPDATE: '/food-options/:food_id',
  DELETE: '/food-options/:food_id'
}
/**
 * description: Get all food options by food id
 * method: get
 * path: /food-options/:food_id
 */
foodOptionsRouters.get(
  URL_FOOD_OPTIONS.GET_ALL_BY_FOOD_ID,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(foodOptionsControllers.getAllFoodOptionsByFoodId)
)

export default foodOptionsRouters
