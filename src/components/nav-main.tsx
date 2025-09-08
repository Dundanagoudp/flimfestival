"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasActiveChild = item.items?.some((s) => s.url === pathname)
          // Only mark parent active on exact match. Children do not activate the parent.
          const isParentActive = pathname === item.url
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive || hasActiveChild || isParentActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={false}
                    className={`${isParentActive ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-foreground)]" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-[var(--sidebar-active-foreground)]"} rounded-full transition-colors overflow-hidden`}
                  >
                    {item.icon && <item.icon />}
                    <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.title}
                    </span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isActive = pathname === subItem.url
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={false}
                            className={`${isActive ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-foreground)]" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-[var(--sidebar-active-foreground)]"} rounded-full transition-colors overflow-hidden`}
                          >
                            <a href={subItem.url} aria-current={isActive ? 'page' : undefined}>
                              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap overflow-hidden text-ellipsis">
                                {subItem.title}
                              </span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
