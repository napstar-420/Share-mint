import 'dotenv/config'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { nanoid } from 'nanoid'
import { CONFIG } from '@/app/config'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function bytesToMegaBytes(bytes: number, withUnit: boolean = false) {
  const mb = (bytes / 1024 / 1024).toFixed(2)
  return withUnit ? `${mb} mb` : mb
}

export function readableFileType(type: string) {
  const i = type.indexOf('/')
  return type.slice(i + 1)
}

export function randomId(length = 6) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2)
}

export function generateUniqueIdentifier() {
  return nanoid(CONFIG.UNIQUE_IDENTIFIER_LENGTH)
}

export function createShareLink(identifier: string) {
  return `${CONFIG.APP_URL}${CONFIG.ROUTE.DOWNLOAD}/${identifier}`
}

export function createPreviewLink(identifier: string, params?: string) {
  return `${CONFIG.APP_URL}${CONFIG.ROUTE.API.IMG_PREVIEW(identifier, params)}`
}

export function createDownloadLink(identifier: string) {
  return `${CONFIG.APP_URL}${CONFIG.ROUTE.API.DOWNLOAD}/${identifier}`
}

export async function copyToClipboard(data: string) {
  return navigator.clipboard.writeText(data)
}

export function first<T>(array: T[]) {
  return array.length ? array[0] : undefined
}

export function isNil<T>(value: T) {
  return value === undefined || value === null
}
