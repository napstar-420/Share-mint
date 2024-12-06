import {
  SidebarHeader as Header,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ToggleTheme } from '../theme-toggle'

export default function SidebarHeader() {
  return (
    <Header>
      <SidebarMenu>
        <SidebarMenuItem className="p-2">
          <div className="flex items-center justify-between">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              <span className="text-brand-primary">Sharemint</span> Admin
            </h4>
            <ToggleTheme />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </Header>
  )
}
