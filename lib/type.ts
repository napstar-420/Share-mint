export const enum UploadStatus {
  UPLOADING = 1,
  ERROR = 0,
}

export interface ImageFile extends File {
  id: string
  uploadStatus: UploadStatus
  shareable_link?: string
}
