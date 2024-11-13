'use client'

import { CONFIG } from '@/app/config'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getSession } from '@/app/actions'
import { useEffect, useState } from 'react'
import { Session } from 'next-auth'
import { isNil } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { FaInfoCircle } from 'react-icons/fa'

interface Props {
  downloadsLeft: number
  setDownloadsLeft: (value: number) => void
  disabled?: boolean
}

export function DownloadOptions({
  downloadsLeft,
  setDownloadsLeft,
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
      value={downloadsLeft as unknown as string}
      onValueChange={(v) => setDownloadsLeft(Number(v))}
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select downloads limit" />
      </SelectTrigger>
      <SelectContent>
        {CONFIG.DOWNLOAD_OPTIONS.map((option) => (
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
                    Unlimited <FaInfoCircle />
                  </span>
                </SelectItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign-in to use this feature</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <SelectItem value={0 as unknown as string}>Unlimited</SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}
