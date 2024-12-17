import { getImageByLink } from '@/app/actions'
import { images } from '@/app/db/images'
import { createPreviewLink, isNil } from '@/lib/utils'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ sharelink: string }>
}

const defaultMetadata: Metadata = {
  title: 'Download image shared by Sharemint',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sharelink = (await params).sharelink[0]

  if (!sharelink) {
    return defaultMetadata
  }

  const [image] = await getImageByLink(sharelink, {
    file_name: images.file_name,
    file_size: images.file_size,
    password: images.password,
  })

  if (isNil(image) || image.password) {
    return defaultMetadata
  }

  const previewLink = createPreviewLink(sharelink, 's600')

  return {
    title: `Download ${image.file_name} shared by Sharemint`,
    openGraph: {
      images: [{ url: previewLink }],
    },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
