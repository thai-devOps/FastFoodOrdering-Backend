import { Router } from 'express'
import foodTypesControllers from '~/controllers/food_types.controller'
import authMiddlewares from '~/middlewares/auth.middleware'
import foodTypeMiddlewares from '~/middlewares/food_types.middleware'
import { wrapRequestHanlers } from '~/utils/handles'

const foodTypeRouters = Router()

/**
 * description: Create a new food type
 * requestBody: FoodTypeRequestBody
 * method: post
 * path: /food-types/create
 */
foodTypeRouters.post(
  '/food-types/create',
  foodTypeMiddlewares.createFoodTypeValidator,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(foodTypesControllers.createFoodType)
)
/**
 * description: Get a food type by id
 * method: get
 * path: /food-types/:id
 */
foodTypeRouters.get(
  '/food-types/:id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(foodTypesControllers.getFoodTypeById)
)

/**
 * description: Update a food type by id
 * requestBody: FoodTypeRequestBody
 * method: put
 * path: /food-types/:id
 */
foodTypeRouters.put(
  '/food-types/:id',
  foodTypeMiddlewares.createFoodTypeValidator,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(foodTypesControllers.updateFoodTypeById)
)

/**
 * description: Delete a food type by id
 * method: delete
 * path: /food-types/:id
 */
foodTypeRouters.delete(
  '/food-types/:id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(foodTypesControllers.deleteFoodType)
)

export default foodTypeRouters
