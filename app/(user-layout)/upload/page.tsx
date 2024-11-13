'use client'

import { Separator } from '@/components/ui/separator'
import { FilesUploadList } from '@/components/files-upload-list'
import { UploadDropZone } from '@/components/upload-dropzone'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '@/app/config'
import { UploadResponse } from '@/lib/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ExpirationOptions } from '@/components/expiration-options'
import { DownloadOptions } from '@/components/download-options'
import { UploadSchema } from '@/app/(user-layout)/upload/schema'
import { Button } from '@/components/ui/button'

export type UploadedFiles = Record<number, UploadResponse>

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadQueue, setUploadQueue] = useState<number[]>([])
  const filesRef = useRef<File[]>([])
  const processedFiles = useRef<number[]>([])
  const activeImages = useRef(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({})
  const [errorQueue, setErrorQueue] = useState<number[]>([])
  const [downloadsLeft, setDownloadsLeft] = useState(
    CONFIG.DOWNLOAD_OPTIONS[0].value,
  )
  const [expirationTime, setExpirationTime] = useState(
    CONFIG.EXPIRATION_OPTIONS[0].value,
  )
  const [password, setPassword] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const passwordRef = useRef<HTMLInputElement>(null)

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

    if (isPrivate && !password) {
      toast('Password required', {
        description: 'Please enter a password or disable password protection',
        action: {
          label: 'Type password',
          onClick: () => passwordRef.current?.focus(),
        },
      })
      passwordRef.current?.focus()
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
      setErrorQueue((prev) => [...prev, fileIndex])
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

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    try {
      const parsedData = UploadSchema.parse({
        file,
        password: isPrivate ? password.trim() : '',
        downloadsLeft,
        expirationTime,
      })

      const formData = new FormData()
      formData.append('file', parsedData.file)
      formData.append('password', parsedData.password || '')
      formData.append('downloadsLeft', parsedData.downloadsLeft.toString())
      formData.append('expirationTime', parsedData.expirationTime.toString())

      const response = await fetch(
        `${CONFIG.APP_URL}/${CONFIG.ROUTE.API.UPLOAD}`,
        {
          method: 'POST',
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    } catch (error) {
      throw error
    }
  }

  const reset = () => {
    const prevIsPrivate = isPrivate
    setFiles([])
    setUploadQueue([])
    processedFiles.current = []
    activeImages.current = 0
    setUploadedFiles({})
    setErrorQueue([])
    setIsPrivate(prevIsPrivate)
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

  useEffect(() => {
    if (isPrivate) {
      passwordRef.current?.focus()
    }
  }, [isPrivate])

  return (
    <form className="py-8" onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center mb-4 gap-2 flex-wrap">
        <span>Expire after</span>
        <DownloadOptions
          downloadsLeft={downloadsLeft}
          setDownloadsLeft={setDownloadsLeft}
          disabled={Boolean(files.length)}
        />
        <span>or</span>
        <ExpirationOptions
          expirationTime={expirationTime}
          setExpirationTime={setExpirationTime}
          disabled={Boolean(files.length)}
        />
      </div>

      <div className="flex items-center flex-wrap mb-4 gap-2">
        <Checkbox
          id="private"
          disabled={Boolean(files.length)}
          checked={isPrivate}
          onClick={() => setIsPrivate((prev) => !prev)}
        />
        <Label htmlFor="private">Protect with password</Label>
        <Input
          type="password"
          ref={passwordRef}
          placeholder="Password"
          className="w-full max-w-xs"
          value={password}
          disabled={!isPrivate || Boolean(files.length)}
          onChange={(e) => setPassword(e.target.value)}
          maxLength={CONFIG.PASSWORD_MAX_LENGTH}
          autoComplete="new-password"
        />

        <div className="ml-auto">
          <Button
            type="reset"
            variant="outline"
            onClick={reset}
            disabled={Boolean(uploadQueue.length)}
          >
            Clear all
          </Button>
        </div>
      </div>

      <div className="grid p-2 rounded-2xl border-2 border-dashed lg:grid-cols-[3fr_auto_2fr] xl:grid-cols-[2fr_auto_1fr] gap-2 items-start max-w-lg mx-auto lg:max-w-none lg:mx-0">
        <UploadDropZone addFiles={onAddFiles} />

        <Separator orientation="vertical" className="hidden lg:block" />
        <Separator className="block lg:hidden" />

        <ScrollArea className="h-[400px]">
          <FilesUploadList
            files={files}
            uploadQueue={uploadQueue}
            uploadedFiles={uploadedFiles}
            onCancelUpload={onCancelUpload}
            errorQueue={errorQueue}
          />
        </ScrollArea>
      </div>
    </form>
  )
}
