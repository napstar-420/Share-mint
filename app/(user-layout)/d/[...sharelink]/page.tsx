import { getImageByLink, isLinkExists } from '@/app/actions'
import { CONFIG } from '@/app/config'
import { images } from '@/app/db/images'
import { DownloadInitiator } from '@/components/download-initator'
import { ImageThumbnail } from '@/components/image-thumbnail'
import { bytesToMegaBytes } from '@/lib/utils'
import { notFound } from 'next/navigation'

interface ComponentProps {
  params: Promise<{ sharelink: string[] }>
}

export default async function DownloadPage({ params }: ComponentProps) {
  const sharelink = (await params).sharelink[0]

  if (!(await isLinkExists(sharelink))) {
    return notFound()
  }

  const [image] = await getImageByLink(sharelink, {
    file_name: images.file_name,
    file_size: images.file_size,
  })

  const downloadUrl = `${CONFIG.APP_URL}${CONFIG.ROUTE.API.DOWNLOAD}/${sharelink}`
  const previewLink = `${CONFIG.APP_URL}${CONFIG.ROUTE.API.IMG_PREVIEW(sharelink, 's220')}`

  return (
    <div className="min-h-[calc(100dvh_-_120px)] grid place-items-center sm:p-4">
      <div className="min-w-[300px] w-full max-w-3xl bg-primary-foreground border-2 px-4 py-32 rounded-2xl z-10">
        <div className="max-w-[420px] mx-auto">
          <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight text-center">
            Download image
          </h3>
          <p className="text-xs sm:text-sm mx-auto [&:not(:first-child)]:mt-4 text-center">
            This file was shared via{' '}
            <span className="font-semibold">Sharemint</span> with end-to-end
            encryption and a link that automatically expires.
          </p>

          <div className="mx-auto border-2 flex gap-3 mt-8 p-2 rounded-md">
            <ImageThumbnail src={previewLink} />
            <div>
              <h4 className="text-lg font-semibold tracking-tight">
                {image.file_name}
              </h4>
              <small className="text-sm font-medium leading-none">
                {bytesToMegaBytes(image.file_size!, true)}
              </small>
            </div>
          </div>

          <DownloadInitiator
            downloadUrl={downloadUrl}
            file_name={image.file_name!}
          />
        </div>
      </div>
    </div>
  )
}
