import {ReasonPhrases, StatusCodes} from 'http-status-codes'
import {NextFunction, Request, Response} from 'express'

import {HttpException} from '../utils/http.exception'
import {noAsyncHandler} from './async-handler.middleware'

export const roleMiddleware = (allowedRoles: string[]) =>
  noAsyncHandler((req: Request, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.body?.user?.role)) {
      throw new HttpException(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, 'You are not allowed!')
    }
    next()
  })
