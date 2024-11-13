import { User } from '@/app/db/users'
import { Loader2 } from 'lucide-react'
import { UserAvatar } from '@/components/user-avatar'

export function UserCell({ user }: { user: User }) {
  return (
    <div className="font-medium">
      {user ? (
        <div className="flex items-center gap-2 text-left">
          <UserAvatar name={user.name!} image={user.image!} />
          <div className="flex flex-col flex-wrap w-full">
            <div className="font-medium">{user.name}</div>
            <div className="text-muted-foreground text-sm truncate">
              {user.email?.split('@')[0]}
            </div>
          </div>
        </div>
      ) : (
        <Loader2 className="animate-spin mx-auto" />
      )}
    </div>
  )
}
