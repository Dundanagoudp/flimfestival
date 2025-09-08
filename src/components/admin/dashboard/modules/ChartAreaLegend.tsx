"use client"

import React, { useEffect, useState } from 'react'
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getDashboardAreaChart } from '@/services/dashboardServices'
import { DashboardChartResponse } from '@/types/dashboardTypes'

export default function ChartAreaLegend() {
  const [chartData, setChartData] = useState<DashboardChartResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getDashboardAreaChart()
        setChartData(data)
      } catch (error) {
        console.error('Error fetching area chart data:', error)
        setChartData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  const chartConfig = {
    submissions: {
      label: "Submissions",
      color: "var(--chart-1)",
    },
    registrations: {
      label: "Registrations",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Submissions vs Registrations</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (!chartData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Submissions vs Registrations</CardTitle>
          <CardDescription>Error loading chart data</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Transform API data to chart format
  const transformedData = chartData.data.labels.map((label, index) => ({
    month: label,
    submissions: chartData.data.datasets[0]?.data[index] || 0,
    registrations: chartData.data.datasets[1]?.data[index] || 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submissions vs Registrations</CardTitle>
        <CardDescription>
          Showing submissions and registrations for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px]">
          <AreaChart
            accessibilityLayer
            data={transformedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="registrations"
              type="natural"
              fill="var(--color-registrations)"
              fillOpacity={0.4}
              stroke="var(--color-registrations)"
              stackId="a"
            />
            <Area
              dataKey="submissions"
              type="natural"
              fill="var(--color-submissions)"
              fillOpacity={0.4}
              stroke="var(--color-submissions)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
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
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}