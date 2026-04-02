import TelegramBot from 'node-telegram-bot-api'

import {bot} from './telegram.service'
import {logger} from '../utils/logger'
import {handleStart} from './handlers/start.handler'
import {handleSubmissionCallback, handlePhotoSubmission} from './handlers/submission.handler'
import {handleComplaintCallback, handleComplaintText} from './handlers/complaint.handler'

export class TelegramBotApp {
  private bot: TelegramBot
  private processingChats: Set<number>
  private awaitingAnswer: Map<number, string>
  private awaitingComplaint: Map<number, string>

  constructor() {
    this.bot = bot
    this.processingChats = new Set()
    this.awaitingAnswer = new Map()
    this.awaitingComplaint = new Map()
  }

  public async start(): Promise<void> {
    try {
      await this.bot.stopPolling()
      await new Promise((resolve) => setTimeout(resolve, 1000))
      this.bot.startPolling()
      logger.info('Telegram bot started successfully')
      this.setupHandlers()
    } catch (error) {
      logger.error('Failed to start bot', {error})
      throw error
    }
  }

  private setupHandlers(): void {
    this.bot.onText(/\/start(.*)/, async (msg, match) => {
      const chatId = msg.chat.id
      const inviteCode = match?.[1]?.trim()

      try {
        await handleStart(chatId, msg.from!, inviteCode || undefined)
      } catch (error) {
        logger.error('Error in /start handler', {chatId, error})
      }
    })

    this.bot.on('callback_query', async (query) => {
      const chatId = query.message?.chat.id
      if (!chatId || !query.data) return

      try {
        await this.bot.answerCallbackQuery(query.id)

        if (query.data.startsWith('submit_')) {
          const taskId = query.data.replace('submit_', '')
          await handleSubmissionCallback(chatId, query.from, taskId, this.awaitingAnswer)
        } else if (query.data.startsWith('complain_')) {
          const submissionId = query.data.replace('complain_', '')
          await handleComplaintCallback(chatId, query.from, submissionId, this.awaitingComplaint)
        }
      } catch (error) {
        logger.error('Error in callback_query handler', {chatId, data: query.data, error})
      }
    })

    this.bot.on('photo', async (msg) => {
      const chatId = msg.chat.id

      if (!this.awaitingAnswer.has(chatId)) return

      if (this.processingChats.has(chatId)) {
        await bot.sendMessage(chatId, '⏳ Iltimos, joriy tekshiruv tugashini kuting...', {parse_mode: 'Markdown'})
        return
      }

      try {
        this.processingChats.add(chatId)
        const taskId = this.awaitingAnswer.get(chatId)!
        this.awaitingAnswer.delete(chatId)

        const photos = msg.photo
        if (!photos || photos.length === 0) return

        const photo = photos[photos.length - 1]
        await handlePhotoSubmission(chatId, msg.from!, photo.file_id, taskId)
      } catch (error) {
        logger.error('Error processing photo submission', {chatId, error})
        await bot.sendMessage(chatId, '❌ Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.', {parse_mode: 'Markdown'})
      } finally {
        this.processingChats.delete(chatId)
      }
    })

    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id

      if (msg.photo || (msg.text && msg.text.startsWith('/'))) return

      if (this.awaitingComplaint.has(chatId) && msg.text) {
        const submissionId = this.awaitingComplaint.get(chatId)!
        this.awaitingComplaint.delete(chatId)
        await handleComplaintText(chatId, msg.from!, submissionId, msg.text)
        return
      }

      if (this.awaitingAnswer.has(chatId)) {
        await bot.sendMessage(chatId, '📸 Iltimos, javobingizning *rasmini* yuboring.', {parse_mode: 'Markdown'})
        return
      }
    })

    this.bot.on('polling_error', (error) => {
      logger.error('Polling error', {error})
    })
  }

  public async stop(): Promise<void> {
    this.bot.stopPolling()
    logger.info('Telegram bot stopped')
  }

  public getBot(): TelegramBot {
    return this.bot
  }

  public getAwaitingAnswer(): Map<number, string> {
    return this.awaitingAnswer
  }
}

let botInstance: TelegramBotApp | null = null

export function getBotInstance(): TelegramBotApp {
  if (!botInstance) {
    botInstance = new TelegramBotApp()
  }
  return botInstance
}
