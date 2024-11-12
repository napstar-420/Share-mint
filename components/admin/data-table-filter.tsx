import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'

export function DataTableFilter<TData>({
  table,
  placeholder,
  columnName,
}: {
  table: Table<TData>
  placeholder: string
  columnName: string
}) {
  return (
    <Input
      placeholder={placeholder}
      value={(table.getColumn(columnName)?.getFilterValue() as string) ?? ''}
      onChange={(event) =>
        table.getColumn(columnName)?.setFilterValue(event.target.value)
      }
      className="max-w-max sm:max-w-sm"
    />
  )
}
