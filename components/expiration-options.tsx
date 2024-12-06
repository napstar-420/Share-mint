import { getSession } from '@/app/actions'
import { CONFIG } from '@/app/config'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { isNil } from '@/lib/utils'
import { Session } from 'next-auth'
import { useEffect, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { FaInfoCircle } from 'react-icons/fa'

interface Props {
  expirationTime: number
  setExpirationTime: (value: number) => void
  disabled?: boolean
}

export function ExpirationOptions({
  expirationTime,
  setExpirationTime,
  disabled,
}: Props) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession()
      setSession(session)
    }

    fetchSession()

    return () => setSession(null)
  }, [])

  return (
    <Select
      value={expirationTime as unknown as string}
      onValueChange={(v) => setExpirationTime(Number(v))}
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select expiration time" />
      </SelectTrigger>
      <SelectContent>
        {CONFIG.EXPIRATION_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value as unknown as string}
          >
            {option.label}
          </SelectItem>
        ))}
        {isNil(session?.user) ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <SelectItem value={null as unknown as string} disabled>
                  <span className="flex items-center gap-2">
                    Lifetime <FaInfoCircle />
                  </span>
                </SelectItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign-in to use this feature</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <SelectItem value={0 as unknown as string}>Lifetime</SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}
