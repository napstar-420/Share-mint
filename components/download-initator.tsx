'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LuDownload } from 'react-icons/lu'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { CONFIG } from '@/app/config'

interface ComponentProps {
  downloadUrl: string
  file_name: string
}

export function DownloadInitiator({ downloadUrl, file_name }: ComponentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const initDownload = async () => {
    try {
      setLoading(true)
      const response = await fetch(downloadUrl)
      if (!response.ok) {
        throw new Error('Error downloading')
      }

      const contentLength = response.headers.get('content-length')

      let blob: Blob

      if (!contentLength) {
        blob = await response.blob()
      } else {
        const total = parseInt(contentLength, 10)
        const values = []
        let loaded = 0
        const reader = response.body!.getReader()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          values.push(value)
          loaded += value.byteLength
          setProgress(Math.round((loaded / total) * 100))
          blob = new Blob(values)
        }
      }

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob!)
      link.download = file_name
      link.click()

      // Clean up the Blob URL
      URL.revokeObjectURL(link.href)

      router.replace(CONFIG.ROUTE.THANKS)
    } catch {
      toast('Error downloading file', {
        description: 'Please try again later.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="lg"
      className="w-full mt-8 tracking-wide font-semibold bg-brand-primary"
      onClick={initDownload}
      aria-label="Download image"
      disabled={loading}
    >
      {loading ? (
        progress ? (
          `Downloading (${progress}%)`
        ) : (
          'Please wait...'
        )
      ) : (
        <>
          Download <LuDownload />
        </>
      )}
    </Button>
  )
}
