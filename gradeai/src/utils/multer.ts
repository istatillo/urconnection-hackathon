import {ReasonPhrases, StatusCodes} from 'http-status-codes'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

import {HttpException} from './http.exception'

const uploadsDir = path.join(process.cwd(), 'uploads')
const tasksDir = path.join(uploadsDir, 'tasks')
const answersDir = path.join(uploadsDir, 'answers')

for (const dir of [uploadsDir, tasksDir, answersDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true})
  }
}

const taskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, tasksDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `task_${Date.now()}${ext}`)
  },
})

const checkFileType = (file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const filetypes = /jpeg|png|jpg|webp/
  const extname = filetypes.test(path.extname(file.originalname)?.toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    cb(null, true)
  } else {
    cb(
      new HttpException(
        StatusCodes.UNPROCESSABLE_ENTITY,
        ReasonPhrases.UNPROCESSABLE_ENTITY,
        'Faqat rasm fayllarini yuklash mumkin! (JPG, PNG, WebP)',
      ),
    )
  }
}

export const uploadTaskImage = multer({
  storage: taskStorage,
  limits: {fileSize: 10 * 1024 * 1024},
  fileFilter: (_req, file, cb) => {
    checkFileType(file, cb)
  },
})

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: {fileSize: 10 * 1024 * 1024},
  fileFilter: (_req, file, cb) => {
    checkFileType(file, cb)
  },
})
