import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 min-h-dvh grid grid-rows-[auto_1fr_auto]">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
