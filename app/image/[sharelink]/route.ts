import { images } from '@/app/db/images'
import { isNil } from '@/lib/utils'
import { NextResponse } from 'next/server'
import { getFile } from '@/app/service'
import { getImageByLink } from '@/app/actions'
import { cookies } from 'next/headers'
import jwt, { JwtPayload } from 'jsonwebtoken'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sharelink: string }> },
) {
  const searchParams = new URL(req.url).searchParams
  const { sharelink } = await params
  const cookieStore = await cookies()

  if (typeof sharelink !== 'string') {
    return NextResponse.json({ message: 'Invalid link' }, { status: 400 })
  }

  const [image] = await getImageByLink(sharelink, {
    drive_id: images.drive_id,
    password: images.password,
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

  const file = await getFile(image.drive_id!, { fields: 'thumbnailLink' })
  let thumbnailLink = file.data.thumbnailLink

  if (!thumbnailLink) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 })
  }

  // Remove the params given by gdrive
  thumbnailLink = thumbnailLink.slice(0, -5)
  console.log(thumbnailLink)

  if (searchParams.has('p')) {
    thumbnailLink = `${thumbnailLink}=${searchParams.get('p')}`
  }

  const preview = await fetch(thumbnailLink, {
    method: 'GET',
  })

  return new NextResponse(preview.body, {
    status: preview.status,
  })
}
