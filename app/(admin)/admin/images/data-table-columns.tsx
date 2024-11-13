'use client'

import { ColumnDef } from '@tanstack/react-table'
import { bytesToMegaBytes } from '@/lib/utils'
import { CONFIG } from '@/app/config'
import { format, formatDistanceToNow } from 'date-fns'
import { UserCell } from '@/app/(admin)/admin/images/user-cell'
import { ImageCell } from '@/app/(admin)/admin/images/image-cell'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { User } from '@/app/db/users'
import { FcCancel } from 'react-icons/fc'
import { FaLock } from 'react-icons/fa6'

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
      const src = CONFIG.ROUTE.API.IMG_PREVIEW(link, 's600')

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
      const timeLeft = formatDistanceToNow(new Date(expirationDate), {
        addSuffix: true,
      })

      return <div>{expirationDate ? timeLeft : 'Never'}</div>
    },
  },
  {
    accessorKey: 'password',
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
      const password = row.getValue('password') as string
      return (
        <div className="text-xl mx-auto w-max">
          {password ? <FaLock /> : <FcCancel />}
        </div>
      )
    },
  },
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => {
      const user = row.getValue('user') as User
      return <UserCell user={user} />
    },
  },
]
