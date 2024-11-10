import { Navbar } from '@/components/admin/navbar'
import { Separator } from '@/components/ui/separator'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Navbar />
      <Separator />
      <div className="max-w-5xl mx-auto mt-4">{children}</div>
    </div>
  )
}
