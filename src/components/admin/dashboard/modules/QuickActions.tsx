"use client"

import React from 'react'
import { Calendar, Film, BarChart3, Award } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function QuickActions() {
  const actions = [
    { title: "Add New Event", description: "Create a new festival event", icon: Calendar },
    { title: "Manage Submissions", description: "Review film submissions", icon: Film },
    { title: "View Analytics", description: "Check detailed reports", icon: BarChart3 },
    { title: "Award Management", description: "Manage awards and categories", icon: Award },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action, index) => {
          const IconComponent = action.icon
          return (
            <div key={index} className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50 cursor-pointer transition-colors">
              <div>
                <p className="font-medium">{action.title}</p>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}