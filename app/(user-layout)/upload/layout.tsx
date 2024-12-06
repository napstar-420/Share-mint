import { getSession } from '@/app/actions'
import { UploadLoginAlert } from '@/components/upload-login-alert'

export default async function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()

  return (
    <div>
      {!session && <UploadLoginAlert />}
      {children}
    </div>
  )
}
