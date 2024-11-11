import React from 'react'

export const ImageThumbnail = React.memo(function ImageThumbnail({
  src,
}: {
  src: string
}) {
  return (
    <div
      className="aspect-square w-14 bg-primary-foreground rounded-md bg-cover bg-center"
      style={{ backgroundImage: `url(${src})` }}
    />
  )
})
