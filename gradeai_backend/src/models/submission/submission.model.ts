import {Schema, model} from 'mongoose'

import {CollectionNames} from '../../constants/db.constants'

interface DocumentI {
  student: Schema.Types.ObjectId
  task: Schema.Types.ObjectId
  answer_image: string
  ai_score: number
  ai_comment: string
  ai_full_response: string
  override_score: number | null
  override_by: Schema.Types.ObjectId | null
  override_at: Date | null
  status: string
  created_at: Date
  updated_at: Date
}

const documentSchema = new Schema<DocumentI>(
  {
    student: {type: Schema.Types.ObjectId, ref: CollectionNames.STUDENT, required: true},
    task: {type: Schema.Types.ObjectId, ref: CollectionNames.TASK, required: true},
    answer_image: {type: String, required: true},
    ai_score: {type: Number, required: true, min: 0, max: 10},
    ai_comment: {type: String, default: ''},
    ai_full_response: {type: String, default: ''},
    override_score: {type: Number, default: null, min: 0, max: 10},
    override_by: {type: Schema.Types.ObjectId, ref: CollectionNames.TEACHER, default: null},
    override_at: {type: Date, default: null},
    status: {type: String, enum: ['graded', 'complained', 'overridden'], default: 'graded'},
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}, versionKey: false},
)

documentSchema.index({student: 1, task: 1}, {unique: true})

export const SubmissionModel = model<DocumentI>(CollectionNames.SUBMISSION, documentSchema, CollectionNames.SUBMISSION)
