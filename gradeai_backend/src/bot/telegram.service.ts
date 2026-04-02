import TelegramBot from 'node-telegram-bot-api'
import axios from 'axios'
import fs from 'fs/promises'

import {TELEGRAM_BOT_TOKEN, MAX_IMAGE_SIZE_MB} from '../utils/secrets'
import {logger} from '../utils/logger'
import {ensureTempDir, getTempFilePath, isValidImageMimeType} from '../utils/image-processor'

export const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {polling: false})

export interface DownloadedFile {
  path: string
  fileName: string
  mimeType: string
  fileSize: number
}

export async function sendMessage(chatId: number, text: string, options?: TelegramBot.SendMessageOptions): Promise<TelegramBot.Message> {
  return bot.sendMessage(chatId, text, {parse_mode: 'Markdown', ...options})
}

export async function sendLoadingMessage(chatId: number): Promise<number> {
  const msg = await sendMessage(chatId, '⏳ *Javobingiz tekshirilmoqda...*\n\nIltimos, kuting...')
  return msg.message_id
}

export async function deleteMessage(chatId: number, messageId: number): Promise<void> {
  try {
    await bot.deleteMessage(chatId, messageId)
  } catch (error) {
    logger.warn('Failed to delete message', {chatId, messageId})
  }
}

export async function sendAnalysisResult(chatId: number, text: string, options?: TelegramBot.SendMessageOptions): Promise<void> {
  const MAX_LENGTH = 4000

  if (text.length <= MAX_LENGTH) {
    await sendMessage(chatId, text, options)
    return
  }

  const chunks = splitMessage(text, MAX_LENGTH)
  for (let i = 0; i < chunks.length; i++) {
    await sendMessage(chatId, chunks[i], i === chunks.length - 1 ? options : undefined)
  }
}

function splitMessage(text: string, maxLength: number): string[] {
  const chunks: string[] = []
  let current = ''

  for (const line of text.split('\n')) {
    if ((current + line + '\n').length > maxLength) {
      if (current) chunks.push(current.trim())
      current = line.length > maxLength ? line.substring(0, maxLength) : line + '\n'
    } else {
      current += line + '\n'
    }
  }
  if (current) chunks.push(current.trim())
  return chunks
}

export async function downloadPhoto(fileId: string, mimeType: string = 'image/jpeg'): Promise<DownloadedFile> {
  await ensureTempDir()

  const file = await bot.getFile(fileId)
  if (!file.file_path) {
    throw new Error('Could not get file path from Telegram')
  }

  const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file.file_path}`
  const fileName = `homework-${Date.now()}.jpg`
  const filePath = getTempFilePath(fileName)

  const response = await axios.get(fileUrl, {
    responseType: 'arraybuffer',
    timeout: 30000,
    maxContentLength: MAX_IMAGE_SIZE_MB * 1024 * 1024 * 2,
  })

  const fileSize = response.data.length

  if (fileSize > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    throw new Error(`Rasm juda katta. Maksimal hajm: ${MAX_IMAGE_SIZE_MB}MB`)
  }

  if (mimeType && !isValidImageMimeType(mimeType)) {
    throw new Error('Noto\'g\'ri rasm formati. Faqat: JPG, PNG, WebP')
  }

  await fs.writeFile(filePath, Buffer.from(response.data))

  return {path: filePath, fileName, mimeType: mimeType || 'image/jpeg', fileSize}
}

export async function cleanupDownloadedFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
  } catch {
    // ignore
  }
}
