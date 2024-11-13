import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="h-dvh w-full absolute top-0 left-0 -z-10 grid place-items-center">
      <div className="flex gap-2 items-center">
        <Loader2 className="animate-spin mx-auto text-brand-primary text-8xl" />
        <p className="leading-7">Please wait...</p>
      </div>
    </div>
  )
}
