'use server'

import { auth, signOut } from '@/auth'
import { CONFIG } from '@/app/config'
import { db } from '@/app/db/connection'
import { asc, count, desc, eq, inArray, SQL } from 'drizzle-orm'
import { images, ImageSelectFields, NewImage } from '@/app/db/images'
import { users } from '@/app/db/users'
import { deleteFile } from '@/app/service'
import { UserRoles } from '@/lib/enums'

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

/**
 * Delete images from the database and Google Drive.
 *
 * @param {string[]} share_links - The share links of the images to delete.
 * @returns {Promise<void>} - The promise of the operation.
 */
export async function deleteImages(share_links: string[]): Promise<void> {
  const session = await auth()

  if (session?.user?.role !== UserRoles.ADMIN) {
    throw new Error('Unauthorized')
  }

  const data = (await getImages({
    projection: {
      drive_id: images.drive_id,
    },
    where: inArray(images.share_link, share_links),
  })) as { drive_id: string }[]

  const drivePromises = data.map(({ drive_id }) => deleteFile(drive_id))
  await Promise.all(drivePromises)
  await db.delete(images).where(inArray(images.share_link, share_links))
}
