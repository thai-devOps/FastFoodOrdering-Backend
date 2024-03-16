import { Router } from 'express'
import categoryControllers from '~/controllers/categories.controller'
import authMiddlewares from '~/middlewares/auth.middleware'
import categoryMiddlewares from '~/middlewares/categories.middleware'
import { wrapRequestHanlers } from '~/utils/handles'

const categoryRouters = Router()

/**
 * description: Create a new category
 * requestBody: {createCategoryRequestBody}
 * method: post
 * path: /categories/create
 */
categoryRouters.post(
  '/categories/create',
  categoryMiddlewares.createCategoryValidator,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(categoryControllers.createCategory)
)
/**
 * description: Get all categories
 * method: get
 * path: /categories
 */
categoryRouters.get(
  '/categories',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(categoryControllers.getCategories)
)
/**
 * description: Get a category by id
 * method: get
 * path: /categories/:id
 */
categoryRouters.get(
  '/categories/:id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(categoryControllers.getCategoryById)
)
/**
 * description: Update a category by id
 * requestBody: {createCategoryRequestBody}
 * method: put
 * path: /categories/:id
 */
categoryRouters.put(
  '/categories/:id',
  categoryMiddlewares.createCategoryValidator,
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(categoryControllers.updateCategorryById)
)
/**
 * description: Delete a category by id
 * method: delete
 * path: /categories/:id
 */
categoryRouters.delete(
  '/categories/:id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(categoryControllers.deleteFoodType)
)
export default categoryRouters
