import TelegramBot from 'node-telegram-bot-api'
import fs from 'fs'

import {bot, sendMessage, sendLoadingMessage, deleteMessage, downloadPhoto, cleanupDownloadedFile} from '../telegram.service'
import {StudentModel} from '../../models/student'
import {TaskModel} from '../../models/task'
import {SubmissionModel} from '../../models/submission'
import {GroupMemberModel} from '../../models/group-member'
import {TeacherModel} from '../../models/teacher'
import {processImage, saveAnswerImage} from '../../utils/image-processor'
import {gradeStudentAnswer, isRelevantAnswer} from '../../services/openai.service'
import {logger} from '../../utils/logger'
import {MAX_IMAGE_SIZE_MB} from '../../utils/secrets'

export async function handleSubmissionCallback(
  chatId: number,
  from: TelegramBot.User,
  taskId: string,
  awaitingAnswer: Map<number, string>,
): Promise<void> {
  const student = await StudentModel.findOne({telegram_id: from.id})
  if (!student) {
    await sendMessage(chatId, '❌ Siz ro\'yxatdan o\'tmagansiz. /start buyrug\'ini yuboring.')
    return
  }

  const task = await TaskModel.findById(taskId).populate('group')
  if (!task) {
    await sendMessage(chatId, '❌ Vazifa topilmadi.')
    return
  }

  // 1. Deadline tekshirish
  if (new Date() > new Date(task.deadline)) {
    await sendMessage(chatId, `⏰ *Muddat tugagan!*\n\n"${task.name}" vazifasining topshirish muddati o'tgan.`)
    return
  }

  // 2. A'zolik va status tekshirish
  const membership = await GroupMemberModel.findOne({group: task.group, student: student._id})
  if (!membership || membership.status !== 'active') {
    await sendMessage(chatId, '🚫 Siz bu guruhda faol a\'zo emassiz.')
    return
  }

  // 3. Bir marta topshirish tekshiruvi
  const existingSubmission = await SubmissionModel.findOne({student: student._id, task: taskId})
  if (existingSubmission) {
    await sendMessage(
      chatId,
      `🔒 *Siz bu vazifani allaqachon topshirgansiz!*\n\n` +
        `🎯 Bahoyingiz: *${existingSubmission.override_score ?? existingSubmission.ai_score}/10*\n\n` +
        `Har bir vazifani faqat 1 marta topshirish mumkin.`,
    )
    return
  }

  awaitingAnswer.set(chatId, taskId)

  await sendMessage(chatId, `📸 *"${task.name}" vazifasi uchun javobingizni yuboring.*\n\nIltimos, javobingizning rasmini yuboring:`)
}

export async function handlePhotoSubmission(
  chatId: number,
  from: TelegramBot.User,
  fileId: string,
  taskId: string,
): Promise<void> {
  const student = await StudentModel.findOne({telegram_id: from.id})
  if (!student) return

  const task = await TaskModel.findById(taskId)
  if (!task) {
    await sendMessage(chatId, '❌ Vazifa topilmadi.')
    return
  }

  // Double-check deadline
  if (new Date() > new Date(task.deadline)) {
    await sendMessage(chatId, `⏰ *Muddat tugagan!*\n\n"${task.name}" vazifasining topshirish muddati o'tgan.`)
    return
  }

  // Double-check existing submission
  const exists = await SubmissionModel.findOne({student: student._id, task: taskId})
  if (exists) {
    await sendMessage(chatId, '🔒 Siz bu vazifani allaqachon topshirgansiz!')
    return
  }

  const loadingMsgId = await sendLoadingMessage(chatId)
  let downloadedFile: {path: string} | null = null

  try {
    downloadedFile = await downloadPhoto(fileId, 'image/jpeg')
    const processed = await processImage(downloadedFile.path, MAX_IMAGE_SIZE_MB)

    const teacher = await TeacherModel.findById(task.teacher)
    const subject = teacher?.subject || 'Umumiy'

    // Check relevance first
    if (task.context) {
      const relevance = await isRelevantAnswer(processed.base64, task.context)
      if (!relevance.is_relevant) {
        await deleteMessage(chatId, loadingMsgId)
        await sendMessage(
          chatId,
          `🚫 *Noto'g'ri vazifa!*\n\n` +
            `Siz yuborgan javob "${task.name}" vazifasiga tegishli emas.\n\n` +
            `📝 Sabab: ${relevance.reason}\n\n` +
            `Iltimos, to'g'ri vazifa javobini yuboring.`,
        )
        return
      }
    }

    // Grade the answer
    const gradeResult = await gradeStudentAnswer(processed.base64, task.context, subject)

    if (!gradeResult.is_relevant) {
      await deleteMessage(chatId, loadingMsgId)
      await sendMessage(chatId, `🚫 *Noto'g'ri vazifa!*\n\nSiz yuborgan javob bu vazifaga tegishli emas.`)
      return
    }

    // Save answer image
    const answerImagePath = await saveAnswerImage(
      fs.readFileSync(downloadedFile.path),
      student._id.toString(),
    )

    // Create submission
    const submission = await SubmissionModel.create({
      student: student._id,
      task: taskId,
      answer_image: answerImagePath,
      ai_score: gradeResult.score,
      ai_comment: gradeResult.comment,
      ai_full_response: JSON.stringify(gradeResult),
    })

    await deleteMessage(chatId, loadingMsgId)

    let resultText =
      `✅ *Vazifa tekshirildi!*\n\n` +
      `📝 *${task.name}*\n` +
      `🎯 *Baho: ${gradeResult.score}/10*\n\n` +
      `💬 *AI izohi:*\n${gradeResult.comment}\n`

    if (gradeResult.mistakes && gradeResult.mistakes.length > 0) {
      resultText += `\n❌ *Xatolar:*\n`
      gradeResult.mistakes.forEach((m, i) => {
        resultText += `${i + 1}. ${m.description}\n   ✅ ${m.correction}\n`
      })
    }

    if (gradeResult.strengths && gradeResult.strengths.length > 0) {
      resultText += `\n✨ *Yaxshi tomonlari:*\n`
      gradeResult.strengths.forEach((s) => {
        resultText += `• ${s}\n`
      })
    }

    if (gradeResult.suggestions && gradeResult.suggestions.length > 0) {
      resultText += `\n📌 *Tavsiyalar:*\n`
      gradeResult.suggestions.forEach((s) => {
        resultText += `• ${s}\n`
      })
    }

    await bot.sendMessage(chatId, resultText, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '⚖️ Shikoyat qilish',
              callback_data: `complain_${submission._id}`,
            },
          ],
        ],
      },
    })

    logger.info('Submission graded', {
      student: student._id,
      task: taskId,
      score: gradeResult.score,
    })
  } catch (error) {
    await deleteMessage(chatId, loadingMsgId)
    logger.error('Error grading submission', {chatId, taskId, error})

    const errMsg = error instanceof Error ? error.message : 'Noma\'lum xato'
    if (errMsg.includes('too large') || errMsg.includes('katta')) {
      await sendMessage(chatId, `📏 *Rasm juda katta!*\n\nIltimos, ${MAX_IMAGE_SIZE_MB}MB dan kichik rasm yuboring.`)
    } else {
      await sendMessage(chatId, `❌ *Xatolik yuz berdi.*\n\nIltimos, qayta urinib ko'ring.`)
    }
  } finally {
    if (downloadedFile) {
      await cleanupDownloadedFile(downloadedFile.path)
    }
  }
}
