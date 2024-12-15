'use client'

import { Separator } from '@/components/ui/separator'
import { UploadDropZone } from '@/components/upload-dropzone'

export default function UploadPage() {
  return (
    <form className="py-8" onSubmit={(e) => e.preventDefault()}>
      <div className="grid p-2 rounded-2xl border-2 border-dashed lg:grid-cols-[3fr_auto_2fr] gap-2 items-start md:max-w-lg mx-auto lg:max-w-none lg:mx-0">
        <div className="p-4 lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-4">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Simple Image Sharing
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground">
            Sharemint lets you share images with end-to-end encryption and a
            link that automatically expires. So you can keep what you share
            private and make sure your stuff doesn’t stay online forever.
          </p>
        </div>

        <Separator
          orientation="vertical"
          className="hidden lg:block lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4"
        />
        <Separator className="block lg:hidden" />
        <div className="lg:row-start-1 lg:row-end-4">
          <UploadDropZone />
        </div>
      </div>
    </form>
  )
}
