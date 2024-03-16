import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { FoodTypeRequestBody } from '~/models/requests/FoodType.request'
import foodTypeServices from '~/services/food_types.service'
import { responseSuccess } from '~/utils/response'
const createFoodType = async (req: Request<ParamsDictionary, any, FoodTypeRequestBody>, res: Response) => {
  const payload = req.body
  const result = await foodTypeServices.create(payload)
  responseSuccess(res, {
    message: 'FoodType created successfully',
    data: result
  })
}

const getFoodTypeById = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { id } = req.params
  const result = await foodTypeServices.getById(id)
  responseSuccess(res, {
    message: 'FoodType fetched successfully',
    data: result
  })
}
const updateFoodTypeById = async (req: Request<ParamsDictionary, any, FoodTypeRequestBody>, res: Response) => {
  const { id } = req.params
  const payload = req.body
  const result = await foodTypeServices.updateById(id, payload)
  responseSuccess(res, {
    message: 'FoodType updated successfully',
    data: result
  })
}
const deleteFoodType = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { id } = req.params
  const result = await foodTypeServices.deleteById(id)
  responseSuccess(res, {
    message: 'FoodType deleted successfully',
    data: result
  })
}
const foodTypesControllers = {
  createFoodType,
  getFoodTypeById,
  updateFoodTypeById,
  deleteFoodType
}
export default foodTypesControllers