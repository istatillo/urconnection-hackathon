import TelegramBot from 'node-telegram-bot-api'

import {bot, sendMessage} from '../telegram.service'
import {StudentModel} from '../../models/student'
import {GroupModel} from '../../models/group'
import {GroupMemberModel} from '../../models/group-member'
import {logger} from '../../utils/logger'

export async function handleStart(chatId: number, from: TelegramBot.User, inviteCode?: string): Promise<void> {
  let student = await StudentModel.findOne({telegram_id: from.id})

  if (!student) {
    student = await StudentModel.create({
      telegram_id: from.id,
      first_name: from.first_name || '',
      last_name: from.last_name || '',
      username: from.username || '',
    })
    logger.info('New student registered', {telegram_id: from.id, name: from.first_name})
  }

  if (inviteCode) {
    const group = await GroupModel.findOne({invite_code: inviteCode})

    if (!group) {
      await sendMessage(chatId, '❌ *Noto\'g\'ri invite link!*\n\nBu link yaroqsiz yoki muddati tugagan.')
      return
    }

    if (group.status === 'closed') {
      await sendMessage(chatId, '🔒 *Guruh yopiq!*\n\nBu guruhga hozircha qo\'shilish imkonsiz.')
      return
    }

    const existingMember = await GroupMemberModel.findOne({group: group._id, student: student._id})

    if (existingMember) {
      if (existingMember.status === 'removed') {
        await sendMessage(chatId, '🚫 *Siz bu guruhdan chetlatilgansiz.*\n\nO\'qituvchingiz bilan bog\'laning.')
        return
      }
      if (existingMember.status === 'frozen') {
        await sendMessage(chatId, '❄️ *Sizning a\'zoligingiz muzlatilgan.*\n\nO\'qituvchingiz bilan bog\'laning.')
        return
      }
      await sendMessage(
        chatId,
        `✅ *Siz allaqachon "${group.name}" guruhiga a\'zosiz!*\n\n` +
          `Vazifalar kelganda sizga xabar yuboriladi.`,
      )
      return
    }

    await GroupMemberModel.create({
      group: group._id,
      student: student._id,
    })

    const teacher = await (await GroupModel.findById(group._id))?.populate('teacher')

    await sendMessage(
      chatId,
      `🎉 *Tabriklaymiz!*\n\n` +
        `Siz "${group.name}" guruhiga muvaffaqiyatli qo\'shildingiz!\n\n` +
        `📚 Vazifalar kelganda sizga xabar yuboriladi.\n` +
        `✍️ Javobingizni rasm sifatida yuborasiz.\n` +
        `🤖 AI javobingizni tekshirib, baho qo\'yadi.\n\n` +
        `Omad tilaymiz! 🚀`,
    )

    logger.info('Student joined group', {student_id: student._id, group: group.name})
    return
  }

  await sendMessage(
    chatId,
    `🎓 *GradeAI botiga xush kelibsiz!*\n\n` +
      `Men o'qituvchingiz yuborgan vazifalarni AI yordamida tekshiruvchi botman.\n\n` +
      `📌 *Qanday ishlaydi:*\n` +
      `1. O'qituvchingizdan invite link oling\n` +
      `2. Link orqali guruhga qo'shiling\n` +
      `3. Vazifalar kelganda "Topshirish" tugmasini bosing\n` +
      `4. Javobingiz rasmini yuboring\n` +
      `5. AI tekshirib baho qo'yadi\n\n` +
      `Agar natijaga rozi bo'lmasangiz — "Shikoyat" tugmasini bosishingiz mumkin.`,
  )
}
