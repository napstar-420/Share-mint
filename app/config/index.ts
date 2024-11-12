const APP_URLS = {
  development: 'http://localhost:3000',
  production: 'https://share-mint.vercel.app',
  test: '',
}

export const CONFIG = {
  APP_URL: APP_URLS[process.env.NODE_ENV],
  ROUTE: {
    HOME: '/',
    SIGN_IN: '/sign-in',
    UPLOAD: '/upload',
    DOWNLOAD: '/d',
    ABOUT: '/about',
    CONTACT: '/contact',
    ACCOUNT: '/account',
    API: {
      UPLOAD: '/api/upload',
      DOWNLOAD: '/api/download',
      IMG_PREVIEW: (sharelink: string, params?: string) =>
        `${APP_URLS[process.env.NODE_ENV]}/api/image/preview/${sharelink}${params ? `?p=${params}` : ''}`,
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
  MAX_FILES_PER_BATCH: 100,
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
}
