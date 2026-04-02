import {authRouter} from './auth'
import {groupRouter} from './group'
import {taskRouter} from './task'
import {ratingRouter} from './rating'
import {complaintRouter} from './complaint'

export const Routes = [
  {
    path: '/auth',
    router: authRouter,
  },
  {
    path: '/group',
    router: groupRouter,
  },
  {
    path: '/task',
    router: taskRouter,
  },
  {
    path: '/rating',
    router: ratingRouter,
  },
  {
    path: '/complaint',
    router: complaintRouter,
  },
]
