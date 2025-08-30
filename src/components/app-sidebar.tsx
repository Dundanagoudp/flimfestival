"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Clapperboard,
  Settings2,
  SquareTerminal,
  Users,
  Calendar,
  Award,
  Film,
  BarChart3,
  Home,
  FileText,
  Mail,
  Bell,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Admin navigation data for film festival
const adminData = {
  user: {
    name: "Admin User",
    email: "admin@arunachalfilmfestival.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Arunachal Film Festival",
      logo: Clapperboard,
      plan: "Admin Panel",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: Home,
      isActive: true,
      items: [],
    },
    {
      title: "Films",
      url: "/admin/films",
      icon: Film,
      items: [
        {
          title: "All Films",
          url: "/admin/films",
        },
        {
          title: "Add Film",
          url: "/admin/films/add",
        },
        {
          title: "Categories",
          url: "/admin/films/categories",
        },
        {
          title: "Submissions",
          url: "/admin/films/submissions",
        },
      ],
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/admin/users",
        },
        {
          title: "User Roles",
          url: "/admin/users/roles",
        },
        {
          title: "Permissions",
          url: "/admin/users/permissions",
        },
      ],
    },
    {
      title: "Events",
      url: "/admin/events",
      icon: Calendar,
      items: [
        {
          title: "All Events",
          url: "/admin/events",
        },
        {
          title: "Add Event",
          url: "/admin/events/add",
        },
        {
          title: "Schedule",
          url: "/admin/events/schedule",
        },
      ],
    },
    {
      title: "Awards",
      url: "/admin/awards",
      icon: Award,
      items: [
        {
          title: "All Awards",
          url: "/admin/awards",
        },
        {
          title: "Add Award",
          url: "/admin/awards/add",
        },
        {
          title: "Categories",
          url: "/admin/awards/categories",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Overview",
          url: "/admin/analytics",
        },
        {
          title: "Reports",
          url: "/admin/analytics/reports",
        },
        {
          title: "Export Data",
          url: "/admin/analytics/export",
        },
      ],
    },
    {
      title: "Content",
      url: "/admin/content",
      icon: FileText,
      items: [
        {
          title: "Pages",
          url: "/admin/content/pages",
        },
        {
          title: "Blog Posts",
          url: "/admin/content/blog",
        },
        {
          title: "Media",
          url: "/admin/content/media",
        },
      ],
    },
    {
      title: "Communications",
      url: "/admin/communications",
      icon: Mail,
      items: [
        {
          title: "Emails",
          url: "/admin/communications/emails",
        },
        {
          title: "Notifications",
          url: "/admin/communications/notifications",
        },
        {
          title: "Templates",
          url: "/admin/communications/templates",
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/admin/settings/general",
        },
        {
          title: "Festival Info",
          url: "/admin/settings/festival",
        },
        {
          title: "Security",
          url: "/admin/settings/security",
        },
        {
          title: "Backup",
          url: "/admin/settings/backup",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={adminData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminData.navMain} />
        <NavProjects projects={[]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={adminData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
