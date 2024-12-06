'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FaUnlockAlt } from 'react-icons/fa'
import { verifyPassword } from '@/app/actions'
import { useActionState } from 'react'

interface ComponentProps {
  sharelink: string
}

export function UnlockFile({ sharelink }: ComponentProps) {
  const [message, formAction, isPending] = useActionState(verifyPassword, null)

  return (
    <div className="mt-4">
      <form action={formAction}>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <input type="hidden" name="sharelink" value={sharelink} />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            className="bg-background"
          />
          <Button
            className="w-full sm:w-auto font-semibold bg-brand-primary"
            type="submit"
            disabled={isPending}
          >
            Unlock <FaUnlockAlt />
          </Button>
        </div>
        <p aria-live="polite" className="text-sm text-destructive mt-1 ml-1">
          {message}
        </p>
      </form>
    </div>
  )
}
