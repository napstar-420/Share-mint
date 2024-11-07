import { NextResponse } from 'next/server'
import { getImageByLink, isLinkExists } from '@/app/db/images'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ link: string }> },
) {
  const { link } = await params

  if (!(await isLinkExists(link))) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  }

  const data = await getImageByLink(link)
  return NextResponse.json({ data })
}
