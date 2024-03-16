import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { FoodOptions } from '~/models/schemas/FoodOptions.schema'
import { Option } from '~/models/schemas/Option.schema'
import foodOptionServices from '~/services/food_options.service'
import optionServices from '~/services/option.service'
import { responseSuccess } from '~/utils/response'

const getAllFoodOptionsByFoodId = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { food_id } = req.params
  const result = await foodOptionServices.getAllFoodOptionsByFoodId(food_id)
  const newResult = JSON.parse(JSON.stringify(result)) as (FoodOptions & {
    options: Option[]
  })[]

  // Fetch options for each food option
  for (const foodOption of newResult) {
    foodOption.options = await optionServices.getAllOptionsByFoodOptionId(foodOption._id.toString())
  }

  responseSuccess(res, {
    message: 'Get all food options by food id successfully',
    data: newResult
  })
}
const foodOptionsControllers = {
  getAllFoodOptionsByFoodId
}
export default foodOptionsControllers
