"use client"

import React from 'react'

// Import all dashboard components from modules
import StatsCards from './modules/StatsCards'
import ManagementWidgets from './modules/ManagementWidgets'
import ChartAreaLegend from './modules/ChartAreaLegend'
import ChartRadarGridFill from './modules/ChartRadarGridFill'
import ChartPieInteractive from './modules/ChartPieInteractive'
import ChartBarMixed from './modules/ChartBarMixed'
import OrderSummaryWidget from './modules/OrderSummaryWidget'
import ChartAreaInteractive from './modules/ChartAreaInteractive'
import QuickActions from './modules/QuickActions'

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Main Stats Cards */}
      <StatsCards />

      {/* Three Charts Row */}
      <div className="grid gap-6 md:grid-cols-3">
        <ChartAreaLegend />
        <ChartRadarGridFill />
        <ChartPieInteractive />
      </div>

      {/* Mixed Bar Chart and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartBarMixed />
        <QuickActions />
      </div>

      {/* Interactive Area Chart */}
      <ChartAreaInteractive />
    </div>
  )
}