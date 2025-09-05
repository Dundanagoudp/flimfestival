"use client"

import React from 'react'
import { TrendingUp, Users, Calendar, Film, Award, Eye, BarChart3, PieChart, Activity, Clock, CheckCircle, XCircle } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Stats Cards Component
function StatsCards() {
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

// Order Status Cards


// Management Widgets
function ManagementWidgets() {
  const employeeStats = [
    { label: "Total Employees", value: "57,984+", icon: Users, color: "text-blue-600" },
    { label: "Active", value: "99,999+", icon: CheckCircle, color: "text-green-600" },
    { label: "Suspend", value: "57,984+", icon: Clock, color: "text-yellow-600" },
    { label: "Deactivated", value: "57,984+", icon: XCircle, color: "text-red-600" },
  ]

  const dealerStats = [
    { label: "Top Dealer", value: "500", icon: Award, color: "text-blue-600" },
    { label: "Active", value: "1000", icon: CheckCircle, color: "text-green-600" },
    { label: "Suspend", value: "100", icon: Clock, color: "text-yellow-600" },
    { label: "Deactivated", value: "50", icon: XCircle, color: "text-red-600" },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Employee Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Employee Management
            <BarChart3 className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {employeeStats.map((stat, index) => {
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

      {/* Dealer Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Dealer Management
            <BarChart3 className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dealerStats.map((stat, index) => {
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

// Customer and Return Rate Widgets
function CustomerWidgets() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Customer Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Customer Management
            <Users className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">2,917</div>
            <div className="flex items-center justify-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">7.2%</span>
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-green-500 rounded-full w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Return Rate
            <TrendingUp className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">2,917</div>
            <div className="flex items-center justify-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">7.2%</span>
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Product Management Widget
function ProductManagementWidget() {
  const productStats = [
    { label: "APPROVED", value: "1,500", color: "bg-purple-500" },
    { label: "PENDING", value: "1,200", color: "bg-green-500" },
    { label: "CREATED", value: "800", color: "bg-orange-500" },
    { label: "REJECTED", value: "486", color: "bg-red-500" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Management</CardTitle>
        <CardDescription>Product status distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-2xl font-bold">3,986 PRODUCTS</div>
        </div>
        
        {/* Simple donut representation */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full border-8 border-purple-500"></div>
            <div className="absolute inset-0 rounded-full border-8 border-green-500 border-t-transparent"></div>
            <div className="absolute inset-0 rounded-full border-8 border-orange-500 border-t-transparent border-r-transparent"></div>
            <div className="absolute inset-0 rounded-full border-8 border-red-500 border-t-transparent border-r-transparent border-b-transparent"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {productStats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              <span className="text-sm font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Order Summary Widget with Interactive Area Chart
function OrderSummaryWidget() {
  const [timeRange, setTimeRange] = React.useState("30d")

  const chartData = [
    { date: "2024-04-01", desktop: 222, mobile: 150 },
    { date: "2024-04-02", desktop: 97, mobile: 180 },
    { date: "2024-04-03", desktop: 167, mobile: 120 },
    { date: "2024-04-04", desktop: 242, mobile: 260 },
    { date: "2024-04-05", desktop: 373, mobile: 290 },
    { date: "2024-04-06", desktop: 301, mobile: 340 },
    { date: "2024-04-07", desktop: 245, mobile: 180 },
    { date: "2024-04-08", desktop: 409, mobile: 320 },
    { date: "2024-04-09", desktop: 59, mobile: 110 },
    { date: "2024-04-10", desktop: 261, mobile: 190 },
    { date: "2024-04-11", desktop: 327, mobile: 350 },
    { date: "2024-04-12", desktop: 292, mobile: 210 },
    { date: "2024-04-13", desktop: 342, mobile: 380 },
    { date: "2024-04-14", desktop: 137, mobile: 220 },
    { date: "2024-04-15", desktop: 120, mobile: 170 },
    { date: "2024-04-16", desktop: 138, mobile: 190 },
    { date: "2024-04-17", desktop: 446, mobile: 360 },
    { date: "2024-04-18", desktop: 364, mobile: 410 },
    { date: "2024-04-19", desktop: 243, mobile: 180 },
    { date: "2024-04-20", desktop: 89, mobile: 150 },
    { date: "2024-04-21", desktop: 137, mobile: 200 },
    { date: "2024-04-22", desktop: 224, mobile: 170 },
    { date: "2024-04-23", desktop: 138, mobile: 230 },
    { date: "2024-04-24", desktop: 387, mobile: 290 },
    { date: "2024-04-25", desktop: 215, mobile: 250 },
    { date: "2024-04-26", desktop: 75, mobile: 130 },
    { date: "2024-04-27", desktop: 383, mobile: 420 },
    { date: "2024-04-28", desktop: 122, mobile: 180 },
    { date: "2024-04-29", desktop: 315, mobile: 240 },
    { date: "2024-04-30", desktop: 454, mobile: 380 },
  ]

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
    },
  }

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-04-30")
    let daysToSubtract = 30
    if (timeRange === "7d") {
      daysToSubtract = 7
    } else if (timeRange === "14d") {
      daysToSubtract = 14
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Order Summary Widget</CardTitle>
          <CardDescription>+20% Than last week</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="14d" className="rounded-lg">
              Last 14 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="aspect-auto h-[250px] w-full">
          {/* Simple area chart representation without recharts */}
          <div className="h-full bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4">
            <div className="flex items-end justify-between h-full">
              {filteredData.slice(-7).map((item, index) => {
                const maxValue = Math.max(...filteredData.map(d => d.desktop + d.mobile))
                const desktopHeight = (item.desktop / maxValue) * 120
                const mobileHeight = (item.mobile / maxValue) * 120
                const date = new Date(item.date)
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className="flex flex-col items-end">
                      <div 
                        className="bg-blue-500 rounded-t w-3 mb-1"
                        style={{ height: `${desktopHeight}px` }}
                      ></div>
                      <div 
                        className="bg-orange-500 rounded-t w-3"
                        style={{ height: `${mobileHeight}px` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground mt-2">
                      {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm">Desktop</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-sm">Mobile</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Quick Actions
function QuickActions() {
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

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your film festival management dashboard
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search Spare parts" 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Filters</button>
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Date
        </button>
      </div>

      {/* Order Status Cards */}
      {/* <OrderStatusCards /> */}

      {/* Main Stats Cards */}
      <StatsCards />

      {/* Management Widgets */}
      <ManagementWidgets />

      {/* Customer and Return Rate Widgets */}
      <CustomerWidgets />

      {/* Product Management and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <ProductManagementWidget />
        <QuickActions />
      </div>

      {/* Order Summary Widget */}
      <OrderSummaryWidget />
    </div>
  )
}