import {Schema, model} from 'mongoose'

import {CollectionNames} from '../../constants/db.constants'

interface DocumentI {
  telegram_id: number
  first_name: string
  last_name: string
  username: string
  created_at: Date
  updated_at: Date
}

const documentSchema = new Schema<DocumentI>(
  {
    telegram_id: {type: Number, required: true, unique: true},
    first_name: {type: String, required: true},
    last_name: {type: String, default: ''},
    username: {type: String, default: ''},
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}, versionKey: false},
)

export const StudentModel = model<DocumentI>(CollectionNames.STUDENT, documentSchema, CollectionNames.STUDENT)
