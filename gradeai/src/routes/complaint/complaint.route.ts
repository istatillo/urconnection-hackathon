import {Router} from 'express'

import {ComplaintController} from '../../controllers/complaint'
import {auth} from '../../middlewares/auth.middleware'
import {validate} from '../../validators'
import {ComplaintValidator} from '../../validators/complaint'

export const complaintRouter = Router()

complaintRouter.get('/get-all', auth, ComplaintController.getAll)
complaintRouter.get('/get/:id', auth, ComplaintValidator.getById(), validate, ComplaintController.getById)
complaintRouter.post('/override/:id', auth, ComplaintValidator.override(), validate, ComplaintController.override)
