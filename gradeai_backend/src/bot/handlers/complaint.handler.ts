import TelegramBot from 'node-telegram-bot-api'

import {sendMessage} from '../telegram.service'
import {StudentModel} from '../../models/student'
import {SubmissionModel} from '../../models/submission'
import {ComplaintModel} from '../../models/complaint'
import {logger} from '../../utils/logger'

export async function handleComplaintCallback(
  chatId: number,
  from: TelegramBot.User,
  submissionId: string,
  awaitingComplaint: Map<number, string>,
): Promise<void> {
  const student = await StudentModel.findOne({telegram_id: from.id})
  if (!student) {
    await sendMessage(chatId, '❌ Siz ro\'yxatdan o\'tmagansiz.')
    return
  }

  const submission = await SubmissionModel.findOne({_id: submissionId, student: student._id})
  if (!submission) {
    await sendMessage(chatId, '❌ Topshiriq topilmadi.')
    return
  }

  const existingComplaint = await ComplaintModel.findOne({submission: submissionId, student: student._id})
  if (existingComplaint) {
    await sendMessage(
      chatId,
      `📋 *Siz allaqachon shikoyat qilgansiz.*\n\n` +
        `Holati: *${existingComplaint.status === 'pending' ? 'Ko\'rib chiqilmoqda' : existingComplaint.status === 'resolved' ? 'Hal qilindi' : 'Ko\'rib chiqildi'}*\n\n` +
        `O'qituvchingiz tez orada ko'rib chiqadi.`,
    )
    return
  }

  awaitingComplaint.set(chatId, submissionId)

  await sendMessage(
    chatId,
    `⚖️ *Shikoyat yozish*\n\n` +
      `Iltimos, shikoyat sababingizni qisqacha yozing.\n` +
      `Masalan: "AI noto'g'ri baho qo'ydi, javobim to'g'ri edi"\n\n` +
      `✍️ Sababni yozing:`,
  )
}

export async function handleComplaintText(
  chatId: number,
  from: TelegramBot.User,
  submissionId: string,
  reason: string,
): Promise<void> {
  const student = await StudentModel.findOne({telegram_id: from.id})
  if (!student) return

  const submission = await SubmissionModel.findOne({_id: submissionId, student: student._id})
  if (!submission) {
    await sendMessage(chatId, '❌ Topshiriq topilmadi.')
    return
  }

  try {
    await ComplaintModel.create({
      student: student._id,
      task: submission.task,
      submission: submissionId,
      reason,
    })

    await submission.updateOne({$set: {status: 'complained'}})

    await sendMessage(
      chatId,
      `✅ *Shikoyatingiz qabul qilindi!*\n\n` +
        `📝 Sabab: "${reason}"\n\n` +
        `O'qituvchingiz ko'rib chiqadi va kerak bo'lsa bahoyingizni o'zgartiradi.\n` +
        `Sabr bilan kuting! 🙏`,
    )

    logger.info('Complaint created', {student: student._id, submission: submissionId})
  } catch (error) {
    logger.error('Error creating complaint', {chatId, submissionId, error})
    await sendMessage(chatId, '❌ Shikoyat yuborishda xatolik. Qayta urinib ko\'ring.')
  }
}
