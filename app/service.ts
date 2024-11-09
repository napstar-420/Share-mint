import 'dotenv/config'
import { google } from 'googleapis'
import { GoogleAuth } from 'google-auth-library'
import streamifier from 'streamifier'
import { DriveScopes } from '@/lib/enums'

export const getDriveService = (scopes?: DriveScopes[]) => {
  const credentials = {
    type: process.env.GOOGLE_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
  }

  const auth = new GoogleAuth({
    credentials,
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
  const driveService = getDriveService([DriveScopes.drive])
  return driveService.files.delete({ fileId })
}

export async function downloadFile(fileId: string) {
  const service = getDriveService([DriveScopes.drive])

  try {
    const fileMetadata = await service.files.get({
      fileId,
      fields: 'name, mimeType',
    })
    const fileName = fileMetadata.data.name
    const mimeType = fileMetadata.data.mimeType || 'application/octet-stream'
    const fileStream = await service.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' },
    )
    return { fileName, mimeType, fileStream }
  } catch (error: unknown) {
    throw error
  }
}
