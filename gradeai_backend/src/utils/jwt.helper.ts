import {ReasonPhrases, StatusCodes} from 'http-status-codes'
import pkg from 'jsonwebtoken'

import {HttpException} from './http.exception'
import {JWT_SECRET, JWT_SECRET_REFRESH} from './secrets'

interface JWT {
  verify: (token: string, secretKey: string) => {id: string}
  sign: (payload: object, secretOrPrivateKey: string, options?: any) => string
}

const {sign: jwtSign, verify: jwtVerify} = pkg as unknown as JWT

export class JwtHelpers {
  public static sign(id: string, expiresIn: string): string {
    return jwtSign({id}, JWT_SECRET, {expiresIn})
  }
  public static signRefresh(id: string, expiresIn: string): string {
    return jwtSign({id}, JWT_SECRET_REFRESH, {expiresIn})
  }
  public static verify(token: string) {
    try {
      return jwtVerify(token, JWT_SECRET)
    } catch (error: any) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, error.message)
    }
  }
  public static verifyRefresh(token: string) {
    try {
      return jwtVerify(token, JWT_SECRET_REFRESH)
    } catch (error: any) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, error.message)
    }
  }
}
