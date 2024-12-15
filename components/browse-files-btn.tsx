import { ChangeEvent } from 'react'
import { Button } from './ui/button'
import { CONFIG } from '@/app/config'

export function BrowseFilesBtn({
  handleOnBrowse,
  acceptedFileTypes = CONFIG.FILE_TYPES.ACCEPTED.map((t) => t).join(', '),
  size = 'default',
  disabled = false,
  children = 'Browse files',
}: {
  handleOnBrowse: (e: ChangeEvent<HTMLInputElement>) => void
  acceptedFileTypes?: string
  size?: 'sm' | 'default' | 'lg' | 'icon'
  disabled?: boolean
  children?: React.ReactNode
}) {
  return (
    <>
      <Button
        asChild
        variant="secondary"
        size={size}
        className={`cursor-pointer ${disabled ? 'pointer-events-none opacity-50' : ''}`}
        disabled={disabled}
      >
        <label htmlFor="dropzone-upload">{children}</label>
      </Button>
      <input
        type="file"
        name="dropzone-upload"
        id="dropzone-upload"
        className="h-1 w-1 invisible absolute"
        multiple
        onChange={handleOnBrowse}
        accept={acceptedFileTypes}
        disabled={disabled}
      />
    </>
  )
}
