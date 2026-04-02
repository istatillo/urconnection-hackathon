import {Schema, model} from 'mongoose'

import {CollectionNames} from '../../constants/db.constants'

interface DocumentI {
  student: Schema.Types.ObjectId
  task: Schema.Types.ObjectId
  submission: Schema.Types.ObjectId
  reason: string
  status: string
  resolved_by: Schema.Types.ObjectId | null
  resolved_at: Date | null
  created_at: Date
  updated_at: Date
}

const documentSchema = new Schema<DocumentI>(
  {
    student: {type: Schema.Types.ObjectId, ref: CollectionNames.STUDENT, required: true},
    task: {type: Schema.Types.ObjectId, ref: CollectionNames.TASK, required: true},
    submission: {type: Schema.Types.ObjectId, ref: CollectionNames.SUBMISSION, required: true},
    reason: {type: String, required: true},
    status: {type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending'},
    resolved_by: {type: Schema.Types.ObjectId, ref: CollectionNames.TEACHER, default: null},
    resolved_at: {type: Date, default: null},
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}, versionKey: false},
)

export const ComplaintModel = model<DocumentI>(CollectionNames.COMPLAINT, documentSchema, CollectionNames.COMPLAINT)
