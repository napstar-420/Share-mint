export function createThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxSize = 100 // Set thumbnail max size
        const scaleSize = Math.min(maxSize / img.width, maxSize / img.height)
        canvas.width = img.width * scaleSize
        canvas.height = img.height * scaleSize

        const ctx = canvas.getContext('2d')

        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }

        resolve(canvas.toDataURL('image/jpeg')) // Use compressed format
      }
      img.src = reader.result as string
    }

    reader.readAsDataURL(file)
  })
}
