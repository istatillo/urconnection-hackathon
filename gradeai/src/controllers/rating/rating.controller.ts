import {ReasonPhrases, StatusCodes} from 'http-status-codes'

import {GroupModel} from '../../models/group'
import {GroupMemberModel} from '../../models/group-member'
import {SubmissionModel} from '../../models/submission'
import {TaskModel} from '../../models/task'
import {HttpException} from '../../utils/http.exception'
import {asyncHandler} from '../../middlewares/async-handler.middleware'

export class RatingController {
  public static getGroupRating = asyncHandler(async (req, res) => {
    const {id} = req.params
    const teacherId = req.body.user._id

    const group = await GroupModel.findOne({_id: id, teacher: teacherId})
    if (!group) {
      throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Guruh topilmadi!')
    }

    const members = await GroupMemberModel.find({group: id, status: 'active'}).populate('student')

    const ratings = await Promise.all(
      members.map(async (member) => {
        const studentId = (member.student as any)._id

        const submissions = await SubmissionModel.find({student: studentId, task: {$in: await TaskModel.find({group: id}).distinct('_id')}})

        const totalSubmissions = submissions.length
        let averageScore = 0

        if (totalSubmissions > 0) {
          const totalScore = submissions.reduce((sum, sub) => {
            const score = sub.override_score !== null && sub.override_score !== undefined ? sub.override_score : sub.ai_score
            return sum + score
          }, 0)
          averageScore = Math.round((totalScore / totalSubmissions) * 10) / 10
        }

        return {
          student: member.student,
          total_submissions: totalSubmissions,
          average_score: averageScore,
        }
      }),
    )

    ratings.sort((a, b) => b.average_score - a.average_score)

    res.status(StatusCodes.OK).json({success: true, data: ratings})
  })

  public static getStudentProgress = asyncHandler(async (req, res) => {
    const {id} = req.params
    const teacherId = req.body.user._id

    const teacherGroups = await GroupModel.find({teacher: teacherId}).distinct('_id')
    const teacherTasks = await TaskModel.find({group: {$in: teacherGroups}}).distinct('_id')

    const submissions = await SubmissionModel.find({
      student: id,
      task: {$in: teacherTasks},
    })
      .populate({path: 'task', select: 'name topic deadline group', populate: {path: 'group', select: 'name'}})
      .sort({created_at: 1})

    const totalSubmissions = submissions.length
    let averageScore = 0
    const complainedCount = submissions.filter((s) => s.status === 'complained' || s.status === 'overridden').length

    if (totalSubmissions > 0) {
      const totalScore = submissions.reduce((sum, sub) => {
        const score = sub.override_score !== null && sub.override_score !== undefined ? sub.override_score : sub.ai_score
        return sum + score
      }, 0)
      averageScore = Math.round((totalScore / totalSubmissions) * 10) / 10
    }

    const totalTasks = await TaskModel.countDocuments({group: {$in: teacherGroups}})
    const notSubmittedCount = totalTasks - totalSubmissions

    const progressData = submissions.map((sub) => ({
      task: sub.task,
      score: sub.override_score !== null && sub.override_score !== undefined ? sub.override_score : sub.ai_score,
      status: sub.status,
      submitted_at: sub.created_at,
    }))

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        total_submissions: totalSubmissions,
        total_tasks: totalTasks,
        not_submitted: notSubmittedCount,
        complained: complainedCount,
        average_score: averageScore,
        progress: progressData,
      },
    })
  })
}
