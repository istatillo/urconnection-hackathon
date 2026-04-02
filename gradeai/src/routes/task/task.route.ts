import {Router} from 'express'

import {TaskController} from '../../controllers/task'
import {auth} from '../../middlewares/auth.middleware'
import {validate} from '../../validators'
import {TaskValidator} from '../../validators/task'
import {uploadTaskImage} from '../../utils/multer'

export const taskRouter = Router()

taskRouter.post('/create', uploadTaskImage.single('image'), auth, TaskValidator.create(), validate, TaskController.create)
taskRouter.get('/get-all', auth, TaskValidator.getAll(), validate, TaskController.getAll)
taskRouter.get('/get/:id', auth, TaskValidator.getById(), validate, TaskController.getById)
taskRouter.put('/update/:id', auth, TaskValidator.update(), validate, TaskController.update)
