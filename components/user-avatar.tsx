import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface ComponentProps {
  name: string
  image: string
  classes?: string
}

export function UserAvatar({ name, image, classes }: ComponentProps) {
  const altText = `${name}'s image`
  const fallbackText =
    name
      ?.split(' ')
      .slice(0, 2)
      .map((name) => name[0])
      .join('') || 'You'

  return (
    <Avatar className={classes}>
      <AvatarImage src={image || ''} alt={altText} />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  )
}
