import { Sidebar } from '@/components/ui/sidebar'
import SidebarHeader from '@/components/admin/sidebar-header'
import { SidebarContent } from '@/components/admin/sidebar-content'
import { SidebarFooter } from '@/components/admin/sidebar-footer'

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent />
      <SidebarFooter />
    </Sidebar>
  )
}
