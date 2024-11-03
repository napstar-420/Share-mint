import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function bytesToMegaBytes(bytes: number, withUnit: boolean) {
  const mb = (bytes / 1024 / 1024).toFixed(2)
  return withUnit ? `${mb} mb` : mb
}

export function readableFileType(type: string) {
  const i = type.indexOf('/')
  return type.slice(i + 1)
}
