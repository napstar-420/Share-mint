import { getSession } from '@/app/actions'

export default async function Dashboard() {
  const session = await getSession()

  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        👋 Welcome&nbsp;
        <span className="text-brand-primary">{session?.user?.name}</span>!
      </h1>
    </div>
  )
}
