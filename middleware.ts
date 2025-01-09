import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { UserRoles } from '@/enums'

export default auth((req) => {
  const user = req.auth?.user

  const isAdminPath = req.nextUrl.pathname.startsWith('/admin')

  if (isAdminPath && (!user || user.role !== UserRoles.ADMIN)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  return NextResponse.next()
})
