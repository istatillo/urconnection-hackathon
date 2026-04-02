import {Router} from 'express'

import {AuthController} from '../../controllers/auth'
import {auth} from '../../middlewares/auth.middleware'
import {validate} from '../../validators'
import {AuthValidator} from '../../validators/auth'

export const authRouter = Router()

authRouter.post('/sign-up', AuthValidator.signUp(), validate, AuthController.signUp)
authRouter.post('/login', AuthValidator.login(), validate, AuthController.login)
authRouter.post('/refresh-token/:token', AuthController.refresh)

authRouter.get('/me', auth, AuthController.me)
authRouter.put('/update', auth, AuthValidator.update(), validate, AuthController.update)
authRouter.put('/update-password', auth, AuthValidator.updatePassword(), validate, AuthController.updatePassword)
