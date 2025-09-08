"use client"

import React, { useEffect, useState } from 'react'
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
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
import { getDashboardBarChart } from '@/services/dashboardServices'
import { DashboardChartResponse } from '@/types/dashboardTypes'

export default function ChartBarMixed() {
  const [chartData, setChartData] = useState<DashboardChartResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getDashboardBarChart()
        setChartData(data)
      } catch (error) {
        console.error('Error fetching bar chart data:', error)
        setChartData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  const chartConfig = {
    count: {
      label: "Count",
    },
    blogs: {
      label: "Blogs",
      color: "var(--chart-1)",
    },
    submissions: {
      label: "Submissions",
      color: "var(--chart-2)",
    },
    events: {
      label: "Events",
      color: "var(--chart-3)",
    },
    awards: {
      label: "Awards",
      color: "var(--chart-4)",
    },
    guests: {
      label: "Guests",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (!chartData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Error loading chart data</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Transform API data to chart format
  const transformedData = chartData.data.labels.map((label, index) => ({
    category: label.toLowerCase(),
    count: chartData.data.datasets[0]?.data[index] || 0,
    fill: `var(--color-${label.toLowerCase()})`,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>{chartData.period || "January - June 2024"}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px]">
          <BarChart
            accessibilityLayer
            data={transformedData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label || value
              }
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {chartData.trend && (
            <>
              Trending {chartData.trend} this month <TrendingUp className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing content distribution across categories
        </div>
      </CardFooter>
    </Card>
  )
}