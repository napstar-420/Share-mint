'use client'

import { Image } from '@/app/db/images'
import { ColumnDef } from '@tanstack/react-table'
import { bytesToMegaBytes } from '@/lib/utils'
import { CONFIG } from '@/app/config'
import { format } from 'date-fns'
import { UserCell } from '@/app/(admin)/admin/images/user-cell'
import { ImageCell } from '@/app/(admin)/admin/images/image-cell'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export const columns: ColumnDef<Image>[] = [
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
    accessorKey: 'uploader_id',
    header: 'User',
    cell: ({ row }) => {
      const userId = row.getValue('uploader_id') as string
      return <UserCell userId={userId} />
    },
  },
]
