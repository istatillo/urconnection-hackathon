import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
  dotenv.config({path: '.env'})
} else {
  console.error('.env file not found!')
}

export const ENVIRONMENT = process.env.NODE_ENV as string
const prod = ENVIRONMENT === 'production'

export const MONGO_URI = prod ? (process.env.PRODUCTION_DB_URL as string) : (process.env.DB_URL as string)

if (!MONGO_URI) {
  if (prod) {
    console.error('No mongo connection string. Set PRODUCTION_DB_URL environment variable!')
  } else {
    console.error('No mongo connection string. Set DB_URL environment variable!')
  }
  process.exit(1)
}

export const PORT = parseInt(process.env.PORT as string, 10) || 8080
export const JWT_SECRET = process.env.JWT_SECRET as string
export const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH as string
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string
export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string
export const BOT_USERNAME = process.env.BOT_USERNAME as string
export const MAX_IMAGE_SIZE_MB = parseInt(process.env.MAX_IMAGE_SIZE_MB || '10', 10)
