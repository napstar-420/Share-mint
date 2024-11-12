import {
  SidebarContent as Content,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Home, ImageIcon, LayoutDashboard, UserCircle2Icon } from 'lucide-react'
import { CONFIG } from '@/app/config'

const items = [
  {
    title: 'Home',
    url: CONFIG.ROUTE.HOME,
    icon: Home,
  },
  {
    title: 'Dashboard',
    url: CONFIG.ROUTE.ADMIN.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: 'Images',
    url: CONFIG.ROUTE.ADMIN.IMAGES,
    icon: ImageIcon,
  },
  {
    title: 'Users',
    url: CONFIG.ROUTE.ADMIN.USERS,
    icon: UserCircle2Icon,
  },
]

export function SidebarContent() {
  return (
    <Content>
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </Content>
  )
}
