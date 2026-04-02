import {Schema, model} from 'mongoose'

import {CollectionNames} from '../../constants/db.constants'

interface DocumentI {
  name: string
  image_url: string
  topic: string
  context: string
  group: Schema.Types.ObjectId
  teacher: Schema.Types.ObjectId
  deadline: Date
  created_at: Date
  updated_at: Date
}

const documentSchema = new Schema<DocumentI>(
  {
    name: {type: String, required: true},
    image_url: {type: String, required: true},
    topic: {type: String, default: ''},
    context: {type: String, default: ''},
    group: {type: Schema.Types.ObjectId, ref: CollectionNames.GROUP, required: true},
    teacher: {type: Schema.Types.ObjectId, ref: CollectionNames.TEACHER, required: true},
    deadline: {type: Date, required: true},
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}, versionKey: false},
)

export const TaskModel = model<DocumentI>(CollectionNames.TASK, documentSchema, CollectionNames.TASK)
