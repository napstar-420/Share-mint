export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/db/connection'
import { images } from '@/app/db/images'
import { lt } from 'drizzle-orm'
import { deleteImages } from '@/app/actions'

export async function GET(req: NextRequest) {
  if (
    req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const result = await db
    .select({ sharelink: images.share_link })
    .from(images)
    .where(lt(images.expiration_time, new Date()))

  if (result.length) {
    const sharelinks = result.map(({ sharelink }) => sharelink)
    await deleteImages(sharelinks, process.env.APP_KEY)
  }

  return NextResponse.json({ ok: true })
}
