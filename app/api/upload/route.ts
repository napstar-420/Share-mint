import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { uploadFile, deleteFile } from '@/app/service'
import sharp from 'sharp'
import { NewImage, insertImage, isLinkExists } from '@/app/db/images'
import { CONFIG } from '@/app/config'
import { generateUniqueIdentifier, first } from '@/lib/utils'

export async function POST(req: Request) {
  const header = await headers()
  const ip = (header.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]
  const session = await auth()
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 400 })
  }

  if (!CONFIG.FILE_TYPES.ACCEPTED.includes(file.type)) {
    NextResponse.json(
      { error: `Accepted file types are ${CONFIG.FILE_TYPES.ACCEPTED.join()}` },
      { status: 400 },
    )
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
    const metadata = await sharp(buffer).metadata()
    const newImage: NewImage = {
      drive_id: driveId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type as 'image/jpeg',
      metadata: metadata,
      uploader_ip: ip,
      uploader_id: session?.user?.id ?? null,
      share_link: shareLink,
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
