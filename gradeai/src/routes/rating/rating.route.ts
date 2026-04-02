import {Router} from 'express'

import {RatingController} from '../../controllers/rating'
import {auth} from '../../middlewares/auth.middleware'

export const ratingRouter = Router()

ratingRouter.get('/group/:id', auth, RatingController.getGroupRating)
ratingRouter.get('/student/:id', auth, RatingController.getStudentProgress)
