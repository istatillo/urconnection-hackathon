import {ReasonPhrases, StatusCodes} from 'http-status-codes'

import {TaskModel} from '../../models/task'
import {GroupModel} from '../../models/group'
import {SubmissionModel} from '../../models/submission'
import {TeacherModel} from '../../models/teacher'
import {HttpException} from '../../utils/http.exception'
import {asyncHandler} from '../../middlewares/async-handler.middleware'
import {analyzeTaskImage} from '../../services/openai.service'
import {fileToBase64} from '../../utils/image-processor'
import {notifyGroupMembers} from '../../bot/handlers/notification.handler'
import {logger} from '../../utils/logger'

export class TaskController {
  public static create = asyncHandler(async (req, res) => {
    const {name, group, deadline} = req.body
    const teacherId = req.body.user._id
    const file = req.file

    if (!file) {
      throw new HttpException(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, 'Vazifa rasmi yuklanishi shart!')
    }

    const groupDoc = await GroupModel.findOne({_id: group, teacher: teacherId})
    if (!groupDoc) {
      throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Guruh topilmadi!')
    }

    const teacher = await TeacherModel.findById(teacherId)
    if (!teacher) {
      throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Teacher topilmadi!')
    }

    const image_url = `uploads/tasks/${file.filename}`

    let topic = ''
    let context = ''

    try {
      const base64 = await fileToBase64(file.path)
      const analysis = await analyzeTaskImage(base64, teacher.subject)
      topic = analysis.topic || ''
      context = analysis.context || ''
      logger.info('AI task analysis completed', {topic, task_type: analysis.task_type})
    } catch (error) {
      logger.error('AI analysis failed, saving task without AI data', {error})
    }

    const task = await TaskModel.create({
      name,
      image_url,
      topic,
      context,
      group,
      teacher: teacherId,
      deadline: new Date(deadline),
    })

    // Send notification to group members
    try {
      await notifyGroupMembers({
        taskId: task._id.toString(),
        taskName: task.name,
        topic: task.topic,
        groupId: groupDoc._id.toString(),
        groupName: groupDoc.name,
        deadline: task.deadline,
        imageUrl: task.image_url,
      })
    } catch (notifError) {
      logger.error('Failed to send task notifications', {notifError})
    }

    res.status(StatusCodes.CREATED).json({success: true, data: task})
  })

  public static getAll = asyncHandler(async (req, res) => {
    const teacherId = req.body.user._id
    const {group} = req.query

    const filter: any = {teacher: teacherId}
    if (group) filter.group = group

    const tasks = await TaskModel.find(filter).populate('group', 'name').sort({created_at: -1})

    const tasksWithStats = await Promise.all(
      tasks.map(async (task) => {
        const submissionCount = await SubmissionModel.countDocuments({task: task._id})
        return {...task.toObject(), submission_count: submissionCount}
      }),
    )

    res.status(StatusCodes.OK).json({success: true, data: tasksWithStats})
  })

  public static getById = asyncHandler(async (req, res) => {
    const {id} = req.params
    const teacherId = req.body.user._id

    const task = await TaskModel.findOne({_id: id, teacher: teacherId}).populate('group', 'name')
    if (!task) {
      throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Vazifa topilmadi!')
    }

    const submissions = await SubmissionModel.find({task: id}).populate('student', 'first_name last_name username telegram_id').sort({created_at: -1})

    res.status(StatusCodes.OK).json({
      success: true,
      data: {...task.toObject(), submissions},
    })
  })

  public static update = asyncHandler(async (req, res) => {
    const {id} = req.params
    const teacherId = req.body.user._id
    const {name, topic, context, deadline} = req.body

    const task = await TaskModel.findOne({_id: id, teacher: teacherId})
    if (!task) {
      throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Vazifa topilmadi!')
    }

    const updateData: any = {}
    if (name) updateData.name = name
    if (topic) updateData.topic = topic
    if (context) updateData.context = context
    if (deadline) updateData.deadline = new Date(deadline)

    await task.updateOne({$set: updateData})

    res.status(StatusCodes.OK).json({success: true})
  })
}
