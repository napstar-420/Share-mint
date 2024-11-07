import 'dotenv/config'
import { google } from 'googleapis'
import { GoogleAuth } from 'google-auth-library'
import path from 'path'
import streamifier from 'streamifier'
import { DriveScopes } from '@/lib/enums'

export const getDriveService = (scopes?: DriveScopes[]) => {
  const KEY_FILE_PATH = path.resolve(process.cwd(), 'service.json')

  const auth = new GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: scopes ?? [DriveScopes.driveReadonly],
  })
  const driveService = google.drive({ version: 'v3', auth })
  return driveService
}

export async function uploadFile(file: File) {
  const driveService = getDriveService([DriveScopes.drive])

  const metadata = {
    parents: [process.env.DRIVE_FOLDER_ID!],
    name: file.name,
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileStream = streamifier.createReadStream(buffer)

  try {
    const response = await driveService.files.create({
      uploadType: 'multipart',
      requestBody: metadata,
      media: {
        mimeType: file.type,
        body: fileStream,
      },
      fields: 'id',
    })

    return response.data
  } catch (error) {
    throw error
  }
}

export async function deleteFile(fileId: string) {
  const driveService = getDriveService([DriveScopes.drive]);
  return driveService.files.delete({ fileId })
}
