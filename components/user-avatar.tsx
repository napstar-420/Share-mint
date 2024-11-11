import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Session } from 'next-auth'

interface ComponentProps {
  session: Session
}

export default function UserAvatar({ session }: ComponentProps) {
  const altText = `${session.user?.name}'s image`
  const fallbackText =
    session.user?.name
      ?.split(' ')
      .slice(0, 2)
      .map((name) => name[0])
      .join('') || 'You'

  return (
    <Avatar className="cursor-pointer">
      <AvatarImage src={session.user?.image || ''} alt={altText} />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  )
}
