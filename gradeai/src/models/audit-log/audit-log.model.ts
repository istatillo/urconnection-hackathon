import {Schema, model} from 'mongoose'

import {CollectionNames} from '../../constants/db.constants'

interface DocumentI {
  action: string
  performed_by: Schema.Types.ObjectId
  target_student: Schema.Types.ObjectId | null
  task: Schema.Types.ObjectId | null
  submission: Schema.Types.ObjectId | null
  old_value: string
  new_value: string
  created_at: Date
}

const documentSchema = new Schema<DocumentI>(
  {
    action: {type: String, required: true, enum: ['override', 'freeze', 'remove', 'unfreeze']},
    performed_by: {type: Schema.Types.ObjectId, ref: CollectionNames.TEACHER, required: true},
    target_student: {type: Schema.Types.ObjectId, ref: CollectionNames.STUDENT, default: null},
    task: {type: Schema.Types.ObjectId, ref: CollectionNames.TASK, default: null},
    submission: {type: Schema.Types.ObjectId, ref: CollectionNames.SUBMISSION, default: null},
    old_value: {type: String, default: ''},
    new_value: {type: String, default: ''},
  },
  {timestamps: {createdAt: 'created_at', updatedAt: false}, versionKey: false},
)

export const AuditLogModel = model<DocumentI>(CollectionNames.AUDIT_LOG, documentSchema, CollectionNames.AUDIT_LOG)
