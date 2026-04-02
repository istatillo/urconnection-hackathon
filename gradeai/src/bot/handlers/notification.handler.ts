import path from 'path'
import fs from 'fs'

import {bot} from '../telegram.service'
import {GroupMemberModel} from '../../models/group-member'
import {logger} from '../../utils/logger'

export interface TaskNotification {
  taskId: string
  taskName: string
  topic: string
  groupId: string
  groupName: string
  deadline: Date
  imageUrl?: string
}

export async function notifyGroupMembers(notification: TaskNotification): Promise<void> {
  const members = await GroupMemberModel.find({group: notification.groupId, status: 'active'}).populate('student')

  const deadlineStr = new Date(notification.deadline).toLocaleString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const text =
    `📢 *Yangi vazifa!*\n\n` +
    `📌 *${notification.taskName}*\n` +
    `📚 Mavzu: ${notification.topic || 'Ko\'rsatilmagan'}\n` +
    `👥 Guruh: ${notification.groupName}\n` +
    `⏰ Deadline: ${deadlineStr}\n\n` +
    `Javob topshirish uchun quyidagi tugmani bosing:`

  let sentCount = 0

  for (const member of members) {
    const student = member.student as any
    if (!student?.telegram_id) continue

    try {
      if (notification.imageUrl) {
        const imagePath = path.join(process.cwd(), notification.imageUrl)

        if (fs.existsSync(imagePath)) {
          await bot.sendPhoto(student.telegram_id, imagePath, {
            caption: text,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{text: '✍️ Topshirish', callback_data: `submit_${notification.taskId}`}],
              ],
            },
          })
        } else {
          await bot.sendMessage(student.telegram_id, text, {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{text: '✍️ Topshirish', callback_data: `submit_${notification.taskId}`}],
              ],
            },
          })
        }
      } else {
        await bot.sendMessage(student.telegram_id, text, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{text: '✍️ Topshirish', callback_data: `submit_${notification.taskId}`}],
            ],
          },
        })
      }
      sentCount++
    } catch (error) {
      logger.warn('Failed to send notification to student', {telegram_id: student.telegram_id, error})
    }
  }

  logger.info('Task notifications sent', {taskId: notification.taskId, sentCount, totalMembers: members.length})
}
