export const CONFIG = {
  ROUTE: {
    HOME: '/',
    LOGIN: '/login',
    UPLOAD: '/upload',
    DOWNLOAD: '/download',
    ABOUT: '/about',
    CONTACT: '/contact',
    ACCOUNT: '/account',
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
      MULTIPART_ENDPOINT: "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"
    }
  }
}
