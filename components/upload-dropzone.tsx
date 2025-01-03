'use client'

import { Button } from '@/components/ui/button'
import { FcOpenedFolder } from 'react-icons/fc'
import { MdOutlineInfo } from 'react-icons/md'
import { CONFIG } from '@/app/config'
import { Separator } from '@/components/ui/separator'
import {
  useState,
  DragEvent,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from 'react'
import { readableFileType } from '@/lib/utils'

interface ComponentProps {
  setFiles: Dispatch<SetStateAction<File[]>>
}

export function UploadDropZone({ setFiles }: ComponentProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleOnDrag = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
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
      const newFiles = Array.from(files)
      const validFiles = newFiles.filter(
        (file) =>
          CONFIG.FILE_TYPES.ACCEPTED.includes(file.type) &&
          file.size <= CONFIG.MAX_FILE_SIZE,
      )
      setFiles((prevFiles) => [...prevFiles, ...validFiles])
    }
  }

  const acceptedFileTypes = CONFIG.FILE_TYPES.ACCEPTED.map((t) =>
    readableFileType(t),
  )
    .map((t) => `.${t}`)
    .toString()
    .replaceAll(',', ', ')

  return (
    <div
      className={`py-12 px-4 rounded-xl flex flex-col items-center ${isDragging ? 'bg-brand-primary' : 'bg-primary-foreground'}`}
      onDragOver={handleOnDrag}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleOnDrop}
    >
      <FcOpenedFolder className="text-6xl my-4" />
      <h1 className="text-xl font-semibold">Drag and drop here</h1>
      <Separator className="bg-secondary-foreground my-4 max-w-sm" />
      <Button asChild variant="secondary">
        <label htmlFor="dropzone-upload">Browse files</label>
      </Button>
      <input
        type="file"
        name="dropzone-upload"
        id="dropzone-upload"
        className="h-1 w-1 invisible absolute"
        multiple
        onChange={handleOnBrowse}
        accept={acceptedFileTypes}
      />

      <div className="mt-14">
        <p className="text-sm text-muted-foreground flex items-start gap-2">
          <MdOutlineInfo /> Accepted file types: {acceptedFileTypes}
        </p>
        <p className="text-sm text-muted-foreground flex items-start gap-2">
          <MdOutlineInfo /> Max file size: {CONFIG.MAX_FILE_SIZE} mb
        </p>
        <p className="text-sm text-muted-foreground flex items-start gap-2">
          <MdOutlineInfo /> Max images per batch: {CONFIG.MAX_FILES_PER_BATCH}
        </p>
      </div>
    </div>
  )
}
