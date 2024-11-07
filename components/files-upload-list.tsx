import { Button } from '@/components/ui/button'
import { MdCancel, MdContentCopy, MdDoneAll } from 'react-icons/md'
import { FaImages } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import {
  bytesToMegaBytes,
  readableFileType,
  copyToClipboard,
  createShareLink,
} from '@/lib/utils'
import { createThumbnail } from '@/lib/images'
import { Loader2 } from 'lucide-react'
import { UploadedFiles } from '@/app/upload/page'
import _ from 'lodash'
import { toast } from 'sonner'
import { ImageThumbnail } from '@/components/image-thumbnail'

interface ComponentProps {
  files: File[]
  uploadQueue: number[]
  uploadedFiles: UploadedFiles
  onCancelUpload: (i: number) => void
}

export function FilesUploadList({
  files,
  uploadQueue,
  uploadedFiles,
  onCancelUpload,
}: ComponentProps) {
  const [previews, setPreviews] = useState<Record<number, string>>({})
  const [copiedTimeouts, setCopiedTimeouts] = useState<number[]>([])

  const isFileUploading = (index: number) => {
    return uploadQueue.findIndex((i) => i === index) > -1 ? true : false
  }

  const handleCopyToClipboard = async (index: number, identifier: string) => {
    const sharelink = createShareLink(identifier)
    await copyToClipboard(sharelink)

    if (!copiedTimeouts.includes(index)) {
      setCopiedTimeouts((prev) => [...prev, index])

      setTimeout(() => {
        setCopiedTimeouts((prev) => prev.filter((i) => i !== index))
      }, 2000)
    }

    toast('Link copied to clipboard!')
  }

  useEffect(() => {
    const newPreviews: Record<number, string> = {}

    files.forEach(async (file, index) => {
      newPreviews[index] = await createThumbnail(file)
    })

    setPreviews(newPreviews)
  }, [files])

  return (
    <div className="flex flex-col gap-4">
      {files.length ? (
        files.map((file, index) => (
          <div
            key={index}
            className={`border-2 border-primary-foreground p-2 rounded-xl`}
          >
            <div className="w-full grid grid-cols-[auto_1fr_auto] gap-4 items-center">
              {/* Lazy load and memoize thumbnail image */}
              <ImageThumbnail src={previews[index]} />
              <div className="flex flex-col flex-nowrap min-w-0">
                <div className="leading-7 [&:not(:first-child)]:mt-6 truncate">
                  {file.name}
                </div>
                <p className="flex gap-2 items-center flex-wrap">
                  <span className="text-sm text-muted-foreground">
                    {readableFileType(file.type)}
                  </span>{' '}
                  •
                  <span className="text-sm text-muted-foreground">
                    {bytesToMegaBytes(file.size, true)}
                  </span>{' '}
                </p>
              </div>
              {!_.isUndefined(uploadedFiles[index]) ? (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full text-brand-primary hover:text-brand-primary"
                  onClick={() =>
                    handleCopyToClipboard(
                      index,
                      uploadedFiles[index].share_link,
                    )
                  }
                >
                  {copiedTimeouts.includes(index) ? (
                    <MdDoneAll />
                  ) : (
                    <MdContentCopy />
                  )}
                </Button>
              ) : isFileUploading(index) ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => onCancelUpload(index)}
                >
                  <MdCancel />
                </Button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-6">
          <FaImages className="text-8xl text-primary-foreground" />
          <p className="text-lg font-semibold text-muted-foreground text-center">
            Uploaded images will appear here
          </p>
        </div>
      )}
    </div>
  )
}
