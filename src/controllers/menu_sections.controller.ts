import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { MenuSectionRequestBody } from '~/models/requests/MenuSection.request'
import foodServices from '~/services/food.service'
import menuCategoriesService from '~/services/menu_sections.service'
import { responseSuccess } from '~/utils/response'
const createMenuSection = async (req: Request<ParamsDictionary, any, MenuSectionRequestBody>, res: Response) => {
  const payload = req.body
  const result = await menuCategoriesService.create(payload)
  responseSuccess(res, {
    message: 'Menu section created successfully',
    data: result
  })
}
const getMenuSectionByMenuId = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { m_id } = req.params
  const result = await menuCategoriesService.getByMenuId(m_id)
  responseSuccess(res, {
    message: 'Menu sections fetched successfully',
    data: result
  })
}
const getMenuSectionById = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { mc_id } = req.params
  const result = await menuCategoriesService.getById(mc_id)
  responseSuccess(res, {
    message: 'Menu section fetched successfully',
    data: result
  })
}
const updateMenuSectionById = async (req: Request<ParamsDictionary, any, MenuSectionRequestBody>, res: Response) => {
  const { mc_id } = req.params
  const payload = req.body
  const result = await menuCategoriesService.updateById(mc_id, payload)
  responseSuccess(res, {
    message: 'Menu section updated successfully',
    data: result
  })
}
const deleteMenuSectionById = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { mc_id } = req.params
  // Xóa tất cả các món ăn có menu section id này
  const result = await menuCategoriesService.deleteById(mc_id)
  responseSuccess(res, {
    message: 'Menu section deleted successfully',
    data: result
  })
}

const menuSectionControllers = {
  createMenuSection,
  getMenuSectionByMenuId,
  getMenuSectionById,
  updateMenuSectionById,
  deleteMenuSectionById
}
export default menuSectionControllers
