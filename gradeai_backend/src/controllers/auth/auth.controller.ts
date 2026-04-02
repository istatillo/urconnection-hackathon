import {ReasonPhrases, StatusCodes} from 'http-status-codes'

import {TeacherModel} from '../../models/teacher'
import {HashingHelpers} from '../../utils/hashing.helper'
import {HttpException} from '../../utils/http.exception'
import {JwtHelpers} from '../../utils/jwt.helper'
import {asyncHandler} from '../../middlewares/async-handler.middleware'

export class AuthController {
  public static signUp = asyncHandler(async (req, res) => {
    const {name, phone, subject, gender, password} = req.body

    const exists = await TeacherModel.findOne({phone})
    if (exists) {
      throw new HttpException(StatusCodes.CONFLICT, ReasonPhrases.CONFLICT, 'Bu telefon raqam allaqachon ro\'yxatdan o\'tgan!')
    }

    await TeacherModel.create({
      name,
      phone,
      subject,
      gender,
      password: await HashingHelpers.generatePassword(password),
    })

    res.status(StatusCodes.CREATED).json({success: true})
  })

  public static login = asyncHandler(async (req, res) => {
    const {phone, password} = req.body

    const teacher = await TeacherModel.findOne({phone}).select('+password')
    if (!teacher) {
      throw new HttpException(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, 'Telefon raqam yoki parol noto\'g\'ri!')
    }

    if (!(await HashingHelpers.comparePassword(password, teacher.password))) {
      throw new HttpException(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, 'Telefon raqam yoki parol noto\'g\'ri!')
    }

    const access_token = JwtHelpers.sign(teacher._id.toString(), '7d')
    const refresh_token = JwtHelpers.signRefresh(teacher._id.toString(), '30d')

    await teacher.updateOne({$set: {session_token: access_token, refresh_token}})

    res.status(StatusCodes.OK).json({success: true, access_token, refresh_token})
  })

  public static me = asyncHandler(async (req, res) => {
    const {user} = req.body
    const data = await TeacherModel.findById(user._id)
    res.status(StatusCodes.OK).json({success: true, data})
  })

  public static update = asyncHandler(async (req, res) => {
    const {name, phone, subject} = req.body
    const id = req.body?.user?._id?.toString()

    const teacher = await TeacherModel.findById(id)
    if (!teacher) {
      throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Teacher topilmadi!')
    }

    if (phone && phone !== teacher.phone) {
      const phoneExists = await TeacherModel.findOne({phone})
      if (phoneExists) {
        throw new HttpException(StatusCodes.CONFLICT, ReasonPhrases.CONFLICT, 'Bu telefon raqam allaqachon band!')
      }
    }

    const updateData: any = {}
    if (name) updateData.name = name
    if (phone) updateData.phone = phone
    if (subject) updateData.subject = subject

    await teacher.updateOne({$set: updateData})

    res.status(StatusCodes.OK).json({success: true})
  })

  public static updatePassword = asyncHandler(async (req, res) => {
    const id = req.body.user._id.toString()
    const {current_password, new_password} = req.body

    const teacher = await TeacherModel.findById(id).select('+password')
    if (!teacher) {
      throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Teacher topilmadi!')
    }

    if (!(await HashingHelpers.comparePassword(current_password, teacher.password))) {
      throw new HttpException(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, 'Joriy parol noto\'g\'ri!')
    }

    await teacher.updateOne({
      $set: {
        password: await HashingHelpers.generatePassword(new_password),
        session_token: null,
        refresh_token: null,
      },
    })

    res.status(StatusCodes.OK).json({success: true})
  })

  public static refresh = asyncHandler(async (req, res) => {
    const refresh_token = req.params.token
    if (!refresh_token) {
      throw new HttpException(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, 'Forbidden')
    }

    const teacher = await TeacherModel.findOne({refresh_token}).select('+refresh_token +session_token')
    if (!teacher) {
      throw new HttpException(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, 'Forbidden')
    }

    const decoded = JwtHelpers.verifyRefresh(refresh_token)
    if (!decoded || decoded.id !== teacher._id.toString()) {
      throw new HttpException(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, 'Forbidden')
    }

    const new_refresh_token = JwtHelpers.signRefresh(teacher._id.toString(), '30d')
    const new_access_token = JwtHelpers.sign(teacher._id.toString(), '7d')

    await teacher.updateOne({$set: {refresh_token: new_refresh_token, session_token: new_access_token}})

    return res.status(StatusCodes.OK).json({success: true, access_token: new_access_token, refresh_token: new_refresh_token})
  })
}
