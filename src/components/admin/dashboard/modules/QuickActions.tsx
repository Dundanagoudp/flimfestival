"use client"

import React, { useEffect, useState } from 'react'
import { Calendar, Film, BarChart3, Award } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getDashboardQuickActions } from '@/services/dashboardServices'
import { DashboardQuickAction } from '@/types/dashboardTypes'

export default function QuickActions() {
  const [actions, setActions] = useState<DashboardQuickAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuickActions = async () => {
      try {
        const data = await getDashboardQuickActions()
        // Handle both response formats
        if (Array.isArray(data)) {
          setActions(data)
        } else if (data.data) {
          setActions(data.data)
        } else {
          // If no data, use fallback
          setActions([
            { title: "Add New Event", description: "Create a new festival event", icon: "calendar", route: "/events/create", order: 1 },
            { title: "Manage Submissions", description: "Review film submissions", icon: "film", route: "/submissions", order: 2 },
            { title: "View Analytics", description: "Check detailed reports", icon: "chart-bar", route: "/analytics", order: 3 },
            { title: "Award Management", description: "Manage awards and categories", icon: "award", route: "/awards", order: 4 },
          ])
        }
      } catch (error) {
        console.error('Error fetching quick actions:', error)
        setActions([])
      } finally {
        setLoading(false)
      }
    }

    fetchQuickActions()
  }, [])

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'calendar':
        return Calendar
      case 'film':
        return Film
      case 'chart-bar':
        return BarChart3
      case 'award':
        return Award
      default:
        return Calendar
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Loading actions...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions
          .sort((a, b) => a.order - b.order)
          .map((action, index) => {
            const IconComponent = getIconComponent(action.icon)
            return (
              <div 
                key={index} 
                className="flex items-center justify-between rounded-lg border p-2 sm:p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  // You can add navigation logic here
                  console.log('Navigate to:', action.route)
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">{action.title}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{action.description}</p>
                </div>
                <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}