"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Thermometer,
  Droplets,
  Wind,
  Zap,
  Sun,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface SensorData {
  temperature: number
  humidity: number
  co2: number
  soilMoisture: number
  ph: number
  ec: number
  lightIntensity: number
}

interface ActivityItem {
  id: string
  type: "info" | "warning" | "success" | "error"
  message: string
  timestamp: string
  device?: string
}

export function LiveDashboard() {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 24.5,
    humidity: 68,
    co2: 420,
    soilMoisture: 75,
    ph: 6.2,
    ec: 1.8,
    lightIntensity: 45000,
  })

  const [previousData, setPreviousData] = useState<SensorData>(sensorData)
  const [aiStatus, setAiStatus] = useState(true)
  const [systemHealth, setSystemHealth] = useState(92)
  const [activeAlerts, setActiveAlerts] = useState(2)
  const [devicesOnline, setDevicesOnline] = useState(8)
  const [totalDevices] = useState(10)

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "success",
      message: "Temperature adjusted to optimal range",
      timestamp: "2 min ago",
      device: "HVAC System",
    },
    { id: "2", type: "info", message: "Nutrient pump cycle completed", timestamp: "5 min ago", device: "Pump #1" },
    { id: "3", type: "warning", message: "CO₂ levels slightly elevated", timestamp: "8 min ago", device: "CO₂ Sensor" },
    {
      id: "4",
      type: "success",
      message: "Light cycle adjusted for growth phase",
      timestamp: "12 min ago",
      device: "LED Array",
    },
    {
      id: "5",
      type: "info",
      message: "Daily backup completed successfully",
      timestamp: "1 hour ago",
      device: "System",
    },
  ])

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPreviousData(sensorData)
      setSensorData((prev) => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 0.5,
        humidity: Math.max(40, Math.min(90, prev.humidity + (Math.random() - 0.5) * 2)),
        co2: Math.max(300, Math.min(600, prev.co2 + (Math.random() - 0.5) * 10)),
        soilMoisture: Math.max(50, Math.min(90, prev.soilMoisture + (Math.random() - 0.5) * 2)),
        ph: Math.max(5.5, Math.min(7.5, prev.ph + (Math.random() - 0.5) * 0.1)),
        ec: Math.max(1.0, Math.min(2.5, prev.ec + (Math.random() - 0.5) * 0.1)),
        lightIntensity: Math.max(30000, Math.min(60000, prev.lightIntensity + (Math.random() - 0.5) * 1000)),
      }))

      // Update system metrics occasionally
      if (Math.random() > 0.7) {
        setSystemHealth((prev) => Math.max(85, Math.min(100, prev + (Math.random() - 0.5) * 5)))
        setActiveAlerts((prev) => Math.max(0, Math.min(5, prev + (Math.random() > 0.8 ? 1 : -1))))
        setDevicesOnline((prev) =>
          Math.max(6, Math.min(totalDevices, prev + (Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
        )
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [sensorData, totalDevices])

  const getTrendIcon = (current: number, previous: number) => {
    const diff = current - previous
    if (Math.abs(diff) < 0.1) return <Minus className="h-3 w-3 text-gray-500" />
    return diff > 0 ? (
      <TrendingUp className="h-3 w-3 text-green-500" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-500" />
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  const sensorCards = [
    {
      title: "Temperature",
      value: `${sensorData.temperature.toFixed(1)}°C`,
      icon: Thermometer,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      target: "22-26°C",
      status: sensorData.temperature >= 22 && sensorData.temperature <= 26 ? "optimal" : "warning",
      trend: getTrendIcon(sensorData.temperature, previousData.temperature),
    },
    {
      title: "Humidity",
      value: `${sensorData.humidity.toFixed(0)}%`,
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      target: "60-80%",
      status: sensorData.humidity >= 60 && sensorData.humidity <= 80 ? "optimal" : "warning",
      trend: getTrendIcon(sensorData.humidity, previousData.humidity),
    },
    {
      title: "CO₂",
      value: `${sensorData.co2.toFixed(0)} ppm`,
      icon: Wind,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      target: "400-500 ppm",
      status: sensorData.co2 >= 400 && sensorData.co2 <= 500 ? "optimal" : "warning",
      trend: getTrendIcon(sensorData.co2, previousData.co2),
    },
    {
      title: "Soil Moisture",
      value: `${sensorData.soilMoisture.toFixed(0)}%`,
      icon: Droplets,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
      target: "70-85%",
      status: sensorData.soilMoisture >= 70 && sensorData.soilMoisture <= 85 ? "optimal" : "warning",
      trend: getTrendIcon(sensorData.soilMoisture, previousData.soilMoisture),
    },
    {
      title: "pH Level",
      value: sensorData.ph.toFixed(1),
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      target: "6.0-6.5",
      status: sensorData.ph >= 6.0 && sensorData.ph <= 6.5 ? "optimal" : "warning",
      trend: getTrendIcon(sensorData.ph, previousData.ph),
    },
    {
      title: "EC Level",
      value: `${sensorData.ec.toFixed(1)} mS/cm`,
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      target: "1.5-2.0",
      status: sensorData.ec >= 1.5 && sensorData.ec <= 2.0 ? "optimal" : "warning",
      trend: getTrendIcon(sensorData.ec, previousData.ec),
    },
    {
      title: "Light Intensity",
      value: `${(sensorData.lightIntensity / 1000).toFixed(0)}k lux`,
      icon: Sun,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      target: "40-50k lux",
      status: sensorData.lightIntensity >= 40000 && sensorData.lightIntensity <= 50000 ? "optimal" : "warning",
      trend: getTrendIcon(sensorData.lightIntensity, previousData.lightIntensity),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">System Health</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans text-green-600">{systemHealth.toFixed(0)}%</div>
            <Progress value={systemHealth} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1 font-sans">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">Active Alerts</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${activeAlerts > 0 ? "text-yellow-600" : "text-gray-400"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold font-sans ${activeAlerts > 0 ? "text-yellow-600" : "text-green-600"}`}>
              {activeAlerts}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-sans">
              {activeAlerts === 0 ? "No active alerts" : `${activeAlerts} alert${activeAlerts > 1 ? "s" : ""} pending`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">Devices Online</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans text-blue-600">
              {devicesOnline}/{totalDevices}
            </div>
            <Progress value={(devicesOnline / totalDevices) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1 font-sans">
              {devicesOnline === totalDevices ? "All devices connected" : `${totalDevices - devicesOnline} offline`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">AI Status</CardTitle>
            <div className={`h-2 w-2 rounded-full ${aiStatus ? "bg-green-500" : "bg-red-500"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold font-sans ${aiStatus ? "text-green-600" : "text-red-600"}`}>
              {aiStatus ? "Active" : "Offline"}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-sans">
              {aiStatus ? "Monitoring & optimizing" : "Manual control active"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sensorCards.map((sensor) => (
          <Card key={sensor.title} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-sans">{sensor.title}</CardTitle>
              <div className={`p-2 rounded-lg ${sensor.bgColor}`}>
                <sensor.icon className={`h-4 w-4 ${sensor.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold font-sans">{sensor.value}</div>
                {sensor.trend}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground font-sans">Target: {sensor.target}</p>
                <Badge variant={sensor.status === "optimal" ? "default" : "destructive"} className="text-xs font-sans">
                  {sensor.status === "optimal" ? "Optimal" : "Warning"}
                </Badge>
              </div>
              {sensor.status === "warning" && (
                <div className="absolute top-2 right-2">
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Recent Activity</CardTitle>
            <CardDescription className="font-sans">Latest system events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium font-sans">{activity.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground font-sans">{activity.device}</p>
                      <p className="text-xs text-muted-foreground font-sans">{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Quick Actions</CardTitle>
            <CardDescription className="font-sans">Immediate controls for critical adjustments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                className="font-sans bg-transparent h-12 flex flex-col items-center justify-center"
              >
                <AlertTriangle className="h-4 w-4 mb-1" />
                Emergency Stop
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="font-sans bg-transparent h-12 flex flex-col items-center justify-center"
              >
                <Wind className="h-4 w-4 mb-1" />
                Boost Ventilation
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="font-sans bg-transparent h-12 flex flex-col items-center justify-center"
              >
                <Sun className="h-4 w-4 mb-1" />
                Adjust Lighting
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="font-sans bg-transparent h-12 flex flex-col items-center justify-center"
              >
                <Droplets className="h-4 w-4 mb-1" />
                Water Plants
              </Button>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button className="w-full font-sans" variant="default">
                View All Controls
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
