import {Schema, model} from 'mongoose'

import {CollectionNames} from '../../constants/db.constants'
import {SubjectConstants} from '../../constants/subject.constants'

interface DocumentI {
  name: string
  phone: string
  subject: string
  gender: string
  password: string
  session_token: string | null
  refresh_token: string | null
  created_at: Date
  updated_at: Date
}

const documentSchema = new Schema<DocumentI>(
  {
    name: {type: String, required: true},
    phone: {type: String, required: true, unique: true},
    subject: {type: String, required: true, enum: Object.values(SubjectConstants)},
    gender: {type: String, required: true, enum: ['male', 'female']},
    password: {type: String, required: true, select: false},
    session_token: {type: String, default: null, select: false},
    refresh_token: {type: String, default: null, select: false},
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}, versionKey: false},
)

export const TeacherModel = model<DocumentI>(CollectionNames.TEACHER, documentSchema, CollectionNames.TEACHER)
