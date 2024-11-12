import { getImageByLink } from '@/app/actions'
import { images } from '@/app/db/images'
import { getFile } from '@/app/service'
import { isNil } from '@/lib/utils'
import { NextResponse } from 'next/server'

// TODO: Move into actions
export async function GET(
  req: Request,
  { params }: { params: Promise<{ sharelink: string }> },
) {
  const { sharelink } = await params

  if (typeof sharelink !== 'string') {
    return NextResponse.json({ message: 'Invalid link' }, { status: 400 })
  }

  try {
    const [image] = await getImageByLink(sharelink, {
      drive_id: images.drive_id,
      file_name: images.file_name,
      file_type: images.file_type,
    })

    if (isNil(image) || isNil(image.drive_id)) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 })
    }

    const fileStream = await getFile(
      image.drive_id!,
      { alt: 'media' },
      { responseType: 'stream' },
    )
    const headers = new Headers()
    headers.set('Content-Type', image.file_type!)
    headers.set(
      'Content-Disposition',
      `attachment; filename="${image.file_name}"`,
    )

    return new Response(fileStream.data as unknown as null, {
      status: 200,
      headers,
    })
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    )
  }
}
