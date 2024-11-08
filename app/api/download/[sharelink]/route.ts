import { getImageByLink, images } from '@/app/db/images'
import { downloadFile } from '@/app/service'
import { isNil } from '@/lib/utils'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sharelink: string }> },
) {
  const { sharelink } = await params

  if (typeof sharelink !== 'string') {
    return NextResponse.json({ message: 'Invalid link' }, { status: 400 })
  }

  const [image] = await getImageByLink(sharelink, { drive_id: images.drive_id })

  if (isNil(image) || isNil(image.drive_id)) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 })
  }

  const { fileName, mimeType, fileStream } = await downloadFile(image.drive_id!)
  const headers = new Headers()
  headers.set('Content-Type', mimeType)
  headers.set('Content-Disposition', `attachment; filename="${fileName}"`)

  return new Response(fileStream.data as unknown as null, {
    status: 200,
    headers,
  })
}
