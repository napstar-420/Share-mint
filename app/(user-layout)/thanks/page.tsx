import Image from 'next/image'
import ThankYouSvg from '@/public/thank_you.svg'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CONFIG } from '@/app/config'

export default function ThankYou() {
  return (
    <div className="grid place-items-center w-full -z-10 pt-11 pb-4">
      <div className="flex flex-col items-center gap-2 text-center p-4">
        <Image src={ThankYouSvg} alt="Thank You" width={300} height={300} />
        <h1 className="scroll-m-20 mt-8 text-brand-primary text-4xl font-extrabold tracking-tight lg:text-5xl">
          Thank You!
        </h1>
        <div className="text-lg font-semibold">For using Sharemint</div>
        <Button asChild size="lg" className="font-bold mt-4">
          <Link href={CONFIG.ROUTE.HOME}>Go back home</Link>
        </Button>
      </div>
    </div>
  )
}
