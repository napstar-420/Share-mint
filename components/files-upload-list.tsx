import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { MdCancel, MdDownload, MdDoneAll, MdError } from 'react-icons/md'
import { FaImages, FaEye } from 'react-icons/fa'
import {
  bytesToMegaBytes,
  readableFileType,
  copyToClipboard,
  createShareLink,
  isNil,
  cn,
  createPreviewLink,
} from '@/lib/utils'
import { createThumbnail } from '@/lib/images'
import type { UploadedFiles, UploadQueue } from '@/types'
import { Button } from '@/components/ui/button'
import { ImageThumbnail } from '@/components/image-thumbnail'
import { Progress } from '@/components/ui/progress'

interface ComponentProps {
  files: File[]
  uploadQueue: UploadQueue
  errorQueue: number[]
  uploadedFiles: UploadedFiles
  onRemove: (i: number) => void
  disabled?: boolean
}

export function FilesUploadList({
  files,
  uploadQueue,
  uploadedFiles,
  errorQueue,
  onRemove,
  disabled,
}: ComponentProps) {
  const [previews, setPreviews] = useState<Record<number, string>>({})

  const copyDownloadLink = async (identifier: string) => {
    const sharelink = createShareLink(identifier)
    await copyToClipboard(sharelink)
    toast('Download link copied to clipboard!')
  }

  const copyPreviewLink = async (identifier: string) => {
    const previewLink = createPreviewLink(identifier)
    await copyToClipboard(previewLink)
    toast('Preview link copied to clipboard!')
  }

  useEffect(() => {
    const createPreviews = async () => {
      const newPreviews: Record<number, string> = {}

      for (let i = 0; i < files.length; i++) {
        const preview = await createThumbnail(files[i])
        newPreviews[i] = preview
        setPreviews((prev) => ({ ...prev, [i]: preview }))
      }
    }

    createPreviews()
  }, [files])

  return (
    <div className="flex flex-col gap-4 h-full">
      {files.length ? (
        files.map((file, index) => (
          <div
            key={index}
            className={`border-2 bg-primary-foreground p-2 rounded-xl`}
          >
            <div className="w-full grid grid-cols-[auto_1fr] xs:grid-cols-[auto_1fr_auto] gap-4 items-center">
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
              {!isNil(uploadedFiles[index]) ? (
                <div className="row-start-2 row-end-3 xs:row-start-1 xs:row-end-2 col-start-1 col-end-3 xs:col-start-3 xs:col-end-4 flex gap-2 flex-wrap">
                  <CopyButton
                    onClick={() =>
                      copyPreviewLink(uploadedFiles[index].sharelink)
                    }
                    label="Preview link"
                    icon={<FaEye />}
                    variant="outline"
                    className="flex-1"
                  />
                  <CopyButton
                    onClick={() =>
                      copyDownloadLink(uploadedFiles[index].sharelink)
                    }
                    label="Download link"
                    icon={<MdDownload />}
                    variant="outline"
                    className="flex-1"
                  />
                </div>
              ) : !isNil(uploadQueue[index]) ? (
                uploadQueue[index].progress === 100 ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <small className="text-sm font-medium leading-none mr-2">
                    {uploadQueue[index].progress} %
                  </small>
                )
              ) : errorQueue.includes(index) ? (
                <MdError className="text-destructive text-3xl" />
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => onRemove(index)}
                  disabled={disabled}
                >
                  <MdCancel />
                </Button>
              )}
            </div>
            {!isNil(uploadQueue[index]) &&
              uploadQueue[index].progress !== 100 && (
                <Progress
                  value={uploadQueue[index].progress}
                  className="mt-2"
                />
              )}
            {errorQueue.includes(index) && (
              <p className="text-sm text-destructive mt-2">
                Failed to upload image
              </p>
            )}
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-6 flex-auto h-full">
          <FaImages className="text-8xl text-secondary-foreground" />
          <p className="text-lg font-semibold text-muted-foreground text-center">
            Uploaded images will appear here
          </p>
        </div>
      )}
    </div>
  )
}

function CopyButton({
  onClick,
  label,
  icon,
  variant,
  className,
}: {
  onClick: () => Promise<void> | void
  label: string
  icon: React.ReactNode
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
  className?: string
}) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [timeoutId, setTimeoutId] = useState<number | null>(null)

  const handleClick = async () => {
    await onClick()

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    setTimeoutId(
      setTimeout(() => {
        setTimeoutId(null)
      }, 2000) as unknown as number,
    )
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Button
      variant={variant}
      size={windowWidth > 576 ? 'icon' : 'sm'}
      className={cn(
        `${windowWidth > 576 ? 'rounded-full' : ''} ${timeoutId ? 'opacity-50 pointer-events-none text-brand-primary' : ''}`,
        className,
      )}
      onClick={handleClick}
    >
      {windowWidth < 576 ? (timeoutId ? 'Copied' : label) : ''}{' '}
      {timeoutId ? <MdDoneAll /> : icon}
    </Button>
  )
}
