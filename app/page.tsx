import { BackgroundGrid } from '@/components/background-grid'
import UnderConstruction from '@/public/under-construction.svg'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="h-screen absolute top-0 left-0 w-full -z-10">
      <BackgroundGrid />
      <div className="grid place-items-center h-full">
        <div className="flex flex-col items-center gap-4">
          <Image
            src={UnderConstruction}
            alt="Under Construction"
            className="w-1/2 lg:w-1/3"
          />
          <h1 className="text-center scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Coming soon!
          </h1>
        </div>
      </div>
    </div>
  )
}
