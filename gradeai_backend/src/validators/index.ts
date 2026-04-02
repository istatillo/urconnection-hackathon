import {validationResult} from 'express-validator'
import {ReasonPhrases, StatusCodes} from 'http-status-codes'

import {NextFunction, Request, Response} from 'express'

import {HttpException} from '../utils/http.exception'

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  let messages = ''

  errors.array().map((err: any) => {
    messages += (err.msg as string) + ' '
  })

  throw new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, ReasonPhrases.UNPROCESSABLE_ENTITY, messages.trimEnd())
}
