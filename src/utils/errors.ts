import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import { TOKEN_TYPE } from '~/constants/enums'
import response_messages from '~/constants/messages'
import statusCode from '~/constants/statusCode'
import Partner from '~/models/schemas/Partner.schema'

type ErrorsType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

type JWTError = {
  type: TOKEN_TYPE | string
  message: string
  data?: Partner
}
export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class ErrorWithMessage extends ErrorWithStatus {
  constructor({ message, status }: { message: string; status: number }) {
    super({ message, status })
  }
}
export class UnauthorizedError extends ErrorWithStatus {
  errors: JWTError
  constructor({
    message = response_messages.unauthorized.expired_token,
    errors
  }: {
    message?: string
    errors: JWTError
  }) {
    super({ message, status: statusCode.UNAUTHORIZED })
    this.errors = errors
  }
}
export class EntityError extends ErrorWithStatus {
  errors: ErrorsType
  constructor({
    message = response_messages.unprocessable_entity.msg,
    errors
  }: {
    message?: string
    errors: ErrorsType
  }) {
    super({ message, status: statusCode.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    if (err instanceof ErrorWithMessage) {
      return res.status(err.status).json({
        message: err.message
      })
    }
    if (err instanceof ErrorWithStatus) {
      return res.status(err.status).json(omit(err, ['status']))
    }
    const finalError: any = {}
    Object.getOwnPropertyNames(err).forEach((key) => {
      if (
        !Object.getOwnPropertyDescriptor(err, key)?.configurable ||
        !Object.getOwnPropertyDescriptor(err, key)?.writable
      ) {
        return
      }
      finalError[key] = err[key]
    })
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: finalError.message,
      errorInfo: omit(finalError, ['stack'])
    })
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      errorInfo: omit(error as any, ['stack'])
    })
  }
}
