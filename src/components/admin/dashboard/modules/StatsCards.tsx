"use client"

import React, { useEffect, useState } from 'react'
import { TrendingUp, Users, Activity, Eye } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getDashboardOverview } from '@/services/dashboardServices'
import { DashboardOverviewResponse } from '@/types/dashboardTypes'

export default function StatsCards() {
  const [dashboardData, setDashboardData] = useState<DashboardOverviewResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardOverview()
        setDashboardData(data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setDashboardData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!dashboardData) {
    return <div>Error loading dashboard data</div>
  }

  const stats = [
    { 
      title: "Total Users", 
      value: dashboardData.data.totalUsers.value.toLocaleString(), 
      change: typeof dashboardData.data.totalUsers.change === 'string' ? dashboardData.data.totalUsers.change : `+${dashboardData.data.totalUsers.change}%`, 
      trend: dashboardData.data.totalUsers.trend,
      icon: Users,
      color: "text-blue-600"
    },
    { 
      title: "Active Sessions", 
      value: dashboardData.data.activeSessions.value.toLocaleString(), 
      change: typeof dashboardData.data.activeSessions.change === 'string' ? dashboardData.data.activeSessions.change : `+${dashboardData.data.activeSessions.change}%`, 
      trend: dashboardData.data.activeSessions.trend,
      icon: Activity,
      color: "text-green-600"
    },
    { 
      title: "Page Views", 
      value: dashboardData.data.pageViews.value.toLocaleString(), 
      change: typeof dashboardData.data.pageViews.change === 'string' ? dashboardData.data.pageViews.change : `+${dashboardData.data.pageViews.change}%`, 
      trend: dashboardData.data.pageViews.trend,
      icon: Eye,
      color: "text-purple-600"
    },
    { 
      title: "Bounce Rate", 
      value: `${dashboardData.data.bounceRate.value}%`, 
      change: typeof dashboardData.data.bounceRate.change === 'string' ? dashboardData.data.bounceRate.change : `${dashboardData.data.bounceRate.change > 0 ? '+' : ''}${dashboardData.data.bounceRate.change}%`, 
      trend: dashboardData.data.bounceRate.trend,
      icon: TrendingUp,
      color: "text-orange-600"
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}