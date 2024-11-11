import { getImages } from '@/app/actions'
import { DataTable } from '@/components/admin/data-table'
import { columns } from '@/app/(admin)/admin/images/data-table-columns'
import { Image } from '@/app/db/images';
import { User } from '@/app/db/users';

export interface ColumnRow extends Image {
  user: User
}

export default async function Images() {
  const images = (await getImages({
    joinUsers: true,
  })) as { images: ColumnRow; user: User }[]

  const data = images.map(({ images, user }) => {
    return {
      ...images,
      user,
    }
  })

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
