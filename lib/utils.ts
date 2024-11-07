import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { nanoid } from 'nanoid';
import { CONFIG } from '@/app/config';

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
  return nanoid(CONFIG.UNIQUE_IDENTIFIER_LENGTH);
}
