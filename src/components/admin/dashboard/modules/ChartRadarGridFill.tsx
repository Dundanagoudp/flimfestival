"use client"

import React, { useEffect, useState } from 'react'
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getDashboardRadarChart } from '@/services/dashboardServices'
import { DashboardRadarChartResponse } from '@/types/dashboardTypes'

export default function ChartRadarGridFill() {
  const [chartData, setChartData] = useState<DashboardRadarChartResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getDashboardRadarChart()
        setChartData(data)
      } catch (error) {
        console.error('Error fetching radar chart data:', error)
        setChartData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  const chartConfig = {
    contentCreated: {
      label: "Content Created",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  if (loading) {
    return (
      <Card>
        <CardHeader className="items-center pb-4">
          <CardTitle>Radar Chart - Grid Filled</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <div className="mx-auto aspect-square max-h-[200px] bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (!chartData) {
    return (
      <Card>
        <CardHeader className="items-center pb-4">
          <CardTitle>Radar Chart - Grid Filled</CardTitle>
          <CardDescription>Error loading chart data</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Transform API data to chart format
  const transformedData = chartData.data.labels.map((label, index) => ({
    month: label,
    contentCreated: chartData.data.datasets[0]?.data[index] || 0,
  }))

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Radar Chart - Grid Filled</CardTitle>
        <CardDescription>
          Showing content creation for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <RadarChart data={transformedData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid className="fill-(--color-contentCreated) opacity-20" />
            <PolarAngleAxis dataKey="month" />
            <Radar
              dataKey="contentCreated"
              fill="var(--color-contentCreated)"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {chartData.trend && (
            <>
              Trending {chartData.trend} this month <TrendingUp className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          {chartData.period || "January - June 2024"}
        </div>
      </CardFooter>
    </Card>
  )
}