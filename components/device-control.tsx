"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Fan,
  Droplets,
  Thermometer,
  Zap,
  Sun,
  Play,
  Pause,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

interface Device {
  id: string
  name: string
  type: string
  status: "on" | "off" | "auto"
  power: number
  icon: any
  color: string
  bgColor: string
  setpoint?: number
  unit?: string
  min?: number
  max?: number
}

interface User {
  role: string
}

export function DeviceControl() {
  const [user, setUser] = useState<User | null>(null)
  const [aiOverride, setAiOverride] = useState(false)
  const [overrideTimer, setOverrideTimer] = useState(15)
  const [timeRemaining, setTimeRemaining] = useState(0)

  const [devices, setDevices] = useState<Device[]>([
    {
      id: "fan1",
      name: "Exhaust Fan 1",
      type: "ventilation",
      status: "auto",
      power: 65,
      icon: Fan,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      setpoint: 70,
      unit: "%",
      min: 0,
      max: 100,
    },
    {
      id: "fan2",
      name: "Circulation Fan",
      type: "ventilation",
      status: "on",
      power: 45,
      icon: Fan,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      setpoint: 50,
      unit: "%",
      min: 0,
      max: 100,
    },
    {
      id: "humidifier",
      name: "Humidifier",
      type: "climate",
      status: "auto",
      power: 80,
      icon: Droplets,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
      setpoint: 75,
      unit: "%",
      min: 40,
      max: 90,
    },
    {
      id: "heater",
      name: "Space Heater",
      type: "climate",
      status: "off",
      power: 0,
      icon: Thermometer,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      setpoint: 24,
      unit: "°C",
      min: 18,
      max: 30,
    },
    {
      id: "pump1",
      name: "Nutrient Pump A",
      type: "irrigation",
      status: "auto",
      power: 100,
      icon: Zap,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      setpoint: 2.0,
      unit: "L/min",
      min: 0.5,
      max: 5.0,
    },
    {
      id: "pump2",
      name: "Nutrient Pump B",
      type: "irrigation",
      status: "off",
      power: 0,
      icon: Zap,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      setpoint: 1.5,
      unit: "L/min",
      min: 0.5,
      max: 5.0,
    },
    {
      id: "lights1",
      name: "LED Grow Lights Zone 1",
      type: "lighting",
      status: "on",
      power: 85,
      icon: Sun,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      setpoint: 90,
      unit: "%",
      min: 0,
      max: 100,
    },
    {
      id: "lights2",
      name: "LED Grow Lights Zone 2",
      type: "lighting",
      status: "auto",
      power: 75,
      icon: Sun,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      setpoint: 80,
      unit: "%",
      min: 0,
      max: 100,
    },
  ])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (aiOverride && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setAiOverride(false)
            return 0
          }
          return prev - 1
        })
      }, 60000) // Update every minute
    }
    return () => clearInterval(interval)
  }, [aiOverride, timeRemaining])

  const handleDeviceToggle = (deviceId: string) => {
    if (user?.role === "Viewer") return

    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              status: device.status === "off" ? "on" : "off",
              power: device.status === "off" ? device.setpoint || 50 : 0,
            }
          : device,
      ),
    )
  }

  const handleStatusChange = (deviceId: string, newStatus: "on" | "off" | "auto") => {
    if (user?.role === "Viewer") return

    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              status: newStatus,
              power: newStatus === "off" ? 0 : newStatus === "on" ? device.setpoint || 50 : device.power,
            }
          : device,
      ),
    )
  }

  const handlePowerChange = (deviceId: string, newPower: number[]) => {
    if (user?.role === "Viewer") return

    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              power: newPower[0],
              status: newPower[0] === 0 ? "off" : "on",
            }
          : device,
      ),
    )
  }

  const handleSetpointChange = (deviceId: string, newSetpoint: number) => {
    if (user?.role === "Viewer") return

    setDevices((prev) => prev.map((device) => (device.id === deviceId ? { ...device, setpoint: newSetpoint } : device)))
  }

  const handleAiOverride = () => {
    if (user?.role === "Viewer") return

    setAiOverride(!aiOverride)
    if (!aiOverride) {
      setTimeRemaining(overrideTimer)
    } else {
      setTimeRemaining(0)
    }
  }

  const devicesByType = {
    ventilation: devices.filter((d) => d.type === "ventilation"),
    climate: devices.filter((d) => d.type === "climate"),
    irrigation: devices.filter((d) => d.type === "irrigation"),
    lighting: devices.filter((d) => d.type === "lighting"),
  }

  const isReadOnly = user?.role === "Viewer"

  return (
    <div className="space-y-6">
      {/* AI Override Control */}
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans">
            <Settings className="h-5 w-5" />
            AI Automation Override
          </CardTitle>
          <CardDescription className="font-sans">Temporarily disable AI automation for manual control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Switch
                checked={aiOverride}
                onCheckedChange={handleAiOverride}
                disabled={isReadOnly}
                className="data-[state=checked]:bg-orange-600"
              />
              <div>
                <Label className="font-sans font-medium">Manual Override</Label>
                <p className="text-sm text-muted-foreground font-sans">
                  {aiOverride ? "AI automation is disabled" : "AI automation is active"}
                </p>
              </div>
            </div>
            <Badge variant={aiOverride ? "destructive" : "default"} className="font-sans">
              {aiOverride ? "MANUAL" : "AUTO"}
            </Badge>
          </div>

          {aiOverride && (
            <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
              <Clock className="h-4 w-4" />
              <AlertDescription className="font-sans">
                Manual override active. Time remaining: {timeRemaining} minutes
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-4">
            <Label htmlFor="timer" className="font-sans">
              Override Duration:
            </Label>
            <Select
              value={overrideTimer.toString()}
              onValueChange={(value) => setOverrideTimer(Number.parseInt(value))}
              disabled={isReadOnly || aiOverride}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 min</SelectItem>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isReadOnly && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-sans">
            You have read-only access. Device controls are disabled for your user role.
          </AlertDescription>
        </Alert>
      )}

      {/* Ventilation Systems */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans">
            <Fan className="h-5 w-5 text-blue-600" />
            Ventilation Systems
          </CardTitle>
          <CardDescription className="font-sans">Control air circulation and exhaust fans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {devicesByType.ventilation.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggle={handleDeviceToggle}
                onStatusChange={handleStatusChange}
                onPowerChange={handlePowerChange}
                onSetpointChange={handleSetpointChange}
                disabled={isReadOnly}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Climate Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans">
            <Thermometer className="h-5 w-5 text-red-600" />
            Climate Control
          </CardTitle>
          <CardDescription className="font-sans">Manage temperature and humidity systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {devicesByType.climate.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggle={handleDeviceToggle}
                onStatusChange={handleStatusChange}
                onPowerChange={handlePowerChange}
                onSetpointChange={handleSetpointChange}
                disabled={isReadOnly}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Irrigation & Nutrients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans">
            <Zap className="h-5 w-5 text-green-600" />
            Irrigation & Nutrients
          </CardTitle>
          <CardDescription className="font-sans">Control nutrient pumps and irrigation systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {devicesByType.irrigation.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggle={handleDeviceToggle}
                onStatusChange={handleStatusChange}
                onPowerChange={handlePowerChange}
                onSetpointChange={handleSetpointChange}
                disabled={isReadOnly}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lighting Systems */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans">
            <Sun className="h-5 w-5 text-yellow-600" />
            Lighting Systems
          </CardTitle>
          <CardDescription className="font-sans">Control LED grow lights and photoperiod</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {devicesByType.lighting.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggle={handleDeviceToggle}
                onStatusChange={handleStatusChange}
                onPowerChange={handlePowerChange}
                onSetpointChange={handleSetpointChange}
                disabled={isReadOnly}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface DeviceCardProps {
  device: Device
  onToggle: (deviceId: string) => void
  onStatusChange: (deviceId: string, status: "on" | "off" | "auto") => void
  onPowerChange: (deviceId: string, power: number[]) => void
  onSetpointChange: (deviceId: string, setpoint: number) => void
  disabled: boolean
}

function DeviceCard({ device, onToggle, onStatusChange, onPowerChange, onSetpointChange, disabled }: DeviceCardProps) {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${device.bgColor}`}>
              <device.icon className={`h-4 w-4 ${device.color}`} />
            </div>
            <div>
              <CardTitle className="text-sm font-sans">{device.name}</CardTitle>
              <p className="text-xs text-muted-foreground font-sans">
                {device.power}
                {device.unit} • {device.status.toUpperCase()}
              </p>
            </div>
          </div>
          <Badge
            variant={device.status === "on" ? "default" : device.status === "auto" ? "secondary" : "outline"}
            className="font-sans"
          >
            {device.status === "on" && <CheckCircle className="w-3 h-3 mr-1" />}
            {device.status === "auto" && <Settings className="w-3 h-3 mr-1" />}
            {device.status === "off" && <Pause className="w-3 h-3 mr-1" />}
            {device.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Control */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={device.status === "off" ? "default" : "outline"}
            onClick={() => onStatusChange(device.id, "off")}
            disabled={disabled}
            className="flex-1 font-sans"
          >
            <Pause className="w-3 h-3 mr-1" />
            Off
          </Button>
          <Button
            size="sm"
            variant={device.status === "on" ? "default" : "outline"}
            onClick={() => onStatusChange(device.id, "on")}
            disabled={disabled}
            className="flex-1 font-sans"
          >
            <Play className="w-3 h-3 mr-1" />
            On
          </Button>
          <Button
            size="sm"
            variant={device.status === "auto" ? "default" : "outline"}
            onClick={() => onStatusChange(device.id, "auto")}
            disabled={disabled}
            className="flex-1 font-sans"
          >
            <Settings className="w-3 h-3 mr-1" />
            Auto
          </Button>
        </div>

        {/* Power Control */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-sans">Current Power</Label>
            <span className="text-sm font-medium font-sans">
              {device.power}
              {device.unit}
            </span>
          </div>
          <Slider
            value={[device.power]}
            onValueChange={(value) => onPowerChange(device.id, value)}
            max={device.max || 100}
            min={device.min || 0}
            step={device.unit === "°C" ? 0.5 : device.unit === "L/min" ? 0.1 : 1}
            disabled={disabled || device.status === "off"}
            className="w-full"
          />
        </div>

        {/* Setpoint Control */}
        {device.setpoint !== undefined && (
          <div className="space-y-2">
            <Label className="text-sm font-sans">Target Setpoint</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={device.setpoint}
                onChange={(e) => onSetpointChange(device.id, Number.parseFloat(e.target.value))}
                min={device.min}
                max={device.max}
                step={device.unit === "°C" ? 0.5 : device.unit === "L/min" ? 0.1 : 1}
                disabled={disabled}
                className="flex-1 font-sans"
              />
              <span className="text-sm text-muted-foreground font-sans">{device.unit}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
