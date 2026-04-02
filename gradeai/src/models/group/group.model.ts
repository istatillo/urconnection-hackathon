import {Schema, model} from 'mongoose'

import {CollectionNames} from '../../constants/db.constants'

interface DocumentI {
  name: string
  status: string
  invite_code: string
  teacher: Schema.Types.ObjectId
  created_at: Date
  updated_at: Date
}

const documentSchema = new Schema<DocumentI>(
  {
    name: {type: String, required: true},
    status: {type: String, enum: ['open', 'closed'], default: 'open'},
    invite_code: {type: String, required: true, unique: true},
    teacher: {type: Schema.Types.ObjectId, ref: CollectionNames.TEACHER, required: true},
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}, versionKey: false},
)

export const GroupModel = model<DocumentI>(CollectionNames.GROUP, documentSchema, CollectionNames.GROUP)
