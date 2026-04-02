import {ReasonPhrases, StatusCodes} from 'http-status-codes'
import {NextFunction, Request, Response} from 'express'

import {TeacherModel} from '../models/teacher'
import {HttpException} from '../utils/http.exception'
import {JwtHelpers} from '../utils/jwt.helper'
import {asyncHandler} from './async-handler.middleware'

export const auth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
  }

  const decoded = JwtHelpers.verify(token) as {id: string}

  if (decoded && !decoded.id) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
  }

  const user = await TeacherModel.findById(decoded.id).select('+session_token')

  if (!user) {
    throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Teacher not found!')
  }

  req.body.user = user

  next()
})
