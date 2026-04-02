import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

import {logger} from './logger'

const TEMP_DIR = path.join(process.cwd(), 'temp')

export async function ensureTempDir(): Promise<void> {
  try {
    await fs.access(TEMP_DIR)
  } catch {
    await fs.mkdir(TEMP_DIR, {recursive: true})
  }
}

export function getTempFilePath(filename: string): string {
  return path.join(TEMP_DIR, filename)
}

export async function cleanupTempFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
    logger.debug(`Cleaned up temp file: ${filePath}`)
  } catch (error) {
    logger.warn(`Failed to cleanup temp file: ${filePath}`, {error})
  }
}

export interface ProcessedImage {
  path: string
  size: number
  mimeType: string
  base64: string
}

export async function processImage(inputPath: string, maxSizeMB: number = 10): Promise<ProcessedImage> {
  const outputPath = getTempFilePath(`processed-${Date.now()}.jpg`)

  try {
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    let image = sharp(inputPath)
    const metadata = await image.metadata()

    const originalWidth = metadata.width || 1920
    const originalHeight = metadata.height || 1080

    const maxDimension = 1920

    if (originalWidth > maxDimension || originalHeight > maxDimension) {
      image = image.resize(maxDimension, maxDimension, {
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    image = image.jpeg({quality: 85, progressive: true, mozjpeg: true})
    await image.toFile(outputPath)

    let stats = await fs.stat(outputPath)
    let quality = 85

    while (stats.size > maxSizeBytes && quality > 50) {
      quality -= 10
      image = sharp(inputPath)
        .resize(maxDimension, maxDimension, {fit: 'inside', withoutEnlargement: true})
        .jpeg({quality, progressive: true})
      await image.toFile(outputPath)
      stats = await fs.stat(outputPath)
    }

    if (stats.size > maxSizeBytes) {
      throw new Error(`Image too large even after compression. Max size: ${maxSizeMB}MB`)
    }

    const buffer = await fs.readFile(outputPath)
    const base64 = buffer.toString('base64')

    logger.info('Image processed', {
      originalSize: `${((await fs.stat(inputPath)).size / 1024 / 1024).toFixed(2)}MB`,
      processedSize: `${(stats.size / 1024 / 1024).toFixed(2)}MB`,
      quality,
    })

    return {path: outputPath, size: stats.size, mimeType: 'image/jpeg', base64}
  } catch (error) {
    await cleanupTempFile(outputPath)
    throw error
  }
}

export async function fileToBase64(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath)
  return buffer.toString('base64')
}

export async function bufferToBase64(buffer: Buffer): Promise<string> {
  return buffer.toString('base64')
}

export function isValidImageMimeType(mimeType: string): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  return validTypes.includes(mimeType.toLowerCase())
}

export async function saveAnswerImage(buffer: Buffer, submissionId: string): Promise<string> {
  const answersDir = path.join(process.cwd(), 'uploads', 'answers')
  try {
    await fs.access(answersDir)
  } catch {
    await fs.mkdir(answersDir, {recursive: true})
  }

  const fileName = `answer_${submissionId}_${Date.now()}.jpg`
  const filePath = path.join(answersDir, fileName)

  const processed = await sharp(buffer).resize(1920, 1920, {fit: 'inside', withoutEnlargement: true}).jpeg({quality: 85}).toBuffer()
  await fs.writeFile(filePath, processed)

  return `uploads/answers/${fileName}`
}
