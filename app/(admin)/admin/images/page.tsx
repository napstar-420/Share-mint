import { getImages } from '@/app/actions'
import { DataTable } from '@/components/admin/data-table'
import { columns } from '@/app/(admin)/admin/images/data-table-columns'
import { Image } from '@/app/db/images'

export default async function Images() {
  const data = (await getImages()) as Image[]

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
