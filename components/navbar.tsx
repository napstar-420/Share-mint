import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CONFIG } from '@/app/config'

export function Navbar() {
  return (
    <nav className="py-10 flex items-center justify-between">
      <div className="absolute top-0 left-0 w-full bg-brand-primary h-2"></div>
      <Link
        href={CONFIG.ROUTE.HOME}
        className="text-2xl xs:text-3xl sm:text-4xl font-bold"
      >
        Share<span className="text-brand-primary">mint</span>
      </Link>
      <Button asChild variant="default" className="font-bold">
        <Link href={CONFIG.ROUTE.LOGIN}>Sign in</Link>
      </Button>
    </nav>
  )
}
