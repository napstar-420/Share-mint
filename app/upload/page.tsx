'use client'

import { Separator } from '@/components/ui/separator'
import { FilesUploadList } from '@/components/files-upload-list'
import { UploadDropZone } from '@/components/upload-dropzone'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])

  const onCancelUpload = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <div className="py-8">
      <div className="grid lg:grid-cols-[3fr_auto_2fr] xl:grid-cols-[2fr_auto_1fr] gap-2 items-start max-w-lg mx-auto lg:max-w-none lg:mx-0">
        <UploadDropZone setFiles={setFiles} />

        <Separator orientation="vertical" className="hidden lg:block" />
        <Separator className="block lg:hidden" />

        <ScrollArea className="h-[400px]">
          <FilesUploadList files={files} onCancelUpload={onCancelUpload} />
        </ScrollArea>
      </div>
    </div>
  )
}
