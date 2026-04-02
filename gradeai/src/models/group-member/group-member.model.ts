import {Schema, model} from 'mongoose'

import {CollectionNames} from '../../constants/db.constants'

interface DocumentI {
  group: Schema.Types.ObjectId
  student: Schema.Types.ObjectId
  status: string
  joined_at: Date
  created_at: Date
  updated_at: Date
}

const documentSchema = new Schema<DocumentI>(
  {
    group: {type: Schema.Types.ObjectId, ref: CollectionNames.GROUP, required: true},
    student: {type: Schema.Types.ObjectId, ref: CollectionNames.STUDENT, required: true},
    status: {type: String, enum: ['active', 'frozen', 'removed'], default: 'active'},
    joined_at: {type: Date, default: () => new Date()},
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}, versionKey: false},
)

documentSchema.index({group: 1, student: 1}, {unique: true})

export const GroupMemberModel = model<DocumentI>(CollectionNames.GROUP_MEMBER, documentSchema, CollectionNames.GROUP_MEMBER)
