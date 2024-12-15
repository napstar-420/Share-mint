'use client'

import { CONFIG } from '@/app/config'
import { useState, DragEvent, ChangeEvent, useEffect, useRef } from 'react'
import { EmptyDropZone } from './empty-dropzone'
import { toast } from 'sonner'
import { ScrollArea } from './ui/scroll-area'
import { FilesUploadList } from './files-upload-list'
import type { UploadedFiles, UploadQueue } from '@/types'
import { Button } from './ui/button'
import { BrowseFilesBtn } from './browse-files-btn'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { DownloadOptions } from './download-options'
import { ExpirationOptions } from './expiration-options'
import { uploadFile } from '@/lib/images'
import { bytesToMegaBytes } from '@/lib/utils'

export function UploadDropZone() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [password, setPassword] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [uploadQueue, setUploadQueue] = useState<UploadQueue>({})
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({})
  const [errorQueue, setErrorQueue] = useState<number[]>([])
  const [downloadsLeft, setDownloadsLeft] = useState(
    CONFIG.DOWNLOAD_OPTIONS[0].value,
  )
  const [expirationTime, setExpirationTime] = useState(
    CONFIG.EXPIRATION_OPTIONS[2].value,
  )
  const [disabled, setDisabled] = useState(false)
  const dropzone = useRef<HTMLDivElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const processedFiles = useRef<number[]>([])

  // Used to track the number of images currently being uploaded
  const activeImagesInProgress = useRef(0)

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    processedFiles.current = processedFiles.current.filter((i) => i !== index)
  }

  const handleOnDrag = (e: DragEvent) => {
    e.preventDefault()
    const target = e.target as Element
    setIsDragging(
      Boolean(target.id === 'dropzone' || dropzone.current?.contains(target)),
    )
  }

  const handleOnDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleOnBrowse = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    if (files.length > 0) {
      const newFiles = Array.from(files).filter(
        (file) =>
          CONFIG.FILE_TYPES.ACCEPTED.includes(file.type) &&
          file.size <= CONFIG.MAX_FILE_SIZE,
      )

      addFiles(newFiles)
    }
  }

  const addFiles = (newFiles: File[]) => {
    /**
     * Only allow upload to CONFIG.MAX_FILES_PER_UPLOAD
     * images at a time to prevent lag
     **/
    const filesToAdd = newFiles.slice(
      0,
      CONFIG.MAX_FILES_PER_UPLOAD - files.length,
    )

    if (filesToAdd.length <= 0) {
      toast('Cannot upload more files', {
        description: `You can upload a maximum of ${CONFIG.MAX_FILES_PER_UPLOAD} images at a time.
          Please reload the page to upload more.`,
      })
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
    setUploadQueue((prev) => {
      return {
        ...prev,
        [fileIndex]: {
          progress: 0,
        },
      }
    })

    activeImagesInProgress.current += 1
    processedFiles.current.push(fileIndex)

    const file = files[fileIndex]

    try {
      const data = await uploadFile(
        file,
        {
          password,
          downloadsLeft,
          expirationTime,
        },
        (progress) => {
          setUploadQueue((prev) => {
            return {
              ...prev,
              [fileIndex]: {
                progress,
              },
            }
          })
        },
      )

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
      setUploadQueue((prev) => {
        delete prev[fileIndex]
        return prev
      })

      activeImagesInProgress.current -= 1

      if (
        activeImagesInProgress.current < CONFIG.MAX_CONCURRENT_UPLOADS &&
        processedFiles.current.length < files.length
      ) {
        const nextFileIndex = processedFiles.current.length

        if (nextFileIndex < files.length) {
          processFile(nextFileIndex)
        }
      }
    }
  }

  const initUpload = async (): Promise<void> => {
    if (files.length === 0) {
      return
    }

    setDisabled(true)

    const uploadNextFile = async (fileIndex: number): Promise<void> => {
      if (fileIndex >= files.length) {
        return
      }

      if (
        activeImagesInProgress.current < CONFIG.MAX_CONCURRENT_UPLOADS &&
        processedFiles.current.length < files.length
      ) {
        await processFile(fileIndex)
        const nextFileIndex = processedFiles.current.length
        await uploadNextFile(nextFileIndex)
      }
    }

    // Start uploads for the first batch
    const initialUploads = Array.from(
      { length: CONFIG.MAX_CONCURRENT_UPLOADS },
      (_, i) => uploadNextFile(i),
    )

    await Promise.all(initialUploads)
  }

  useEffect(() => {
    document.body.addEventListener(
      'dragover',
      handleOnDrag as unknown as EventListener,
    )

    // Cleanup
    return () => {
      document.body.removeEventListener(
        'dragover',
        handleOnDrag as unknown as EventListener,
      )
    }
  }, [])

  useEffect(() => {
    if (isPrivate) {
      passwordRef.current?.focus()
    }
  }, [isPrivate])

  return (
    <div
      id="dropzone"
      ref={dropzone}
      className={`rounded-xl p-2 ${isDragging ? 'bg-brand-primary' : ''}`}
      onDrop={handleOnDrop}
    >
      {files.length > 0 ? (
        <ScrollArea className="h-[400px] mb-4">
          <FilesUploadList
            files={files}
            uploadQueue={uploadQueue}
            uploadedFiles={uploadedFiles}
            onRemove={removeFile}
            errorQueue={errorQueue}
          />
        </ScrollArea>
      ) : (
        <EmptyDropZone handleOnBrowse={handleOnBrowse} />
      )}

      {files.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground text-right">
            Total images: {files.length} / Total size:{' '}
            {bytesToMegaBytes(
              files.reduce((acc, file) => acc + file.size, 0),
              true,
            )}
          </p>
          <div className="flex items-center my-2 mt-4 gap-2 flex-wrap">
            <span>Expire after</span>
            <DownloadOptions
              downloadsLeft={downloadsLeft}
              setDownloadsLeft={setDownloadsLeft}
              disabled={disabled}
            />
            <span>or</span>
            <ExpirationOptions
              expirationTime={expirationTime}
              setExpirationTime={setExpirationTime}
              disabled={disabled}
            />
          </div>

          <div className="flex items-center flex-wrap mb-4 gap-2">
            <Checkbox
              id="private"
              checked={isPrivate}
              onClick={() => setIsPrivate((prev) => !prev)}
              disabled={disabled}
            />
            <Label htmlFor="private">Protect with password</Label>
            <Input
              type="password"
              ref={passwordRef}
              placeholder="Password"
              className="w-full max-w-xs"
              value={password}
              disabled={!isPrivate || disabled}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={CONFIG.PASSWORD_MAX_LENGTH}
              autoComplete="new-password"
            />
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-2">
            <BrowseFilesBtn
              size="lg"
              handleOnBrowse={handleOnBrowse}
              disabled={disabled}
            >
              Add more +
            </BrowseFilesBtn>
            <Button
              size="lg"
              className="bg-brand-primary font-semibold"
              disabled={disabled}
              onClick={initUpload}
            >
              Start upload
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
