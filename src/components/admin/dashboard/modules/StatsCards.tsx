"use client"

import React from 'react'
import { TrendingUp, Users, Activity, Eye } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function StatsCards() {
  const stats = [
    { 
      title: "Total Users", 
      value: "2,847", 
      change: "+12.5%", 
      trend: "up",
      icon: Users,
      color: "text-blue-600"
    },
    { 
      title: "Active Sessions", 
      value: "1,234", 
      change: "+8.2%", 
      trend: "up",
      icon: Activity,
      color: "text-green-600"
    },
    { 
      title: "Page Views", 
      value: "45,678", 
      change: "+15.3%", 
      trend: "up",
      icon: Eye,
      color: "text-purple-600"
    },
    { 
      title: "Bounce Rate", 
      value: "23.4%", 
      change: "-2.1%", 
      trend: "down",
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