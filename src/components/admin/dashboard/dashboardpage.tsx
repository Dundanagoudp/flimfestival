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
    <div className="space-y-4 p-3 sm:space-y-6 sm:p-6">
      {/* Main Stats Cards */}
      <StatsCards />

      {/* Three Charts Row - Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <ChartAreaLegend />
        <ChartRadarGridFill />
        <ChartPieInteractive />
      </div>

      {/* Mixed Bar Chart and Quick Actions - Mobile: 1 column, Desktop: 2 columns */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <ChartBarMixed />
        <QuickActions />
      </div>

      {/* Interactive Area Chart - Full width on all devices */}
      <ChartAreaInteractive />
    </div>
  )
}