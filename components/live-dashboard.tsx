"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Thermometer, Droplets, Wind, Zap, Sun, Activity, AlertTriangle } from "lucide-react"

interface SensorData {
  temperature: number
  humidity: number
  co2: number
  soilMoisture: number
  ph: number
  ec: number
  lightIntensity: number
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
  const [aiStatus, setAiStatus] = useState(true)
  const [lastDecision, setLastDecision] = useState("Increased humidity to 70% - Temperature rising")

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData((prev) => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 0.5,
        humidity: Math.max(40, Math.min(90, prev.humidity + (Math.random() - 0.5) * 2)),
        co2: Math.max(300, Math.min(600, prev.co2 + (Math.random() - 0.5) * 10)),
        soilMoisture: Math.max(50, Math.min(90, prev.soilMoisture + (Math.random() - 0.5) * 2)),
        ph: Math.max(5.5, Math.min(7.5, prev.ph + (Math.random() - 0.5) * 0.1)),
        ec: Math.max(1.0, Math.min(2.5, prev.ec + (Math.random() - 0.5) * 0.1)),
        lightIntensity: Math.max(30000, Math.min(60000, prev.lightIntensity + (Math.random() - 0.5) * 1000)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const sensorCards = [
    {
      title: "Temperature",
      value: `${sensorData.temperature.toFixed(1)}°C`,
      icon: Thermometer,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      target: "22-26°C",
      status: sensorData.temperature >= 22 && sensorData.temperature <= 26 ? "optimal" : "warning",
    },
    {
      title: "Humidity",
      value: `${sensorData.humidity.toFixed(0)}%`,
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      target: "60-80%",
      status: sensorData.humidity >= 60 && sensorData.humidity <= 80 ? "optimal" : "warning",
    },
    {
      title: "CO₂",
      value: `${sensorData.co2.toFixed(0)} ppm`,
      icon: Wind,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      target: "400-500 ppm",
      status: sensorData.co2 >= 400 && sensorData.co2 <= 500 ? "optimal" : "warning",
    },
    {
      title: "Soil Moisture",
      value: `${sensorData.soilMoisture.toFixed(0)}%`,
      icon: Droplets,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
      target: "70-85%",
      status: sensorData.soilMoisture >= 70 && sensorData.soilMoisture <= 85 ? "optimal" : "warning",
    },
    {
      title: "pH Level",
      value: sensorData.ph.toFixed(1),
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      target: "6.0-6.5",
      status: sensorData.ph >= 6.0 && sensorData.ph <= 6.5 ? "optimal" : "warning",
    },
    {
      title: "EC Level",
      value: `${sensorData.ec.toFixed(1)} mS/cm`,
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      target: "1.5-2.0",
      status: sensorData.ec >= 1.5 && sensorData.ec <= 2.0 ? "optimal" : "warning",
    },
    {
      title: "Light Intensity",
      value: `${(sensorData.lightIntensity / 1000).toFixed(0)}k lux`,
      icon: Sun,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      target: "40-50k lux",
      status: sensorData.lightIntensity >= 40000 && sensorData.lightIntensity <= 50000 ? "optimal" : "warning",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Sensor Data Grid */}
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
              <div className="text-2xl font-bold font-sans">{sensor.value}</div>
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Quick Actions</CardTitle>
          <CardDescription className="font-sans">Immediate controls for critical adjustments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="font-sans bg-transparent">
              Emergency Stop
            </Button>
            <Button variant="outline" size="sm" className="font-sans bg-transparent">
              Increase Ventilation
            </Button>
            <Button variant="outline" size="sm" className="font-sans bg-transparent">
              Boost Lighting
            </Button>
            <Button variant="outline" size="sm" className="font-sans bg-transparent">
              Water Plants
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
