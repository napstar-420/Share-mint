import {
  deleteImages,
  getImageByLink,
  getSession,
  updateDownloadsLeft,
} from '@/app/actions'
import { images } from '@/app/db/images'
import { getFile } from '@/app/service'
import { isNil } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt, { JwtPayload } from 'jsonwebtoken'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ sharelink: string }> },
) {
  const session = await getSession();
  const { sharelink } = await params
  const cookieStore = await cookies()

  if (typeof sharelink !== 'string') {
    return NextResponse.json({ message: 'Invalid link' }, { status: 400 })
  }

  try {
    const [image] = await getImageByLink(sharelink, {
      drive_id: images.drive_id,
      file_name: images.file_name,
      file_type: images.file_type,
      password: images.password,
      downloads_left: images.downloads_left,
      expiration_time: images.expiration_time,
      uploader_id: images.uploader_id,
    })

    if (isNil(image) || isNil(image.drive_id)) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 })
    }

    const isPrivate = image.password

    if (isPrivate) {
      const token = cookieStore.get('token')

      if (!token?.value) {
        return NextResponse.json(
          { message: 'Token is required' },
          { status: 401 },
        )
      }

      const decoded = jwt.verify(
        token.value,
        process.env.JWT_SECRET!,
      ) as JwtPayload

      if (decoded.sharelink !== sharelink) {
        return NextResponse.json({ message: 'Invalid Token' }, { status: 403 })
      }
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
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    headers.set('Content-Length', fileStream.headers['content-length']!)

    let newDownloadsLeft: number | null

    if (image.downloads_left !== null && image.uploader_id !== session?.user?.id) {
      newDownloadsLeft = image.downloads_left! - 1
      await updateDownloadsLeft(sharelink, newDownloadsLeft)

      if (newDownloadsLeft === 0) {
        await deleteImages([sharelink], process.env.APP_KEY!)
      }
    }

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
