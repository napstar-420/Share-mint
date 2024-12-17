import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { CONFIG } from './config'

const poppins = Poppins({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

const title = 'Sharemint'
const description = 'Sharemint lets you share images with end-to-end encryption and a link that automatically expires. So you can keep what you share private and make sure your stuff doesn’t stay online forever.'

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    url: CONFIG.APP_URL,
    title,
    description,
    siteName: title,
    images: [{ url: '/og-image.png' }]
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    creator: '@napstar-420',
    images: [{ url: '/og-image.png' }]
  },
  
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
