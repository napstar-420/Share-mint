import Link from 'next/link'
import { CONFIG } from '@/app/config'
import { ToggleTheme } from '@/components/theme-toggle'
import UserSessionMenu from './user-session-menu'
import { auth } from '@/auth'

export async function Navbar() {
  const session = await auth()

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
        <UserSessionMenu session={session} />
      </div>
    </nav>
  )
}
