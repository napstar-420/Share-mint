import { getSession } from '@/app/actions'
import { AccountData } from './data'
import { notFound } from 'next/navigation';

export default async function Account() {
  const session = await getSession();

  if (!session) {
    return notFound();
  }

  return (
    <AccountData />
  )
}
