import { Request, Response } from 'express'
import { CardRequestBody } from '~/models/requests/Card.request'
import cardServices from '~/services/cards.service'
import { TokenPayload } from '~/type'
import { responseSuccess } from '~/utils/response'
import { ParamsDictionary } from 'express-serve-static-core'
const createCard = async (req: Request<ParamsDictionary, any, CardRequestBody>, res: Response) => {
  const { _id } = req.decoded_access_token as TokenPayload
  const payload = req.body
  console.log(payload)
  const result = await cardServices.create(_id, payload)
  responseSuccess(res, {
    message: 'Tạo thẻ thành công',
    data: result
  })
}
const getCards = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { _id } = req.decoded_access_token as TokenPayload
  const result = await cardServices.getAll(_id)
  responseSuccess(res, {
    message: 'Lấy danh sách thẻ thành công',
    data: result
  })
}
const deleteCardById = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { id } = req.params
  const result = await cardServices.deleteById(id)
  responseSuccess(res, {
    message: 'Xóa thẻ thành công',
    data: result
  })
}
const updateCardStatusDefault = async (
  req: Request<ParamsDictionary, any, { id: string; active: boolean }>,
  res: Response
) => {
  const { _id: user_id } = req.decoded_access_token as TokenPayload
  const payload = req.body
  const result = await cardServices.updateStatusDefault(user_id, payload)
  responseSuccess(res, {
    message: 'Cập nhật trạng thái thẻ thành công',
    data: result
  })
}
const updateCard = async (req: Request<ParamsDictionary, any, CardRequestBody>, res: Response) => {
  const { _id: user_id } = req.decoded_access_token as TokenPayload
  const { id } = req.params
  const payload = req.body
  const result = await cardServices.update(user_id, id, payload)
  responseSuccess(res, {
    message: 'Cập nhật thẻ thành công',
    data: result
  })
}
const cardControllers = {
  createCard,
  getCards,
  deleteCardById,
  updateCardStatusDefault,
  updateCard
}
export default cardControllers
