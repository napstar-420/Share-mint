import { BackgroundGrid } from '@/components/background-grid'
import { Button } from '@/components/ui/button'
import { FaArrowRight } from 'react-icons/fa'
import { CONFIG } from '@/app/config'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <BackgroundGrid />
      <div className="min-h-[calc(100vh-120px)] grid items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            <span>Share images like</span>
            <br />
            <span className="text-brand-primary">Never before</span>
          </h1>
          <p className="my-6 text-sm max-w-md">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum
            beatae aspernatur est pariatur reprehenderit! Debitis ratione alias
            porro quibusdam molestias.
          </p>
          <Button
            asChild
            variant="default"
            className="bg-brand-primary text-lg font-semibold py-7 px-8"
          >
            <Link href={CONFIG.ROUTE.UPLOAD}>
              Start Uploading
              <FaArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
