import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MdCancel } from 'react-icons/md'
import { FaImages } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { bytesToMegaBytes, readableFileType } from '@/lib/utils'

interface ComponentProps {
  files: File[]
  uploadQueue: number[]
  onCancelUpload: (i: number) => void
}

export function FilesUploadList({
  files,
  uploadQueue,
  onCancelUpload,
}: ComponentProps) {
  const [previews, setPreviews] = useState<Record<number, string>>({})

  const isFileUploading = (index: number) => {
    return uploadQueue.findIndex((i) => i === index) > -1 ? true : false
  }

  useEffect(() => {
    const newPreviews: Record<number, string> = {}
    files.forEach((file, index) => {
      newPreviews[index] = URL.createObjectURL(file)
      setPreviews(newPreviews)
    })
    setPreviews(newPreviews)

    return () => {
      Object.values(newPreviews).forEach((url) => URL.revokeObjectURL(url))
    }
  }, [files])

  return (
    <div className="flex flex-col gap-4">
      {files.length ? (
        files.map((file, index) => (
          <div
            key={index}
            className={`border-2 border-primary-foreground p-2 rounded-xl ${isFileUploading(index) ? 'bg-brand-primary' : ''}`}
          >
            <div className="w-full grid grid-cols-[auto_1fr_auto] gap-4 items-center mb-2">
              <div
                className={`aspect-square w-10 bg-primary-foreground rounded-md bg-cover bg-center`}
                style={{ backgroundImage: `url(${previews[index]})` }}
              ></div>
              <div>
                <div className="leading-7 [&:not(:first-child)]:mt-6">
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
                  •
                  <span className="text-sm text-muted-foreground">
                    10 secs left
                  </span>
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => onCancelUpload(index)}
              >
                <MdCancel />
              </Button>
            </div>
            <Progress value={0} />
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
