"use client"

import React, { useEffect, useState } from 'react'
import { BarChart3, CheckCircle, Clock, XCircle, Users, Award, FileText, Calendar, Trophy, UserCheck } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getDashboardOverview } from '@/services/dashboardServices'
import { DashboardOverviewResponse } from '@/types/dashboardTypes'

export default function ManagementWidgets() {
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
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!dashboardData) {
    return <div>Error loading dashboard data</div>
  }

  const contentStats = [
    { label: "Total Blogs", value: dashboardData.stats.totalBlogs.toLocaleString(), icon: FileText, color: "text-blue-600" },
    { label: "Total Events", value: dashboardData.stats.totalEvents.toLocaleString(), icon: Calendar, color: "text-green-600" },
    { label: "Total Awards", value: dashboardData.stats.totalAwards.toLocaleString(), icon: Trophy, color: "text-yellow-600" },
    { label: "Total Guests", value: dashboardData.stats.totalGuests.toLocaleString(), icon: UserCheck, color: "text-purple-600" },
  ]

  const submissionStats = [
    { label: "Total Submissions", value: dashboardData.stats.totalSubmissions.toLocaleString(), icon: FileText, color: "text-blue-600" },
    { label: "Total Registrations", value: dashboardData.stats.totalRegistrations.toLocaleString(), icon: CheckCircle, color: "text-green-600" },
    { label: "Active Users", value: dashboardData.data.activeSessions.value.toLocaleString(), icon: Users, color: "text-yellow-600" },
    { label: "Page Views", value: dashboardData.data.pageViews.value.toLocaleString(), icon: BarChart3, color: "text-purple-600" },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Content Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Content Management
            <BarChart3 className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contentStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <span className="text-sm font-bold">{stat.value}</span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Activity Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Activity Management
            <BarChart3 className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {submissionStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <span className="text-sm font-bold">{stat.value}</span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}