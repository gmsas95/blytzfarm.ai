"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  Thermometer,
  Droplets,
  Wind,
  Activity,
  Zap,
  Sun,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

interface SensorThreshold {
  id: string
  name: string
  icon: any
  color: string
  unit: string
  min: number
  max: number
  tolerance: number
  enabled: boolean
  priority: "low" | "medium" | "high"
}

interface AiDecision {
  id: string
  timestamp: string
  sensor: string
  sensorValue: number
  threshold: string
  action: string
  device: string
  result: "success" | "failed" | "pending"
  confidence: number
}

interface User {
  role: string
}

export function AiSettings() {
  const [user, setUser] = useState<User | null>(null)
  const [aiEnabled, setAiEnabled] = useState(true)
  const [learningMode, setLearningMode] = useState(false)
  const [decisionInterval, setDecisionInterval] = useState(30)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [thresholds, setThresholds] = useState<SensorThreshold[]>([
    {
      id: "temperature",
      name: "Temperature",
      icon: Thermometer,
      color: "text-red-600",
      unit: "°C",
      min: 22,
      max: 26,
      tolerance: 1.0,
      enabled: true,
      priority: "high",
    },
    {
      id: "humidity",
      name: "Humidity",
      icon: Droplets,
      color: "text-blue-600",
      unit: "%",
      min: 60,
      max: 80,
      tolerance: 5,
      enabled: true,
      priority: "high",
    },
    {
      id: "co2",
      name: "CO₂",
      icon: Wind,
      color: "text-green-600",
      unit: "ppm",
      min: 400,
      max: 500,
      tolerance: 25,
      enabled: true,
      priority: "medium",
    },
    {
      id: "soilMoisture",
      name: "Soil Moisture",
      icon: Droplets,
      color: "text-cyan-600",
      unit: "%",
      min: 70,
      max: 85,
      tolerance: 3,
      enabled: true,
      priority: "high",
    },
    {
      id: "ph",
      name: "pH Level",
      icon: Activity,
      color: "text-purple-600",
      unit: "",
      min: 6.0,
      max: 6.5,
      tolerance: 0.2,
      enabled: true,
      priority: "medium",
    },
    {
      id: "ec",
      name: "EC Level",
      icon: Zap,
      color: "text-orange-600",
      unit: "mS/cm",
      min: 1.5,
      max: 2.0,
      tolerance: 0.1,
      enabled: true,
      priority: "medium",
    },
    {
      id: "light",
      name: "Light Intensity",
      icon: Sun,
      color: "text-yellow-600",
      unit: "k lux",
      min: 40,
      max: 50,
      tolerance: 2,
      enabled: true,
      priority: "low",
    },
  ])

  const [decisions, setDecisions] = useState<AiDecision[]>([
    {
      id: "1",
      timestamp: "2024-01-15 14:32:15",
      sensor: "Temperature",
      sensorValue: 27.2,
      threshold: "Max: 26°C",
      action: "Increase ventilation",
      device: "Exhaust Fan 1",
      result: "success",
      confidence: 0.95,
    },
    {
      id: "2",
      timestamp: "2024-01-15 14:28:42",
      sensor: "Humidity",
      sensorValue: 58,
      threshold: "Min: 60%",
      action: "Activate humidifier",
      device: "Humidifier",
      result: "success",
      confidence: 0.88,
    },
    {
      id: "3",
      timestamp: "2024-01-15 14:25:18",
      sensor: "CO₂",
      sensorValue: 520,
      threshold: "Max: 500ppm",
      action: "Increase air circulation",
      device: "Circulation Fan",
      result: "success",
      confidence: 0.92,
    },
    {
      id: "4",
      timestamp: "2024-01-15 14:20:33",
      sensor: "Soil Moisture",
      sensorValue: 68,
      threshold: "Min: 70%",
      action: "Activate irrigation",
      device: "Nutrient Pump A",
      result: "failed",
      confidence: 0.76,
    },
    {
      id: "5",
      timestamp: "2024-01-15 14:15:07",
      sensor: "pH Level",
      sensorValue: 6.7,
      threshold: "Max: 6.5",
      action: "Adjust nutrient mix",
      device: "Nutrient Pump B",
      result: "pending",
      confidence: 0.84,
    },
  ])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleThresholdChange = (id: string, field: keyof SensorThreshold, value: any) => {
    if (user?.role === "Viewer") return

    setThresholds((prev) =>
      prev.map((threshold) => (threshold.id === id ? { ...threshold, [field]: value } : threshold)),
    )
    setHasUnsavedChanges(true)
  }

  const handleSaveSettings = () => {
    if (user?.role === "Viewer") return

    // Simulate saving settings
    setTimeout(() => {
      setHasUnsavedChanges(false)
    }, 1000)
  }

  const handleResetDefaults = () => {
    if (user?.role === "Viewer") return

    // Reset to default values
    setThresholds((prev) =>
      prev.map((threshold) => ({
        ...threshold,
        // Reset to original defaults based on sensor type
        min: threshold.id === "temperature" ? 22 : threshold.id === "humidity" ? 60 : threshold.min,
        max: threshold.id === "temperature" ? 26 : threshold.id === "humidity" ? 80 : threshold.max,
        tolerance: threshold.id === "temperature" ? 1.0 : threshold.id === "humidity" ? 5 : threshold.tolerance,
      })),
    )
    setHasUnsavedChanges(true)
  }

  const isReadOnly = user?.role === "Viewer"

  return (
    <div className="space-y-6">
      {/* AI Status & Global Settings */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Automation Control
          </CardTitle>
          <CardDescription className="font-sans">Configure global AI automation settings and behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="font-sans font-medium">AI Automation</Label>
                <p className="text-sm text-muted-foreground font-sans">
                  {aiEnabled ? "AI is actively monitoring" : "AI automation disabled"}
                </p>
              </div>
              <Switch
                checked={aiEnabled}
                onCheckedChange={setAiEnabled}
                disabled={isReadOnly}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="font-sans font-medium">Learning Mode</Label>
                <p className="text-sm text-muted-foreground font-sans">
                  {learningMode ? "AI is learning patterns" : "Using trained model"}
                </p>
              </div>
              <Switch
                checked={learningMode}
                onCheckedChange={setLearningMode}
                disabled={isReadOnly}
                className="data-[state=checked]:bg-green-600"
              />
            </div>

            <div className="p-4 border rounded-lg">
              <Label className="font-sans font-medium">Decision Interval</Label>
              <p className="text-sm text-muted-foreground mb-2 font-sans">How often AI makes decisions</p>
              <Select
                value={decisionInterval.toString()}
                onValueChange={(value) => setDecisionInterval(Number.parseInt(value))}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!aiEnabled && (
            <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-sans">
                AI automation is currently disabled. Devices will only respond to manual controls.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {isReadOnly && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-sans">
            You have read-only access. AI settings cannot be modified with your user role.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="thresholds" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="thresholds" className="font-sans">
            Sensor Thresholds
          </TabsTrigger>
          <TabsTrigger value="history" className="font-sans">
            Decision History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="thresholds" className="space-y-4">
          {/* Sensor Thresholds */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-sans">Sensor Thresholds & Tolerance</CardTitle>
                  <CardDescription className="font-sans">
                    Configure AI decision parameters for each sensor type
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetDefaults}
                    disabled={isReadOnly}
                    className="font-sans bg-transparent"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Defaults
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveSettings}
                    disabled={isReadOnly || !hasUnsavedChanges}
                    className="font-sans"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {thresholds.map((threshold) => (
                  <Card key={threshold.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                          <threshold.icon className={`h-4 w-4 ${threshold.color}`} />
                        </div>
                        <div>
                          <h4 className="font-medium font-sans">{threshold.name}</h4>
                          <p className="text-sm text-muted-foreground font-sans">Target range with tolerance levels</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            threshold.priority === "high"
                              ? "destructive"
                              : threshold.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                          className="font-sans"
                        >
                          {threshold.priority} priority
                        </Badge>
                        <Switch
                          checked={threshold.enabled}
                          onCheckedChange={(checked) => handleThresholdChange(threshold.id, "enabled", checked)}
                          disabled={isReadOnly}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-sans">Minimum {threshold.unit}</Label>
                        <Input
                          type="number"
                          value={threshold.min}
                          onChange={(e) =>
                            handleThresholdChange(threshold.id, "min", Number.parseFloat(e.target.value))
                          }
                          disabled={isReadOnly || !threshold.enabled}
                          step={threshold.unit === "°C" ? 0.5 : threshold.unit === "" ? 0.1 : 1}
                          className="font-sans"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-sans">Maximum {threshold.unit}</Label>
                        <Input
                          type="number"
                          value={threshold.max}
                          onChange={(e) =>
                            handleThresholdChange(threshold.id, "max", Number.parseFloat(e.target.value))
                          }
                          disabled={isReadOnly || !threshold.enabled}
                          step={threshold.unit === "°C" ? 0.5 : threshold.unit === "" ? 0.1 : 1}
                          className="font-sans"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-sans">Tolerance {threshold.unit}</Label>
                        <Input
                          type="number"
                          value={threshold.tolerance}
                          onChange={(e) =>
                            handleThresholdChange(threshold.id, "tolerance", Number.parseFloat(e.target.value))
                          }
                          disabled={isReadOnly || !threshold.enabled}
                          step={threshold.unit === "°C" ? 0.1 : threshold.unit === "" ? 0.05 : 0.5}
                          className="font-sans"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-sans">Priority Level</Label>
                        <Select
                          value={threshold.priority}
                          onValueChange={(value: "low" | "medium" | "high") =>
                            handleThresholdChange(threshold.id, "priority", value)
                          }
                          disabled={isReadOnly || !threshold.enabled}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* AI Decision History */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">AI Decision History</CardTitle>
              <CardDescription className="font-sans">Recent AI decisions and their outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-sans">Timestamp</TableHead>
                    <TableHead className="font-sans">Sensor</TableHead>
                    <TableHead className="font-sans">Value</TableHead>
                    <TableHead className="font-sans">Threshold</TableHead>
                    <TableHead className="font-sans">Action</TableHead>
                    <TableHead className="font-sans">Device</TableHead>
                    <TableHead className="font-sans">Confidence</TableHead>
                    <TableHead className="font-sans">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {decisions.map((decision) => (
                    <TableRow key={decision.id}>
                      <TableCell className="font-sans">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {decision.timestamp}
                        </div>
                      </TableCell>
                      <TableCell className="font-sans font-medium">{decision.sensor}</TableCell>
                      <TableCell className="font-sans">{decision.sensorValue}</TableCell>
                      <TableCell className="font-sans text-sm">{decision.threshold}</TableCell>
                      <TableCell className="font-sans">{decision.action}</TableCell>
                      <TableCell className="font-sans">{decision.device}</TableCell>
                      <TableCell className="font-sans">
                        <Badge
                          variant={
                            decision.confidence >= 0.9
                              ? "default"
                              : decision.confidence >= 0.8
                                ? "secondary"
                                : "outline"
                          }
                          className="font-sans"
                        >
                          {Math.round(decision.confidence * 100)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            decision.result === "success"
                              ? "default"
                              : decision.result === "failed"
                                ? "destructive"
                                : "secondary"
                          }
                          className="font-sans"
                        >
                          {decision.result === "success" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {decision.result === "failed" && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {decision.result === "pending" && <Clock className="w-3 h-3 mr-1" />}
                          {decision.result}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
