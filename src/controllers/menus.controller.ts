import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import response_messages from '~/constants/messages'
import { MenuRequestBody } from '~/models/requests/Menu.request'
import menuServices from '~/services/menus.service'
import { TokenPayload } from '~/type'
import { responseSuccess } from '~/utils/response'
import { Menu } from '~/models/schemas/Menu.schema'
import { ORDER, SORT_BY } from '~/constants'
const createMenu = async (req: Request<ParamsDictionary, any, MenuRequestBody>, res: Response) => {
  const { _id: partner_id } = req.decoded_access_token as TokenPayload
  const payload = req.body
  const result = await menuServices.createMenu(partner_id, payload)
  responseSuccess(res, {
    message: response_messages.menu.create,
    data: result
  })
}
const getMenusByShopId = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { shop_id } = req.params
  const result = await menuServices.getMenusByShopId(shop_id)
  responseSuccess(res, {
    message: 'Menus fetched by shop_id successfully',
    data: result
  })
}
const getMenuById = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { menu_id } = req.params
  const result = await menuServices.getMenuById(menu_id)
  responseSuccess(res, {
    message: 'Menu fetched successfully',
    data: result
  })
}
const getMenusByPartnerId = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { _id: p_id } = req.decoded_access_token as TokenPayload
  const result = await menuServices.getAllMenusByPartnerId(p_id)
  responseSuccess(res, {
    message: response_messages.menu.getAllByPartner,
    data: result
  })
}
const getAllMenusByPartnerIdPagination = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  let {
    page = 1,
    limit = 5,
    sort_by,
    order_by
  } = req.query as {
    [key: string]: string | number
  }
  const { name, is_draft, is_active } = req.query as {
    [key: string]: string | boolean
  }

  if (typeof page === 'string') page = Number(page)
  if (typeof limit === 'string') limit = Number(limit)
  let condition = {}
  if (name) {
    condition = {
      ...condition,
      name: { $regex: name, $options: 'i' }
    }
  }
  if (is_draft) {
    condition = {
      ...condition,
      is_draft: is_draft === '1'
    }
  }
  if (is_active) {
    condition = {
      ...condition,
      is_active: is_active === '1'
    }
  }
  if (!ORDER.includes(order_by as string)) {
    order_by = ORDER[0]
  }
  if (!SORT_BY.includes(sort_by as string)) {
    sort_by = SORT_BY[0]
  }
  const { _id: partner_id } = req.decoded_access_token as TokenPayload
  const result = await menuServices.getAllMenusByPartnerIdPagination(
    partner_id,
    condition,
    Number(page),
    Number(limit),
    sort_by as string,
    order_by as string
  )
  responseSuccess(res, {
    message: response_messages.menu.getAllByPartner,
    data: result
  })
}
const updateMenu = async (req: Request<ParamsDictionary, any, MenuRequestBody>, res: Response) => {
  const { menu_id } = req.params
  const payload = req.body
  const result = await menuServices.updateMenu(menu_id, payload)
  responseSuccess(res, {
    message: response_messages.menu.update,
    data: result
  })
}
const deleteMenu = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { menu_id } = req.params
  const result = await menuServices.deleteMenu(menu_id)
  responseSuccess(res, {
    message: 'Menu  deleted successfully',
    data: result
  })
}
const activeMenu = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { menu_id } = req.params
  const result = await menuServices.activeMenu(menu_id)
  responseSuccess(res, {
    message: response_messages.menu.active,
    data: result
  })
}
const menuControllers = {
  createMenu,
  getMenusByShopId,
  getMenuById,
  getMenusByPartnerId,
  getAllMenusByPartnerIdPagination,
  activeMenu,
  updateMenu,
  deleteMenu
}
export default menuControllers
