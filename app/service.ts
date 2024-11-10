import 'dotenv/config'
import { google, type drive_v3 } from 'googleapis'
import { GoogleAuth } from 'google-auth-library'
import streamifier from 'streamifier'
import { DriveScopes } from '@/lib/enums'
import { MethodOptions } from 'googleapis/build/src/apis/abusiveexperiencereport'

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

/**
 * Retrieve a file by its ID.
 *
 * @param fileId The ID of the file to retrieve.
 * @param params Optional parameters, such as the fields to include in the response.
 * @param options Optional method options, such as the response type.
 * @returns A Promise that resolves with the file metadata.
 * @throws If an error occurs during the request.
 */
export async function getFile(
  fileId: string,
  params?: drive_v3.Params$Resource$Files$Get,
  options?: MethodOptions,
) {
  const service = getDriveService([DriveScopes.driveReadonly])

  try {
    const file = await service.files.get({ fileId, ...params }, options)

    return file
  } catch (error) {
    throw error
  }
}
