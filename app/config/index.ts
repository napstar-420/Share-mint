import { getParamsString } from '@/lib/utils'
import { SearchParams } from '@/types'

export const CONFIG = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL! || 'http://localhost:3000',
  ROUTE: {
    HOME: '/',
    SIGN_IN: '/sign-in',
    UPLOAD: '/upload',
    DOWNLOAD: '/d',
    ABOUT: '/about',
    CONTACT: '/contact',
    ACCOUNT: '/account',
    THANKS: '/thanks',
    IMG_PREVIEW: (sharelink: string, params?: SearchParams) =>
      `/image/${sharelink}${params ? `?${getParamsString(params)}` : ''}`,
    API: {
      UPLOAD: '/api/upload',
      DOWNLOAD: '/api/download',
    },
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      IMAGES: '/admin/images',
      USERS: '/admin/users',
    },
  },

  FILE_TYPES: {
    ACCEPTED: [
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/png',
      'image/gif',
      'image/heic',
      'image/ico',
      'image/bmp',
    ],
  },

  MAX_FILE_SIZE: 50 * 1024 * 1024, // in bytes
  MAX_FILES_PER_UPLOAD: 100,
  MAX_CONCURRENT_UPLOADS: 10,

  DRIVE: {
    FILE_UPLOAD: {
      MULTIPART_ENDPOINT:
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    },
  },

  UNIQUE_IDENTIFIER_LENGTH: 8,

  ADMIN_DASHBOARD: {
    MAX_USERS_PER_PAGE: 25,
    MAX_IMAGES_PER_PAGE: 25,
  },

  EXPIRATION_OPTIONS: [
    {
      value: 60 * 5,
      label: '5 minutes',
    },
    {
      value: 60 * 60,
      label: '1 hour',
    },
    {
      value: 60 * 60 * 24,
      label: '1 day',
    },
    {
      value: 60 * 60 * 24 * 3,
      label: '3 days',
    },
    {
      value: 60 * 60 * 24 * 7,
      label: '1 week',
    },
  ],

  DOWNLOAD_OPTIONS: [
    {
      value: 1,
      label: '1 download',
    },
    {
      value: 2,
      label: '2 downloads',
    },
    {
      value: 3,
      label: '3 downloads',
    },
    {
      value: 4,
      label: '4 downloads',
    },
    {
      value: 5,
      label: '5 downloads',
    },
  ],

  PASSWORD_MAX_LENGTH: 64,
}
