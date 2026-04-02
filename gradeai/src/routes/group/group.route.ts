import {Router} from 'express'

import {GroupController} from '../../controllers/group'
import {auth} from '../../middlewares/auth.middleware'
import {validate} from '../../validators'
import {GroupValidator} from '../../validators/group'

export const groupRouter = Router()

groupRouter.post('/create', auth, GroupValidator.create(), validate, GroupController.create)
groupRouter.get('/get-all', auth, GroupController.getAll)
groupRouter.get('/get/:id', auth, GroupValidator.getById(), validate, GroupController.getById)
groupRouter.put('/update/:id', auth, GroupValidator.update(), validate, GroupController.update)
groupRouter.patch('/freeze/:id/:student_id', auth, GroupValidator.memberAction(), validate, GroupController.freezeMember)
groupRouter.delete('/remove/:id/:student_id', auth, GroupValidator.memberAction(), validate, GroupController.removeMember)
groupRouter.get('/invite-link/:id', auth, GroupValidator.getById(), validate, GroupController.getInviteLink)
