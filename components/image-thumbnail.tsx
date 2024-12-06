import { cn } from '@/lib/utils'

export function ImageThumbnail({
  src,
  classNames,
}: {
  src: string
  classNames?: string
}) {
  return (
    <div
      className={cn(
        'aspect-square w-14 bg-primary-foreground rounded-md bg-cover bg-center',
        classNames,
      )}
      style={{ backgroundImage: `url(${src})` }}
    />
  )
}
