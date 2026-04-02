import {ReasonPhrases, StatusCodes} from 'http-status-codes'

import {ComplaintModel} from '../../models/complaint'
import {SubmissionModel} from '../../models/submission'
import {StudentModel} from '../../models/student'
import {AuditLogModel} from '../../models/audit-log'
import {GroupModel} from '../../models/group'
import {TaskModel} from '../../models/task'
import {HttpException} from '../../utils/http.exception'
import {asyncHandler} from '../../middlewares/async-handler.middleware'
import {sendMessage} from '../../bot/telegram.service'
import {logger} from '../../utils/logger'

export class ComplaintController {
  public static getAll = asyncHandler(async (req, res) => {
    const teacherId = req.body.user._id

    const teacherGroups = await GroupModel.find({teacher: teacherId}).distinct('_id')
    const teacherTasks = await TaskModel.find({group: {$in: teacherGroups}}).distinct('_id')

    const complaints = await ComplaintModel.find({task: {$in: teacherTasks}})
      .populate('student', 'first_name last_name username')
      .populate('task', 'name topic')
      .populate('submission', 'ai_score ai_comment override_score status')
      .sort({created_at: -1})

    res.status(StatusCodes.OK).json({success: true, data: complaints})
  })

  public static getById = asyncHandler(async (req, res) => {
    const {id} = req.params
    const teacherId = req.body.user._id

    const complaint = await ComplaintModel.findById(id)
      .populate('student', 'first_name last_name username telegram_id')
      .populate({path: 'task', select: 'name topic context image_url deadline'})
      .populate('submission', 'answer_image ai_score ai_comment ai_full_response override_score override_by status')

    if (!complaint) {
      throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Shikoyat topilmadi!')
    }

    const task = await TaskModel.findById(complaint.task)
    if (!task) {
      throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Vazifa topilmadi!')
    }

    const group = await GroupModel.findOne({_id: task.group, teacher: teacherId})
    if (!group) {
      throw new HttpException(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, 'Bu shikoyat sizga tegishli emas!')
    }

    res.status(StatusCodes.OK).json({success: true, data: complaint})
  })

  public static override = asyncHandler(async (req, res) => {
    const {id} = req.params
    const {new_score, message} = req.body
    const teacherId = req.body.user._id

    const complaint = await ComplaintModel.findById(id)
    if (!complaint) {
      throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Shikoyat topilmadi!')
    }

    const task = await TaskModel.findById(complaint.task)
    if (!task) {
      throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Vazifa topilmadi!')
    }

    const group = await GroupModel.findOne({_id: task.group, teacher: teacherId})
    if (!group) {
      throw new HttpException(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, 'Bu shikoyat sizga tegishli emas!')
    }

    const submission = await SubmissionModel.findById(complaint.submission)
    if (!submission) {
      throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Topshiriq topilmadi!')
    }

    const oldScore = submission.override_score !== null ? submission.override_score : submission.ai_score

    await submission.updateOne({
      $set: {
        override_score: new_score,
        override_by: teacherId,
        override_at: new Date(),
        status: 'overridden',
      },
    })

    await complaint.updateOne({
      $set: {
        status: 'resolved',
        resolved_by: teacherId,
        resolved_at: new Date(),
      },
    })

    await AuditLogModel.create({
      action: 'override',
      performed_by: teacherId,
      target_student: complaint.student,
      task: complaint.task,
      submission: complaint.submission,
      old_value: String(oldScore),
      new_value: String(new_score),
    })

    try {
      const student = await StudentModel.findById(complaint.student)
      if (student?.telegram_id) {
        let text =
          `📋 *Shikoyatingiz ko'rib chiqildi!*\n\n` +
          `📌 Vazifa: *${task.name}*\n` +
          `📊 Oldingi baho: *${oldScore}*\n` +
          `✅ Yangi baho: *${new_score}*\n\n`

        if (message) {
          text += `💬 O'qituvchi xabari:\n${message}\n\n`
        }

        text += `O'qituvchingiz shikoyatingizni ko'rib chiqdi va bahoyingizni yangiladi.`

        await sendMessage(student.telegram_id, text)
      }
    } catch (error) {
      logger.warn('Failed to send complaint resolution notification', {student: complaint.student, error})
    }

    res.status(StatusCodes.OK).json({success: true})
  })
}
