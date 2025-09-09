"use client"

import * as React from "react"
import {
  Clapperboard,
  Calendar,
  Award,
  Home,
  FileText,
  Images,
  UserRound,
  Globe,
  Video,
  LayoutDashboard,
} from "lucide-react"
import { useToast } from "@/components/ui/custom-toast"
import { logoutUser } from "@/services/authService"
import { getMyProfile } from "@/services/userServices"
import { setCookie, getCookie } from "@/lib/cookies"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
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
import type { User } from "@/types/user-types"
import { FaUsers } from "react-icons/fa6";
import { FaAward } from "react-icons/fa";
import { title } from "process"

// Admin navigation data for film festival
const adminNavData = {
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
      icon: LayoutDashboard ,
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
      icon: FaUsers ,
      items: [
        {
          title: "All Guests",
          url: "/admin/dashboard/guests",
        },
        {
          title: "years",
          url: "/admin/dashboard/guests/year",
        }
      ]
    },
    {
      title: "Gallery",
      url: "/admin/gallery",
      icon: Images,
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
          title: "registrations",
          url: "/admin/dashboard/events/registrations"
        }
      ],
    },
    {
      title: "Users",
      url: "/admin/dashboard/users",
      icon: UserRound,
      items: [
        {
          title: "All Users",
          url: "/admin/dashboard/users",
        },
      ]
    },
    {
      title: "Videos",
      url: "/admin/dashboard/videos",
      icon: Video ,
      items: [
        {
          title: "All Videos",
          url: "/admin/dashboard/videos",
        },
        {
          title: "Add Video",
          url: "/admin/dashboard/videos/add",
        }
      ],
    },
    {
      title: "Workshops",
      url: "/admin/dashboard/workshops",
      icon: Clapperboard,
      items: [
        {
          title: "All Workshops",
          url: "/admin/dashboard/workshops"
        },
      ]
    },
    {
      title:"Home",
      url:"/admin/dashboard/home",
      icon: Home,
      items:[
        {
          title:"nominations",
          url:"/admin/dashboard/home/nominations"
        },
        {
          title:"HomeVideo",
          url:"/admin/dashboard/home/homevideo"
        }
      ]

    },
    {
      title: "Awards",
      url: "/admin/dashboard/award",
      icon: FaAward,
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
        {
          title: "submissions",
          url: "/admin/dashboard/award/submissions"
        }
      ],
    },
    
  ],
  projects: [
    {
      name: "Website Frontend",
      url: "/",
      icon: Globe,
    },
  ],
}

// User navigation data (simplified navigation for regular users)
const userNavData = {
  teams: [
    {
      name: "Arunachal Film Festival",
      logo: Clapperboard,
      plan: "User Panel",
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
        }
      ]
    },
    {
      title: "Gallery",
      url: "/admin/gallery",
      icon: Images,
      items: [
        {
          title: "All Galleries",
          url: "/admin/dashboard/gallery",
        }
      ]
    },
    {
      title: "Videos",
      url: "/admin/dashboard/videos",
      icon: Video,
      items: [
        {
          title: "All Videos",
          url: "/admin/dashboard/videos",
        }
      ],
    },
    {
      title: "Workshops",
      url: "/admin/dashboard/workshops",
      icon: Clapperboard,
      items: [
        {
          title: "All Workshops",
          url: "/admin/dashboard/workshops"
        },
      ]
    },
    {
      title: "Awards",
      url: "/admin/dashboard/award",
      icon: FaAward,
      items: [
        {
          title: "All Awards",
          url: "/admin/dashboard/award",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Website Frontend",
      url: "/",
      icon: Globe,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const { showToast } = useToast()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [sidebarData, setSidebarData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const profileResponse = await getMyProfile()
        
        if (profileResponse.success && profileResponse.data) {
          const user = profileResponse.data
          setUserData(user)
          setUserRole(user.role)
          
          // Set navigation data based on user role
          if (user.role === "admin") {
            setSidebarData(adminNavData)
          } else {
            setSidebarData(userNavData)
          }
        } else {
          // Fallback to cookie role if API fails
          const role = getCookie("userRole")
          setUserRole(role)
          
          if (role === "admin") {
            setSidebarData(adminNavData)
          } else {
            setSidebarData(userNavData)
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
        // Fallback to cookie role
        const role = getCookie("userRole")
        setUserRole(role)
        
        if (role === "admin") {
          setSidebarData(adminNavData)
        } else {
          setSidebarData(userNavData)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser()
      setCookie("userRole", "", { days: -1 })
      setCookie("token", "", { days: -1 })
      showToast("Logged out successfully", "success")
      router.replace("/login")
    } catch (error: any) {
      showToast(error?.response?.data?.message || error.message || "Logout failed", "error")
    }
  }, [router])

  if (loading || !sidebarData || !userData) {
    return null
  }

  // Create user object for NavUser component
  const userForNav = {
    name: userData.name,
    email: userData.email,
    avatar: "/placeholder.svg",
    initials: userData.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2),
    role: userData.role
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        <NavProjects projects={sidebarData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userForNav} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
