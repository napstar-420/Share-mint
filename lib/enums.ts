export const enum DriveScopes {
  file = 'https://www.googleapis.com/auth/drive.file', // Create new Drive files, or modify existing files
  drive = 'https://www.googleapis.com/auth/drive', // View and manage all your Drive files.
  driveReadonly = 'https://www.googleapis.com/auth/drive.readonly', // View and download all your Drive files.
  metadata = 'https://www.googleapis.com/auth/drive.metadata', // View and manage metadata of files in your Drive.
  metadataReadonly = 'https://www.googleapis.com/auth/drive.metadata.readonly', // View metadata for files in your Drive.
}

export const enum UserRoles {
  USER = 'user',
  ADMIN = 'admin',
}
