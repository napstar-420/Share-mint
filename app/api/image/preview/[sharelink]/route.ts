import { getImageByLink, images } from '@/app/db/images'
import { isNil } from '@/lib/utils'
import { NextResponse } from 'next/server'
import { getFile } from '@/app/service'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sharelink: string }> },
) {
  const searchParams = new URL(req.url).searchParams
  const { sharelink } = await params

  if (typeof sharelink !== 'string') {
    return NextResponse.json({ message: 'Invalid link' }, { status: 400 })
  }

  const [image] = await getImageByLink(sharelink, { drive_id: images.drive_id })

  if (isNil(image) || isNil(image.drive_id)) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 })
  }

  const file = await getFile(image.drive_id!, { fields: 'thumbnailLink' })
  let thumbnailLink = file.data.thumbnailLink

  if (!thumbnailLink) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 })
  }

  if (searchParams.has('p')) {
    thumbnailLink = thumbnailLink
      .slice(0, -4)
      .concat(searchParams.get('p') as string)
  }

  const response = await fetch(thumbnailLink)
  const blob = await response.blob()

  return new NextResponse(blob)
}
