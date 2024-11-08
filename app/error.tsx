'use client'

import Image from 'next/image'
import SVGIMG from '@/public/Error-page.svg'
import { MdError } from 'react-icons/md'
import { BackgroundGrid } from '@/components/background-grid'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CONFIG } from '@/app/config'

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex h-screen -z-10 absolute top-0 left-0 w-full flex-col lg:flex-row items-center justify-center">
      <BackgroundGrid />

      {/* Left Half */}
      <div className="flex flex-col items-center justify-center gap-4 text-center p-8 lg:w-1/2">
        <h1 className="text-6xl font-bold text-brand-primary">
          <MdError />
        </h1>
        <div>
          <h2 className="mb-2 text-2xl font-semibold text-secondary-foreground">
            Something went wrong!
          </h2>
          <p className="text-secondary-foreground">
            We&apos;re sorry, but it seems there was an unexpected error.
            <br />
            Don’t worry, our team is already looking into it.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="lg" variant="secondary" className="font-bold">
            <Link href={CONFIG.ROUTE.HOME}>Go back home</Link>
          </Button>
          <Button size="lg" className="font-bold" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>

      {/* Right Half */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-8">
        <Image
          src={SVGIMG}
          alt="Error Illustration"
          width={400}
          height={400}
          className="max-w-full h-auto"
        />
      </div>
    </div>
  )
}
