import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface ComponentProps {
  name: string
  image: string
}

export function UserAvatar({ name, image }: ComponentProps) {
  const altText = `${name}'s image`
  const fallbackText =
    name
      ?.split(' ')
      .slice(0, 2)
      .map((name) => name[0])
      .join('') || 'You'

  return (
    <Avatar className="cursor-pointer">
      <AvatarImage src={image || ''} alt={altText} />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  )
}
