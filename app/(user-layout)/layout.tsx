import { Navbar } from '@/components/navbar'

export default function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8">
      <Navbar />
      {children}
    </div>
  )
}
