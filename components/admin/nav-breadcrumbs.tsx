'use client'
import * as React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'

const routeNames = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  images: 'Images',
  users: 'Users',
}

const routePaths = {
  admin: '/admin',
  dashboard: '/admin/dashboard',
  images: '/admin/images',
  users: '/admin/users',
}

export function NavBreadcrumbs() {
  const pathnames = usePathname().split('/').slice(1)
  const currentPath = pathnames[pathnames.length - 1]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathnames.map((pathname, index) => {
          const routeName = routeNames[pathname as keyof typeof routeNames]
          const routePath = routePaths[pathname as keyof typeof routePaths]

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {pathname === currentPath ? (
                  <BreadcrumbPage>{routeName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={routePath}>{routeName}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index !== pathnames.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
