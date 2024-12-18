export interface UploadResponse {
  sharelink: string
}

export type UploadedFiles = Record<number, UploadResponse>
export type UploadQueue = Record<number, Record<'progress', number>>
export type SearchParams = Record<string, unknown>