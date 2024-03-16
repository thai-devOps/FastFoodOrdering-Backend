import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { omit } from 'lodash'
import { ORDER, SORT_BY } from '~/constants'
import { FoodEditRequestBody, FoodRequestBody } from '~/models/requests/Food.request'
import { SellingStatus } from '~/models/schemas/Food.schema'
import foodServices from '~/services/food.service'
import foodCategoriesServices from '~/services/food_categories.service'
import foodOptionServices from '~/services/food_options.service'
import optionServices from '~/services/option.service'
import { responseSuccess } from '~/utils/response'

const createFood = async (req: Request<ParamsDictionary, any, FoodRequestBody>, res: Response) => {
  const payload = req.body
  const result = await foodServices.createFood(payload)
  const food_id = result.insertedId.toString()
  const { categories, foodOptions } = payload

  // Create food categories
  const foodCategories = categories.map((category_id) => ({
    food_id,
    category_id
  }))
  await Promise.all(foodCategories.map((foodCategory) => foodCategoriesServices.createFoodCategory(foodCategory)))

  // Create food options and their respective options
  for (const foodOption of foodOptions) {
    const foodOptionDbResult = await foodOptionServices.createFoodOption(omit(foodOption, 'options'), food_id)
    const food_option_id = foodOptionDbResult.insertedId.toString()
    const { options } = foodOption
    await Promise.all(options.map((option) => optionServices.createOption(option, food_option_id)))
  }

  responseSuccess(res, {
    message: 'Food created successfully',
    data: result
  })
}
const getAllFoodByMenuSectionId = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { mc_id } = req.params
  const result = await foodServices.getAllFoodByMenuSectionId(mc_id)
  responseSuccess(res, {
    message: 'Foods fetched successfully',
    data: result
  })
}
const getFoodById = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { id } = req.params
  const result = await foodServices.getFoodById(id)
  responseSuccess(res, {
    message: 'Food fetched successfully',
    data: result
  })
}
const updateFood = async (req: Request<ParamsDictionary, any, FoodEditRequestBody>, res: Response) => {
  const id = req.params.id
  // handle food update
  const payload = req.body
  const updateFoodResult = await foodServices.updateFood(id, payload)
  // handle food categories update
  const { categories } = payload
  await foodCategoriesServices.deleteFoodCategoriesByFoodId(id)
  const foodCategories = categories.map((category_id) => ({
    food_id: id,
    category_id
  }))
  await Promise.all(foodCategories.map((foodCategory) => foodCategoriesServices.createFoodCategory(foodCategory)))
  // handle food options update
  const { food_options } = payload
  await foodOptionServices.deleteFoodOptionsByFoodId(id)
  for (const foodOption of food_options) {
    // xóa options cũ
    await optionServices.deleteOptionsByFoodOptionId(foodOption._id as string)
  }
  for (const foodOption of food_options) {
    const foodOptionDbResult = await foodOptionServices.createFoodOption(omit(foodOption, 'options'), id)
    const food_option_id = foodOptionDbResult.insertedId.toString()
    const { options } = foodOption
    await Promise.all(options.map((option) => optionServices.createOption(option, food_option_id)))
  }
  responseSuccess(res, {
    message: 'Food updated successfully',
    data: updateFoodResult
  })
}
const deleteFood = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const id = req.params.id
  await foodOptionServices.deleteFoodOptionsByFoodId(id)
  await foodCategoriesServices.deleteFoodCategoriesByFoodId(id)
  const result = await foodServices.deleteFoodById(id)
  responseSuccess(res, {
    message: 'Food deleted successfully',
    data: result
  })
}
const getFoodByShopId = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { shop_id } = req.params
  const result = await foodServices.getFoodByShopId(shop_id)
  responseSuccess(res, {
    message: 'Foods fetched by shop_id successfully',
    data: result
  })
}
const getFoodByShopIdPagination = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { shop_id } = req.params
  let { page, limit, sort_by, order_by } = req.query as {
    [key: string]: string | number
  }
  const { name, is_selling, publish_status, quantity, categories } = req.query as {
    [key: string]: string | number
  }
  if (typeof page === 'string') page = Number(page)
  if (typeof limit === 'string') limit = Number(limit)
  let condition = {}
  if (name && typeof name === 'string') {
    condition = {
      ...condition,
      name: { $regex: name, $options: 'i' }
    }
  }
  if (!ORDER.includes(order_by as string)) {
    order_by = ORDER[0]
  }
  if (!SORT_BY.includes(sort_by as string)) {
    sort_by = SORT_BY[0]
  }
  if (is_selling && typeof is_selling === 'string') {
    const selling_status = is_selling as SellingStatus
    condition = {
      ...condition,
      is_selling: selling_status
    }
  }
  if (publish_status && typeof publish_status === 'string') {
    if (publish_status === 'published') {
      condition = {
        ...condition,
        publish_status: true
      }
    }
    if (publish_status === 'unpublished') {
      condition = {
        ...condition,
        publish_status: false
      }
    }
  }

  if (quantity && typeof quantity === 'string') {
    if (quantity === 'instock') {
      condition = {
        ...condition,
        quantity: { $gt: 10 }
      }
    }
    if (quantity === 'out_of_stock') {
      condition = {
        ...condition,
        quantity: 0
      }
    }
    if (quantity === 'low_stock') {
      condition = {
        ...condition,
        quantity: { $gt: 0, $lte: 10 }
      }
    }
  }
  const food_ids: string[] = []
  if (categories && typeof categories === 'string') {
    const categories_ids = (categories as string).split(',')
    for (let i = 0; i < categories_ids.length; i++) {
      categories_ids[i] = categories_ids[i].trim()
    } // remove space
    for (const category_id of categories_ids) {
      const foods = await foodCategoriesServices.getFoodCategoriesByCategoryId(category_id)
      for (const food of foods) {
        food_ids.push(food.food_id.toString())
      }
    }
    const result = await foodServices.getFoodByShopIdPagination({
      shop_id,
      condition,
      food_ids,
      page,
      limit,
      sort_by: sort_by as string,
      order_by: order_by as 'asc' | 'desc'
    })
    return responseSuccess(res, {
      message: 'Foods fetched by shop_id pagination successfully',
      data: result
    })
  }
  const result = await foodServices.getFoodByShopIdPagination({
    shop_id,
    condition,
    page,
    limit,
    sort_by: sort_by as string,
    order_by: order_by as 'asc' | 'desc'
  })
  return responseSuccess(res, {
    message: 'Foods fetched by shop_id pagination successfully',
    data: result
  })
}
const getFoodCategoriesByFoodId = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { id } = req.params
  const result = await foodCategoriesServices.getFoodCategoriesByFoodId(id)
  responseSuccess(res, {
    message: 'Food categories fetched by food_id successfully',
    data: result
  })
}
const foodControllers = {
  createFood,
  getAllFoodByMenuSectionId,
  getFoodById,
  getFoodByShopId,
  getFoodByShopIdPagination,
  updateFood,
  deleteFood,
  getFoodCategoriesByFoodId
}
export default foodControllers
