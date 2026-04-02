import http from 'http'

import {App} from './index'
import {TelegramBotApp} from './bot/telegram.bot'
import {ENVIRONMENT, PORT} from './utils/secrets'
import {logger} from './utils/logger'

const {app} = new App()
const botApp = new TelegramBotApp()

const server = http.createServer(app)

const onError = (error: any) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use!`)
      process.exit(1)
      break
    default:
      throw error
  }
}

const onListening = async () => {
  console.info(`⚡️[server]: http://localhost:${PORT} in ${ENVIRONMENT}`)

  try {
    await botApp.start()
    logger.info('Telegram bot started')
  } catch (error) {
    logger.error('Failed to start Telegram bot', {error})
  }
}

const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully...`)
  await botApp.stop()
  server.close(() => {
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', {error})
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', {reason})
})

server.listen(PORT)
server.on('error', onError)
server.on('listening', onListening)
