import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CategoryRequestBody } from '~/models/requests/Category.request'
import { FoodRequestBody } from '~/models/requests/Food.request'
import categoryServices from '~/services/categories.service'
import { responseSuccess } from '~/utils/response'
const createCategory = async (req: Request<ParamsDictionary, any, CategoryRequestBody>, res: Response) => {
  const payload = req.body
  const result = await categoryServices.createCategory(payload)
  responseSuccess(res, {
    message: 'Category created successfully',
    data: result
  })
}
const getCategories = async (req: Request, res: Response) => {
  const result = await categoryServices.getCategories()
  responseSuccess(res, {
    message: 'Categories retrieved successfully',
    data: result
  })
}
const getCategoryById = async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await categoryServices.getCategoryById(id)
  responseSuccess(res, {
    message: 'Category retrieved successfully',
    data: result
  })
}
const updateCategorryById = async (req: Request<ParamsDictionary, any, CategoryRequestBody>, res: Response) => {
  const id = req.params.id
  const payload = req.body
  const result = await categoryServices.updateCategoryById(id, payload)
  responseSuccess(res, {
    message: 'Category updated successfully',
    data: result
  })
}
const deleteFoodType = async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await categoryServices.deleteCategory(id)
  responseSuccess(res, {
    message: 'Category deleted successfully',
    data: result
  })
}

const categoryControllers = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategorryById,
  deleteFoodType
}
export default categoryControllers
