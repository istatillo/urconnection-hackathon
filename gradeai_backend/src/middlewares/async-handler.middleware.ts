import {NextFunction, Request, Response} from 'express'

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>
type NoAsyncFunction = (req: Request, res: Response, next: NextFunction) => any

export const asyncHandler = (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export const noAsyncHandler = (fn: NoAsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
