import { UploadSchema } from '@/app/(user-layout)/(upload)/schema'
import { UploadResponse } from '@/types'
import { CONFIG } from '@/app/config'

export function createThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxSize = 200 // Set thumbnail max size
        const scaleSize = Math.min(maxSize / img.width, maxSize / img.height)
        canvas.width = img.width * scaleSize
        canvas.height = img.height * scaleSize

        const ctx = canvas.getContext('2d')

        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob))
            }
          },
          'image/webp',
          0.5,
        )
      }
      img.src = reader.result as string
    }

    reader.readAsDataURL(file)
  })
}

export const uploadFile = async (
  file: File,
  {
    password = '',
    downloadsLeft = 0,
    expirationTime = 0,
  }: {
    password?: string
    downloadsLeft?: number
    expirationTime?: number
  },
  onProgress?: (progress: number) => void,
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    try {
      const parsedData = UploadSchema.parse({
        file,
        password: password.trim(),
        downloadsLeft,
        expirationTime,
      })

      const formData = new FormData()

      formData.append('file', file)
      formData.append('password', parsedData.password || '')
      formData.append('downloadsLeft', parsedData.downloadsLeft.toString())
      formData.append('expirationTime', parsedData.expirationTime.toString())

      const xhr = new XMLHttpRequest()

      xhr.open('POST', `${CONFIG.APP_URL}/${CONFIG.ROUTE.API.UPLOAD}`)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const progress =
            Math.trunc((event.loaded / event.total) * 100 * 10) / 10
          onProgress(progress)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (parseError) {
            reject(new Error('Failed to parse server response'))
          }
        } else {
          reject(new Error(`HTTP error! Status: ${xhr.status}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error('Network error occurred during file upload'))
      }

      xhr.send(formData)
    } catch (error) {
      reject(error)
    }
  })
}
