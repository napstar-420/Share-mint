'use server'

import { auth, signOut } from '@/auth'
import { CONFIG } from '@/app/config'
import { db } from '@/app/db/connection'
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  inArray,
  isNull,
  or,
  sql,
  SQL,
  SQLWrapper,
} from 'drizzle-orm'
import { images, ImageSelectFields, NewImage } from '@/app/db/images'
import { users } from '@/app/db/users'
import { deleteFile } from '@/app/service'
import { UserRoles } from '@/enums'
import bcrypt from 'bcryptjs'
import { isNil } from '@/lib/utils'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { cookies } from 'next/headers'

export async function logout() {
  await signOut({ redirectTo: CONFIG.ROUTE.HOME })
}

export async function getSession() {
  return await auth()
}

export async function insertImage(image: NewImage) {
  return await db.insert(images).values(image).returning()
}

export async function getImageByLink(
  link: string,
  projection?: Partial<ImageSelectFields>,
  notExpired = true,
) {
  const baseQuery = db.select(projection!).from(images)
  const conditions: unknown[] = [eq(images.share_link, link)]
  if (notExpired) {
    conditions.push(
      or(
        gt(images.expiration_time, new Date()),
        isNull(images.expiration_time),
      ),
      or(gt(images.downloads_left, 0), isNull(images.downloads_left)),
    )
  }

  const query = baseQuery.where(and(...(conditions as SQLWrapper[]))).limit(1)
  return await query
}

export async function isLinkExists(link: string) {
  const result = await getImageByLink(link, { id: images.id })
  return Boolean(result.length)
}

export async function deleteImage(id: number) {
  return await db.delete(images).where(eq(images.id, id))
}

interface GetImagesOptions {
  projection?: Partial<ImageSelectFields>
  limit?: number
  page?: number
  orderBy?: {
    column: keyof ImageSelectFields
    order: typeof desc | typeof asc
  }
  where?: SQL<unknown>
  joinUsers?: boolean
}

export async function getImages({
  projection,
  where,
  limit,
  page,
  orderBy,
  joinUsers = false,
}: GetImagesOptions = {}) {
  let offset = 0

  if (page && limit) {
    offset = (page - 1) * limit
  }

  const query = db.select(projection!).from(images)

  if (where) {
    query.where(where)
  }

  if (orderBy) {
    query.orderBy(orderBy.order(images[orderBy.column]))
  } else {
    query.orderBy(desc(images.upload_date))
  }

  if (offset) {
    query.offset(offset)
  }

  if (limit) {
    query.limit(limit)
  }

  if (joinUsers) {
    query.leftJoin(users, eq(images.uploader_id, users.id))
  }

  return query
}

export async function getImagesCount() {
  return await db.select({ count: count() }).from(images).limit(1).offset(0)
}

export async function getUser(id: string) {
  return await db.select().from(users).where(eq(users.id, id)).limit(1)
}

/**
 * Delete images from the database and Google Drive.
 *
 * @param {string[]} share_links - The share links of the images to delete.
 * @returns {Promise<void>} - The promise of the operation.
 */
export async function deleteImages(
  share_links: string[],
  APP_KEY?: string,
): Promise<void> {
  const session = await auth()

  if (
    session?.user?.role === UserRoles.ADMIN ||
    APP_KEY === process.env.APP_KEY
  ) {
    const data = (await getImages({
      projection: {
        drive_id: images.drive_id,
      },
      where: inArray(images.share_link, share_links),
    })) as { drive_id: string }[]

    const drivePromises = data.map(({ drive_id }) => deleteFile(drive_id))
    await Promise.all(drivePromises)
    await db.delete(images).where(inArray(images.share_link, share_links))
    return
  } else {
    throw new Error('Unauthorized')
  }
}

const PasswordSchema = z.object({
  password: z.string(),
  sharelink: z.string(),
})

export async function verifyPassword(prevState: unknown, formData: FormData) {
  const password = formData.get('password') as string
  const sharelink = formData.get('sharelink') as string
  const parsedData = PasswordSchema.safeParse({
    password,
    sharelink,
  })

  if (!parsedData.success) {
    return 'Please enter password'
  }

  const [image] = await getImageByLink(sharelink, {
    password: images.password,
  })

  if (isNil(image)) {
    return 'Could not find the requested image'
  }

  if (isNil(image.password)) {
    return 'requested image has no password'
  }

  const isPasswordCorrect = bcrypt.compareSync(password, image.password!)

  if (!isPasswordCorrect) {
    return 'The password you entered is incorrect'
  }

  const cookieStore = await cookies()

  const token = jwt.sign({ sharelink }, process.env.JWT_SECRET!, {
    expiresIn: '15m',
  })

  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
  })

  return ''
}

export async function updateDownloadsLeft(
  sharelink: string,
  newValue: number | null,
) {
  return await db
    .update(images)
    .set({ downloads_left: newValue })
    .where(eq(images.share_link, sharelink))
}

export async function getSessionUserImages() {
  const session = await getSession()

  if (!session) {
    return []
  }

  return await db
    .select({
      file_name: images.file_name,
      file_type: images.file_type,
      file_size: images.file_size,
      upload_date: images.upload_date,
      downloads_left: images.downloads_left,
      expiration_time: images.expiration_time,
      share_link: images.share_link,
      has_password:
        sql<boolean>`CASE WHEN ${images.password} IS NOT NULL THEN true ELSE false END`.as(
          'has_password',
        ),
    })
    .from(images)
    .where(eq(images.uploader_id, session.user.id))
}
