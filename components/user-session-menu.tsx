import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CONFIG } from '@/app/config'
import { FaUser } from 'react-icons/fa6'
import { UserAvatar } from '@/components/user-avatar'
import { Session } from 'next-auth'
import { SignOut } from '@/components/signout-button'
import { UserRoles } from '@/enums'

export default function UserSessionMenu({
  session,
}: {
  session: Session | null
}) {
  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserAvatar
            name={session.user.name}
            image={session.user.image}
            classes="cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Hi {session.user.name}!</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="p-0 m-0">
              <Link
                href={CONFIG.ROUTE.ACCOUNT}
                className="p-2 w-full h-full hover:bg-secondary rounded-sm"
              >
                My images
              </Link>
            </DropdownMenuItem>
            {session.user.role === UserRoles.ADMIN && (
              <DropdownMenuItem className="p-0 m-0">
                <Link
                  href={CONFIG.ROUTE.ADMIN.DASHBOARD}
                  className="p-2 w-full h-full hover:bg-secondary rounded-sm"
                >
                  Admin dashboard
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignOut />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      {/* Desktop login button */}
      <Button asChild className="font-bold hidden sm:block">
        <Link href={CONFIG.ROUTE.SIGN_IN}>Sign in</Link>
      </Button>
      {/* Mobile login button */}
      <Button size="icon" className="sm:hidden text-2xl">
        <FaUser />
      </Button>
    </>
  )
}
