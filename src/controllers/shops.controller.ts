import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ShopRequestBody } from '~/models/requests/Shop.request'
import shopServices from '~/services/shops.service'
import { TokenPayload } from '~/type'
import { responseSuccess } from '~/utils/response'
const createShop = async (req: Request<ParamsDictionary, any, ShopRequestBody>, res: Response) => {
  const { _id: partner_id } = req.decoded_access_token as TokenPayload
  const payload = { ...req.body, partner_id }
  const shop = await shopServices.createShop(payload)
  responseSuccess(res, {
    message: 'Create shop successfully',
    data: shop
  })
}
const getShopByPartnerId = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { _id: partner_id } = req.decoded_access_token as TokenPayload
  const shop = await shopServices.getShopByPartnerId(partner_id)
  responseSuccess(res, {
    message: 'Get shop by partner id successfully',
    data: shop
  })
}
const getShopById = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { id } = req.params
  const shop = await shopServices.getShopById(id)
  responseSuccess(res, {
    message: 'Get shop by id successfully',
    data: shop
  })
}
const updateShopById = async (req: Request<ParamsDictionary, any, ShopRequestBody>, res: Response) => {
  const { id } = req.params
  const { _id: partner_id } = req.decoded_access_token as TokenPayload
  const payload = { ...req.body, partner_id }
  const shop = await shopServices.updateShopById(id, payload)
  responseSuccess(res, {
    message: 'Update shop by id successfully',
    data: shop
  })
}
const updateShopStatus = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { _id: partner_id } = req.decoded_access_token as TokenPayload
  const { is_active } = req.body
  const shop = await shopServices.updateShopStatus(partner_id, is_active)
  responseSuccess(res, {
    message: 'Update shop status successfully',
    data: shop
  })
}
const shopControllers = {
  createShop,
  getShopByPartnerId,
  getShopById,
  updateShopById,
  updateShopStatus
}
export default shopControllers
