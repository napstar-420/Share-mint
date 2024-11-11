'use server'

import { signOut } from '@/auth'
import { CONFIG } from '@/app/config'
import { db } from '@/app/db/connection'
import { asc, count, desc, eq, SQL } from 'drizzle-orm'
import { images, ImageSelectFields, NewImage } from '@/app/db/images'
import { users } from '@/app/db/users'

export async function logout() {
  await signOut({ redirectTo: CONFIG.ROUTE.HOME })
}

export async function insertImage(image: NewImage) {
  return await db.insert(images).values(image).returning()
}

export async function getImageByLink(
  link: string,
  projection?: Partial<ImageSelectFields>,
) {
  return db
    .select(projection!)
    .from(images)
    .where(eq(images.share_link, link))
    .limit(1)
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
