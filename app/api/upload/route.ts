import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { uploadFile, deleteFile } from '@/app/service'
import sizeOf from 'image-size'
import { NewImage } from '@/app/db/images'
import { CONFIG } from '@/app/config'
import { generateUniqueIdentifier, first, isNil } from '@/lib/utils'
import { insertImage, isLinkExists } from '@/app/actions'
import { UploadSchema } from '@/app/(user-layout)/upload/schema'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const header = await headers()
  const ip = (header.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]
  const session = await auth()
  const formData = await req.formData()

  let parsedData

  try {
    parsedData = UploadSchema.parse({
      file: formData.get('file'),
      password: formData.get('password'),
      downloadsLeft: Number(formData.get('downloadsLeft')),
      expirationTime: Number(formData.get('expirationTime')),
    })
  } catch (error: unknown) {
    return NextResponse.json({ error }, { status: 400 })
  }

  const { file, password, downloadsLeft, expirationTime } = parsedData
  const hashedPassword = password ? bcrypt.hashSync(password, 10) : null

  if (!CONFIG.FILE_TYPES.ACCEPTED.includes(file.type)) {
    NextResponse.json(
      { error: `Accepted file types are ${CONFIG.FILE_TYPES.ACCEPTED.join()}` },
      { status: 400 },
    )
  }

  if (file.size > CONFIG.MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File size limit is ${CONFIG.MAX_FILE_SIZE}` },
      { status: 400 },
    )
  }

  if ((downloadsLeft === 0 || expirationTime === 0) && isNil(session?.user)) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  let driveId: string = ''

  try {
    const driveRes = await uploadFile(file)
    if (driveRes.id) {
      driveId = driveRes.id
    }
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to upload' }, { status: 500 })
  }

  let shareLink = generateUniqueIdentifier()
  let linkExists = await isLinkExists(shareLink)

  while (linkExists) {
    shareLink = generateUniqueIdentifier()
    linkExists = await isLinkExists(shareLink)
  }

  try {
    const currentTime = new Date()
    const metadata = sizeOf(buffer)
    const newImage: NewImage = {
      drive_id: driveId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type as 'image/jpeg',
      metadata: metadata,
      uploader_ip: ip,
      uploader_id: session?.user?.id ?? null,
      share_link: shareLink,
      downloads_left: downloadsLeft || null,
      password: hashedPassword,
      expiration_time: expirationTime
        ? new Date(currentTime.getTime() + expirationTime * 1000)
        : null,
    }

    const data = await insertImage(newImage)
    return NextResponse.json({ sharelink: first(data)?.share_link })
  } catch (error: unknown) {
    console.error(error)

    // Delete the drive file, if we app fails to save it in DB
    await deleteFile(driveId)
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 })
  }
}
