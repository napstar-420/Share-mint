'use client'

import { Separator } from '@/components/ui/separator'
import { FilesUploadList } from '@/components/files-upload-list'
import { UploadDropZone } from '@/components/upload-dropzone'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '@/app/config'
import { UploadResponse } from '@/lib/type'

export type UploadedFiles = Record<number, UploadResponse>

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadQueue, setUploadQueue] = useState<number[]>([])
  const filesRef = useRef<File[]>([])
  const processedFiles = useRef<number[]>([])
  const activeImages = useRef(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({})

  const onCancelUpload = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    processedFiles.current = processedFiles.current.filter((i) => i !== index)
  }

  const onAddFiles = (newFiles: File[]) => {
    /**
     * Only allow upload to CONFIG.MAX_FILES_PER_BATCH
     * images at a time to prevent lag
     **/
    const filesToAdd = newFiles.slice(
      0,
      CONFIG.MAX_FILES_PER_BATCH - files.length,
    )

    if (filesToAdd.length <= 0) {
      return
    }

    setFiles((prevFiles) => [...prevFiles, ...filesToAdd])
  }

  const processFile = async (fileIndex: number) => {
    setUploadQueue((prev) => [...prev, fileIndex])
    activeImages.current += 1
    processedFiles.current.push(fileIndex)

    const file = filesRef.current[fileIndex]

    try {
      const data = await uploadFile(file)
      setUploadedFiles((prev) => {
        return {
          ...prev,
          [fileIndex]: data,
        }
      })
    } catch (error: unknown) {
      console.error(error)
    } finally {
      setUploadQueue((prev) => prev.filter((i) => i !== fileIndex))
      activeImages.current -= 1

      if (
        activeImages.current < CONFIG.MAX_CONCURRENT_UPLOADS &&
        processedFiles.current.length < filesRef.current.length
      ) {
        const nextFileIndex = processedFiles.current.length

        if (nextFileIndex < filesRef.current.length) {
          processFile(nextFileIndex)
        }
      }
    }
  }

  const uploadFile = async (_: File): Promise<UploadResponse> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ share_link: '12345678' }), 5000),
    )
  }

  useEffect(() => {
    filesRef.current = files

    if (activeImages.current >= CONFIG.MAX_CONCURRENT_UPLOADS) {
      return
    }

    const newQueueItems = files
      .map((_, i) => i)
      .slice(processedFiles.current.length)
      .slice(0, CONFIG.MAX_CONCURRENT_UPLOADS - activeImages.current)

    newQueueItems.map((i) => processFile(i))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files])

  return (
    <div className="py-8">
      <div className="grid lg:grid-cols-[3fr_auto_2fr] xl:grid-cols-[2fr_auto_1fr] gap-2 items-start max-w-lg mx-auto lg:max-w-none lg:mx-0">
        <UploadDropZone addFiles={onAddFiles} />

        <Separator orientation="vertical" className="hidden lg:block" />
        <Separator className="block lg:hidden" />

        <ScrollArea className="h-[400px]">
          <FilesUploadList
            files={files}
            uploadQueue={uploadQueue}
            uploadedFiles={uploadedFiles}
            onCancelUpload={onCancelUpload}
          />
        </ScrollArea>
      </div>
    </div>
  )
}
