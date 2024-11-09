import { auth } from '@/auth'
import UserSessionMenu from '@/components/user-session-menu'
import Link from 'next/link'
import { CONFIG } from '@/app/config'
import { Button } from '@/components/ui/button'

export async function Navbar() {
  const session = await auth()

  const navbarLinks = [
    { href: CONFIG.ROUTE.ADMIN.DASHBOARD, label: 'Dashboard' },
    { href: CONFIG.ROUTE.ADMIN.IMAGES, label: 'Images' },
    { href: CONFIG.ROUTE.ADMIN.USERS, label: 'Users' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2 sm:px-8 flex items-center justify-between gap-8">
      <h1 className="scroll-m-20 text-xl font-semibold tracking-tight text-brand-primary">
        Management
      </h1>
      <nav className='flex-1'>
        <ul className="flex items-center gap-4">
          {navbarLinks.map((link) => (
            <li key={link.href}>
            <Button asChild variant="link">
                <Link href={link.href} className={`hover:underline`}>
                  {link.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
        <div className="flex items-center gap-4">
          <UserSessionMenu session={session} />
        </div>
    </div>
  )
}
