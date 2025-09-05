"use client"

import * as React from "react"
import {
  Clapperboard,
  Calendar,
  Award,
  Home,
  FileText,
  Images,
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
import { title } from "process"

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
    title: "Blogs",
    url: "/admin/blogs",
    icon: FileText,
    items: [
      {
        title: "All Blogs",
        url: "/admin/dashboard/blog",
      },
      {
        title: "Add Blog",
        url: "/admin/dashboard/blog/add",
      },
      {
        title: "Categories",
        url: "/admin/dashboard/blog/category",
      },
    ]
  }, 
  {
    title: "Guests",
    url: "/admin/guests",
    icon: Clapperboard,
    items: [
      {
        title: "All Guests",
        url: "/admin/dashboard/blogs/guests",
      },
      {
        title: "years",
        url: "/admin/dashboard/blogs/guests/year",
      }
    ]
  },
    {
    title: "Gallery",
    url: "/admin/gallery",
    icon: Images ,
    items: [
      {
        title: "All Galleries",
        url: "/admin/dashboard/gallery",
      },
      {
        title: "Add Gallery",
        url: "/admin/dashboard/gallery/add",
      }
    ]
  },
    {
      title: "Events",
      url: "/admin/events",
      icon: Calendar,
      items: [
        {
          title: "All Events",
          url: "/admin/dashboard/events",
        },
           {
          title: "Create Event",
          url: "/admin/dashboard/events/create",
        },
        {
          title: "Add Time Slot",
          url: "/admin/dashboard/events/add-time",
        },
                {
          title:"registrations",
          url:"/admin/dashboard/events/registrations"
        }
        
      ],
    },
    {
      title: "Awards",
      url: "/admin/dashboard/award",
      icon: Award,
      items: [
        {
          title: "All Awards",
          url: "/admin/dashboard/award",
        },
        {
          title: "Add Award",
          url: "/admin/dashboard/award/add",
        },
        {
          title: "Categories",
          url: "/admin/dashboard/award/categories",
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
