"use client"

import React, { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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

export default function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartData, setChartData] = useState<DashboardChartResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        console.log('Fetching area chart data...')
        const data = await getDashboardAreaChart()
        console.log('Area chart API response:', data)
        setChartData(data)
      } catch (error) {
        console.error('Error fetching area chart data:', error)
        console.error('Error details:', error)
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
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Area Chart - Interactive</CardTitle>
            <CardDescription>Loading chart data...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="aspect-auto h-[200px] w-full bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (!chartData) {
    return (
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Area Chart - Interactive</CardTitle>
            <CardDescription>Error loading chart data</CardDescription>
          </div>
        </CardHeader>
      </Card>
    )
  }

  // Transform API data to chart format
  const transformedData = chartData.data.labels.map((label, index) => ({
    date: label,
    submissions: chartData.data.datasets[0]?.data[index] || 0,
    registrations: chartData.data.datasets[1]?.data[index] || 0,
  }))

  // Debug: Log the data to see what we're getting
  console.log('ChartAreaInteractive - chartData:', chartData)
  console.log('ChartAreaInteractive - transformedData:', transformedData)
  console.log('ChartAreaInteractive - labels:', chartData.data.labels)
  console.log('ChartAreaInteractive - datasets:', chartData.data.datasets)

  // For month-based data, just show all data regardless of time range filter
  const filteredData = transformedData

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing submissions and registrations for the last 6 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="14d" className="rounded-lg">
              Last 14 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillSubmissions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-submissions)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-submissions)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRegistrations" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-registrations)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-registrations)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return value.slice(0, 3)
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return value
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="registrations"
              type="natural"
              fill="url(#fillRegistrations)"
              stroke="var(--color-registrations)"
              stackId="a"
            />
            <Area
              dataKey="submissions"
              type="natural"
              fill="url(#fillSubmissions)"
              stroke="var(--color-submissions)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}