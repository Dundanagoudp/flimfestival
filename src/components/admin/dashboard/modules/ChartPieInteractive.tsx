"use client"

import React, { useEffect, useState } from 'react'
import { Label, Pie, PieChart as RechartsPieChart, Sector } from "recharts"
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
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getDashboardPieChart } from '@/services/dashboardServices'
import { DashboardPieChartResponse } from '@/types/dashboardTypes'

export default function ChartPieInteractive() {
  const id = "pie-interactive"
  const [chartData, setChartData] = useState<DashboardPieChartResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("")

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getDashboardPieChart()
        setChartData(data)
        if (data.data.labels.length > 0) {
          setActiveCategory(data.data.labels[0].toLowerCase())
        }
      } catch (error) {
        console.error('Error fetching pie chart data:', error)
        setChartData(null)
        setActiveCategory("")
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
    shortfilm: {
      label: "Short Film",
      color: "var(--chart-1)",
    },
    documentary: {
      label: "Documentary",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  // Transform API data to chart format - always call hooks at the top level
  const pieData = React.useMemo(() => {
    if (!chartData) return []
    return chartData.data.labels.map((label, index) => ({
      category: label.toLowerCase().replace(/\s+/g, ''),
      count: chartData.data.datasets[0]?.data[index] || 0,
      fill: `var(--color-${label.toLowerCase().replace(/\s+/g, '')})`,
    }))
  }, [chartData])

  const activeIndex = React.useMemo(
    () => pieData.findIndex((item) => item.category === activeCategory),
    [activeCategory, pieData]
  )
  
  const categories = React.useMemo(() => pieData.map((item) => item.category), [pieData])

  if (loading) {
    return (
      <Card data-chart={id} className="flex flex-col">
        <CardHeader className="flex-row items-start space-y-0 pb-0">
          <div className="grid gap-1">
            <CardTitle>Genre Distribution</CardTitle>
            <CardDescription>Loading chart data...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 justify-center pb-0">
          <div className="mx-auto aspect-square w-full max-w-[200px] bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (!chartData) {
    return (
      <Card data-chart={id} className="flex flex-col">
        <CardHeader className="flex-row items-start space-y-0 pb-0">
          <div className="grid gap-1">
            <CardTitle>Genre Distribution</CardTitle>
            <CardDescription>Error loading chart data</CardDescription>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Genre Distribution</CardTitle>
          <CardDescription>{chartData.period || "Current Month"}</CardDescription>
        </div>
        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {categories.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig]

              if (!config) {
                return null
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[200px]"
        >
          <RechartsPieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={pieData}
              dataKey="count"
              nameKey="category"
              innerRadius={40}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 20}
                    innerRadius={outerRadius + 8}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {pieData[activeIndex]?.count.toLocaleString() || 0}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-sm"
                        >
                          Titles
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </RechartsPieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}