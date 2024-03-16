import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RESTAURANT_STATUS } from '~/constants/enums'
import { RestaurantRequestBody } from '~/models/requests/Restaurant.request'
import restaurantService from '~/services/restaurants.service'
import { TokenPayload } from '~/type'
import { responseSuccess } from '~/utils/response'
const create = async (req: Request<ParamsDictionary, any, RestaurantRequestBody>, res: Response) => {
  const { _id } = req.decoded_access_token as TokenPayload
  const payload = req.body
  const result = await restaurantService.createRestaurant(_id, payload)
  responseSuccess(res, {
    message: 'Tạo nhà hàng thành công',
    data: result
  })
}
const getRestaurantByPartnerId = async (req: Request, res: Response) => {
  const { _id } = req.decoded_access_token as TokenPayload
  const result = await restaurantService.getRestaurantsByPartnerId(_id)
  responseSuccess(res, {
    message: 'Lấy nhà hàng thành công',
    data: result
  })
}
const updateRestaurantStatus = async (
  req: Request<
    ParamsDictionary,
    any,
    {
      id: string
      status: RESTAURANT_STATUS
    }
  >,
  res: Response
) => {
  const { _id } = req.decoded_access_token as TokenPayload
  const { id, status } = req.body
  const result = await restaurantService.updateRestaurantStatus(_id, id, status)
  responseSuccess(res, {
    message: 'Cập nhật trạng thái nhà hàng thành công',
    data: result
  })
}
const updateRestaurant = async (req: Request<ParamsDictionary, any, RestaurantRequestBody>, res: Response) => {
  const { _id } = req.decoded_access_token as TokenPayload
  const { r_id } = req.params
  const payload = req.body
  const result = await restaurantService.updateRestaurant(_id, r_id, payload)
  responseSuccess(res, {
    message: 'Cập nhật nhà hàng thành công',
    data: result
  })
}
const restaurantControllers = {
  create,
  getRestaurantByPartnerId,
  updateRestaurantStatus,
  updateRestaurant
}
export default restaurantControllers
