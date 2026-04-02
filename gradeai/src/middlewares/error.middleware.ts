import {ReasonPhrases, StatusCodes} from 'http-status-codes'
import {NextFunction, Request, Response} from 'express'

import {HttpException} from '../utils/http.exception'

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  try {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    const statusMsg = error.statusMsg || ReasonPhrases.INTERNAL_SERVER_ERROR
    const msg = error.msg || error.message || ReasonPhrases.INTERNAL_SERVER_ERROR

    return res.status(statusCode).json({
      success: false,
      error: {
        statusCode,
        statusMsg,
        msg,
      },
    })
  } catch (err) {
    return next(err)
  }
}
