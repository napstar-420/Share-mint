import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/admin/sidebar'
import { Separator } from '@/components/ui/separator'
import { NavBreadcrumbs } from '@/components/admin/nav-breadcrumbs'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <NavBreadcrumbs />
        </header>
        <div className="px-4 pb-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
