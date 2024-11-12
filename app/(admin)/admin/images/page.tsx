'use client'

import * as React from 'react'
import { deleteImages, getImages } from '@/app/actions'
import { DataTable } from '@/components/admin/data-table'
import { columns } from '@/app/(admin)/admin/images/data-table-columns'
import { Image } from '@/app/db/images'
import { User } from '@/app/db/users'
import { DataTablePagination } from '@/components/admin/data-table-pagination'
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { DataTableFilter } from '@/components/admin/data-table-filter'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export interface ColumnRow extends Image {
  user: User
}

export default function Images() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [rowSelection, setRowSelection] = React.useState({})
  const [images, setImages] = React.useState<ColumnRow[]>([])
  const [deleting, setDeleting] = React.useState(false)

  const table = useReactTable({
    data: images,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  const fetchImages = async () => {
    const images = (await getImages({
      joinUsers: true,
    })) as { images: ColumnRow; user: User }[]

    const data = images.map(({ images, user }) => {
      return {
        ...images,
        user,
      }
    })

    setImages(data)
  }

  React.useEffect(() => {
    fetchImages()
  }, [])

  async function handleDelete() {
    try {
      setDeleting(true)
      const selectionIndexes = Object.keys(rowSelection).map((i) => Number(i))
      const imageLinks = images
        .filter((_, index) => selectionIndexes.includes(index))
        .map((image) => image.share_link)
      await deleteImages(imageLinks)
      await fetchImages()
      toast('Images deleted successfully')
      setRowSelection({})
    } catch (error) {
      console.log(error)
      toast('Error when deleting images')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-[100dvw]">
      <div className="flex w-full overflow-x-auto items-center justify-between gap-4 py-4">
        <DataTableFilter
          placeholder="Filter images..."
          columnName="file_name"
          table={table}
        />
        <div>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={deleting || Object.keys(rowSelection).length === 0}
          >
            Delete
          </Button>
        </div>
      </div>
      <Separator />
      <DataTable table={table} columns={columns} />
      <DataTablePagination table={table} />
    </div>
  )
}