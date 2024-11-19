'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LuDownload } from 'react-icons/lu'
import { useState } from 'react'
import { toast } from 'sonner'
import { CONFIG } from '@/app/config'

interface ComponentProps {
  downloadUrl: string
  file_name: string
}

export function DownloadInitiator({ downloadUrl, file_name }: ComponentProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const initDownload = async () => {
    try {
      setLoading(true)
      const response = await fetch(downloadUrl)
      if (!response.ok) {
        throw new Error('Error downloading')
      }

      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
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
      Download <LuDownload />
    </Button>
  )
}
