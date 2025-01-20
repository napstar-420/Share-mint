import { getImageByLink } from '@/app/actions'
import { images } from '@/app/db/images'
import { DownloadInitiator } from '@/components/download-initator'
import { ImageThumbnail } from '@/components/image-thumbnail'
import {
  bytesToMegaBytes,
  createDownloadLink,
  createPreviewLink,
  isNil,
} from '@/lib/utils'
import { notFound } from 'next/navigation'
import { UnlockFile } from '@/components/unlock-file'
import { cookies } from 'next/headers'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface ComponentProps {
  params: Promise<{ sharelink: string[] }>
}

export default async function DownloadPage({ params }: ComponentProps) {
  const sharelink = (await params).sharelink[0]
  const cookieStore = await cookies()

  const [image] = await getImageByLink(sharelink, {
    file_name: images.file_name,
    file_size: images.file_size,
    password: images.password,
  })

  if (isNil(image)) {
    return notFound()
  }

  const isPrivate = image.password
  let hasAccess = isPrivate ? false : true

  if (isPrivate) {
    const token = cookieStore.get('token')

    if (token?.value) {
      const decoded = jwt.verify(
        token.value,
        process.env.JWT_SECRET!,
      ) as JwtPayload

      if (decoded.sharelink === sharelink) {
        hasAccess = true
      }
    }
  }

  const downloadUrl = createDownloadLink(sharelink)
  const previewLink = createPreviewLink(sharelink, { p: 's600' })

  return (
    <div className="grid place-items-center sm:p-4">
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

          {!hasAccess ? (
            <UnlockFile sharelink={sharelink} />
          ) : (
            <>
              <div className="mx-auto max-w-64 border-2 flex flex-col gap-3 mt-8 p-2 rounded-md">
                <ImageThumbnail src={previewLink} classNames="w-full mx-auto" />
                <div className="w-full">
                  <h4 className="text-lg font-semibold tracking-tight truncate">
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
