"use client"

import React from 'react'
import { BarChart3, CheckCircle, Clock, XCircle, Users, Award } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ManagementWidgets() {
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