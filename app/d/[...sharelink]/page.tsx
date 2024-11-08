import { CONFIG } from '@/app/config'
import { DownloadInitiator } from '@/components/download-initator'

interface ComponentProps {
  params: Promise<{ sharelink: string }>
}

export default async function DownloadPage({ params }: ComponentProps) {
  const { sharelink } = await params
  const downloadUrl = `${CONFIG.APP_URL}${CONFIG.ROUTE.API.DOWNLOAD}/${sharelink}`

  return (
    <div>
      Downloading.....
      <DownloadInitiator downloadUrl={downloadUrl} />
      <p>
        If your download doesn’t start automatically,{' '}
        <a href={downloadUrl}>click here</a>.
      </p>
    </div>
  )
}
