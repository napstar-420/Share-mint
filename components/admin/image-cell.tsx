import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import Image from 'next/image'

interface ComponentProps {
  src: string
  name: string
}

export function ImageCell({ src, name }: ComponentProps) {
  return (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer">
        <AspectRatio ratio={1 / 1} className="bg-muted">
          <Image
            src={src}
            alt={name}
            width={220}
            height={220}
            loading="lazy"
            className="h-full w-full rounded-md object-cover"
          />
        </AspectRatio>
      </HoverCardTrigger>
      <HoverCardContent>
        <Image
          src={src}
          alt={name}
          width={600}
          height={600}
          loading="lazy"
          className=""
        />
      </HoverCardContent>
    </HoverCard>
  )
}
