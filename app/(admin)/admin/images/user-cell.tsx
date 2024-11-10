'use client'
import { getUser } from '@/app/actions'
import { User } from '@/app/db/users'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { UserAvatar } from '@/components/user-avatar'

export function UserCell({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const [data] = await getUser(userId)
        setUser(data)
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    }

    fetchUser()
  }, [userId])

  return (
    <div className="font-medium">
      {user ? (
        <div className="flex items-center gap-2">
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
