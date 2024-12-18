'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import {
  bytesToMegaBytes,
  copyToClipboard,
  createPreviewLink,
  createShareLink,
} from '@/lib/utils'
import { format, formatDistanceToNow, isPast } from 'date-fns'
import { ImageCell } from '@/components/admin/image-cell'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FcCancel } from 'react-icons/fc'
import { FaLock } from 'react-icons/fa6'
import { BsEyeFill } from 'react-icons/bs'
import { MdOutlineFileDownload } from 'react-icons/md'

export const columns: ColumnDef<unknown, unknown>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'share_link',
    header: 'Image',
    cell: ({ row }) => {
      const link = row.getValue('share_link') as string
      const name = row.getValue('file_name') as string
      const src = createPreviewLink(link, { p: 's600' })

      console.log(src)

      return <ImageCell src={src} name={name} />
    },
  },
  {
    accessorKey: 'file_name',
    header: 'Name',
  },
  {
    accessorKey: 'file_type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('file_type') as string
      const formatted = type.slice(6).toUpperCase()
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'file_size',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Size
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const size = row.getValue('file_size') as number
      const formatted = bytesToMegaBytes(size, true)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'upload_date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Upload date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('upload_date') as string
      const formattedDate = format(new Date(date), 'MMM dd, yyyy')
      return <div>{formattedDate}</div>
    },
  },
  {
    accessorKey: 'downloads_left',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Downloads left
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const downloadsLeft = row.getValue('downloads_left') as number
      return <div>{downloadsLeft || 'Unlimited'}</div>
    },
  },
  {
    accessorKey: 'expiration_time',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Expires in
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const expirationDate = row.getValue('expiration_time') as string

      if (!expirationDate) {
        return <div>Never</div>
      }

      const expiration = new Date(expirationDate)
      const isExpired = isPast(expiration)

      const displayText = isExpired
        ? 'Expired'
        : formatDistanceToNow(expiration, { addSuffix: true })

      return <div>{displayText}</div>
    },
  },
  {
    accessorKey: 'has_password',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Protected
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const hasPassword = row.getValue('has_password') as boolean
      return (
        <div className="text-xl mx-auto w-max">
          {hasPassword ? <FaLock /> : <FcCancel />}
        </div>
      )
    },
  },
  {
    id: 'preview_copy',
    header: () => (
      <div className="font-medium flex items-center gap-2 justify-center">
        Preview link <BsEyeFill />
      </div>
    ),
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [copyText, setCopyText] = useState('Copy preview link')
      const handleClick = async () => {
        const link = row.getValue('share_link') as string
        const previewLink = createPreviewLink(link)
        await copyToClipboard(previewLink)

        setCopyText('Copied! 🗸')

        setTimeout(() => {
          setCopyText('Copy preview link')
        }, 2000)
      }

      return (
        <Button variant="outline" onClick={handleClick} className="w-full">
          {copyText}
        </Button>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'download_copy',
    header: () => (
      <div className="font-medium flex items-center gap-2 justify-center">
        Download link <MdOutlineFileDownload />
      </div>
    ),
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [downloadText, setDownloadText] = useState('Copy download link')
      const handleClick = async () => {
        const link = row.getValue('share_link') as string
        const previewLink = createShareLink(link)
        await copyToClipboard(previewLink)

        setDownloadText('Copied! 🗸')

        setTimeout(() => {
          setDownloadText('Copy download link')
        }, 2000)
      }

      return (
        <Button variant="secondary" onClick={handleClick} className="w-full">
          {downloadText}
        </Button>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]
