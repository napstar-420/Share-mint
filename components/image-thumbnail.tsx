import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export function ImageThumbnail({
  src,
  classNames,
}: {
  src: string
  classNames?: string
}) {
  return (
    <div className="aspect-square min-w-14 rounded-md overflow-hidden relative">
      <Skeleton className="w-full h-full" />
      {src && (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img
          className={cn(
            'bg-cover bg-center object-cover object-center absolute top-0 left-0 w-full h-full',
            classNames,
          )}
          loading="lazy"
          src={src}
        />
      )}
    </div>
  )
}
