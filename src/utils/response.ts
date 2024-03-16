import { Response } from 'express'
import { omit } from 'lodash'
import statusCode from '~/constants/statusCode'
import { ErrorWithStatus, EntityError } from './errors'
import { SuccessResponse } from '~/type'

export const responseError = (res: Response, error: ErrorWithStatus | EntityError | any) => {
  if (error instanceof ErrorWithStatus) {
    const status = error.status
    // Xử lý trường hợp lỗi là chuổi (string)
    if (typeof error === 'string') {
      return res.status(status).json({
        message: error
      })
    }
    // Xử lý trường hợp lỗi là object
    if (typeof error === 'object') {
      return res.status(status).json(omit(error, ['status']))
    }
  }
  return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
    message: error.message
  })
}

export const responseSuccess = (res: Response, data: SuccessResponse<any>) => {
  return res.status(statusCode.OK).json({
    message: data.message,
    data: data.data
  })
}
