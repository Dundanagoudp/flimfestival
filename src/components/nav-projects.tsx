"use client"

import {
  type LucideIcon,
} from "lucide-react"
import {
  SidebarGroup,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
   
    </SidebarGroup>
  )
}
