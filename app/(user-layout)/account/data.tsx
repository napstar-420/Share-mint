'use client'

import * as React from 'react'
import { deleteImages, getSessionUserImages } from '@/app/actions'
import { DataTable } from '@/components/admin/data-table'
import { columns } from '@/app/(user-layout)/account/data-table-columns'
import { Image } from '@/app/db/images'
import { DataTablePagination } from '@/components/admin/data-table-pagination'
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { DataTableFilter } from '@/components/admin/data-table-filter'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { DataTableVisibility } from '@/components/admin/data-table-visibility'

interface ColumnRow extends Image {
  has_password: boolean
}

export function AccountData() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [rowSelection, setRowSelection] = React.useState({})
  const [images, setImages] = React.useState<ColumnRow[]>([])
  const [deleting, setDeleting] = React.useState(false)
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

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
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
  })

  const fetchImages = async () => {
    const data = await getSessionUserImages()
    setImages(data as ColumnRow[])
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
      console.error(error)
      toast('Error when deleting images')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-[100dvw]">
      <div className="sm:flex w-full overflow-x-auto items-center justify-between gap-4 pb-4">
        <DataTableFilter
          placeholder="Filter images..."
          columnName="file_name"
          table={table}
        />
        <div className="flex gap-4 justify-between mt-4 sm:mt-0">
          <div>
            <DataTableVisibility table={table} />
          </div>
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
