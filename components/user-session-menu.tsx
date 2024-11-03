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
import UserAvatar from '@/components/user-avatar'
import { Session } from 'next-auth'
import { SignOut } from '@/components/signout-button'

export default function UserSessionMenu({ session }: { session: Session | null }) {
  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserAvatar session={session} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>My images</DropdownMenuItem>
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
        <Link href={CONFIG.ROUTE.LOGIN}>Sign in</Link>
      </Button>
      {/* Mobile login button */}
      <Button size="icon" className="sm:hidden text-2xl">
        <FaUser />
      </Button>
    </>
  )
}
