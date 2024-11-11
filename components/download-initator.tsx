'use client'
import { useEffect } from 'react'

export function DownloadInitiator({ downloadUrl }: { downloadUrl: string }) {
  useEffect(() => {
    if (downloadUrl) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = ''
      link.click()
    }
  }, [downloadUrl])

  return null
}
