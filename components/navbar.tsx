import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CONFIG } from '@/app/config'
import { ToggleTheme } from '@/components/theme-toggle'
import { FaUser } from 'react-icons/fa6'

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
      <div className="flex items-center gap-2 sm:gap-4">
        <ToggleTheme />
        {/* Desktop login button */}
        <Button asChild className="font-bold hidden sm:block">
          <Link href={CONFIG.ROUTE.LOGIN}>Sign in</Link>
        </Button>
        {/* Mobile login button */}
        <Button size="icon" className="sm:hidden text-2xl">
          <FaUser />
        </Button>
      </div>
    </nav>
  )
}
