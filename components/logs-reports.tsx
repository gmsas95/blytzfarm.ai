"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  FileText,
  Download,
  CalendarIcon,
  Search,
  BarChart3,
  TrendingUp,
  Clock,
  Database,
  FileSpreadsheet,
  AlertTriangle,
} from "lucide-react"
import { format } from "date-fns"

interface LogEntry {
  id: string
  timestamp: string
  type: "sensor" | "device" | "ai_decision" | "user_action" | "system"
  source: string
  event: string
  value?: number
  unit?: string
  user?: string
  details: string
  severity: "info" | "warning" | "error"
}

interface ReportData {
  period: string
  sensors: {
    temperature: { avg: number; min: number; max: number; readings: number }
    humidity: { avg: number; min: number; max: number; readings: number }
    co2: { avg: number; min: number; max: number; readings: number }
    soilMoisture: { avg: number; min: number; max: number; readings: number }
    ph: { avg: number; min: number; max: number; readings: number }
    ec: { avg: number; min: number; max: number; readings: number }
    light: { avg: number; min: number; max: number; readings: number }
  }
  devices: {
    totalOperations: number
    uptime: number
    maintenanceEvents: number
  }
  alerts: {
    total: number
    resolved: number
    avgResolutionTime: number
  }
}

interface User {
  role: string
}

export function LogsReports() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("logs")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [reportPeriod, setReportPeriod] = useState("daily")
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: "2024-01-15 15:45:22",
      type: "sensor",
      source: "Temperature Sensor 1",
      event: "Reading Updated",
      value: 24.5,
      unit: "°C",
      details: "Temperature reading within normal range",
      severity: "info",
    },
    {
      id: "2",
      timestamp: "2024-01-15 15:45:15",
      type: "ai_decision",
      source: "AI Controller",
      event: "Ventilation Adjusted",
      details: "Increased fan speed to 75% due to rising temperature",
      severity: "info",
    },
    {
      id: "3",
      timestamp: "2024-01-15 15:44:33",
      type: "device",
      source: "Exhaust Fan 1",
      event: "Speed Changed",
      value: 75,
      unit: "%",
      details: "Fan speed increased from 65% to 75%",
      severity: "info",
    },
    {
      id: "4",
      timestamp: "2024-01-15 15:40:18",
      type: "user_action",
      source: "Device Control",
      event: "Manual Override",
      user: "Farm Operator",
      details: "User enabled manual override for 15 minutes",
      severity: "warning",
    },
    {
      id: "5",
      timestamp: "2024-01-15 15:35:42",
      type: "system",
      source: "Database",
      event: "Backup Completed",
      details: "Daily database backup completed successfully",
      severity: "info",
    },
    {
      id: "6",
      timestamp: "2024-01-15 15:30:15",
      type: "sensor",
      source: "Humidity Sensor 1",
      event: "Calibration Error",
      details: "Sensor calibration failed, manual intervention required",
      severity: "error",
    },
    {
      id: "7",
      timestamp: "2024-01-15 15:25:08",
      type: "device",
      source: "Nutrient Pump A",
      event: "Maintenance Required",
      details: "Pump operating hours exceeded maintenance threshold",
      severity: "warning",
    },
    {
      id: "8",
      timestamp: "2024-01-15 15:20:33",
      type: "ai_decision",
      source: "AI Controller",
      event: "Irrigation Scheduled",
      details: "Scheduled irrigation cycle based on soil moisture levels",
      severity: "info",
    },
  ])

  const [reportData, setReportData] = useState<ReportData>({
    period: "Today (Jan 15, 2024)",
    sensors: {
      temperature: { avg: 24.2, min: 22.1, max: 26.8, readings: 1440 },
      humidity: { avg: 68.5, min: 62.0, max: 75.2, readings: 1440 },
      co2: { avg: 445, min: 380, max: 520, readings: 1440 },
      soilMoisture: { avg: 72.8, min: 68.5, max: 78.1, readings: 1440 },
      ph: { avg: 6.2, min: 5.9, max: 6.5, readings: 1440 },
      ec: { avg: 1.8, min: 1.6, max: 2.1, readings: 1440 },
      light: { avg: 42.5, min: 35.0, max: 48.2, readings: 1440 },
    },
    devices: {
      totalOperations: 156,
      uptime: 99.2,
      maintenanceEvents: 2,
    },
    alerts: {
      total: 8,
      resolved: 6,
      avgResolutionTime: 12.5,
    },
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || log.type === typeFilter
    const matchesSource = sourceFilter === "all" || log.source.includes(sourceFilter)
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter

    let matchesDate = true
    if (dateFrom || dateTo) {
      const logDate = new Date(log.timestamp)
      if (dateFrom && logDate < dateFrom) matchesDate = false
      if (dateTo && logDate > dateTo) matchesDate = false
    }

    return matchesSearch && matchesType && matchesSource && matchesSeverity && matchesDate
  })

  const handleGenerateReport = async (format: "csv" | "pdf") => {
    setIsGeneratingReport(true)

    // Simulate report generation
    setTimeout(() => {
      const filename = `farm-report-${reportPeriod}-${format === "csv" ? "data.csv" : "report.pdf"}`

      if (format === "csv") {
        // Generate CSV content
        const csvContent = [
          "Timestamp,Type,Source,Event,Value,Unit,Details,Severity",
          ...filteredLogs.map(
            (log) =>
              `"${log.timestamp}","${log.type}","${log.source}","${log.event}","${log.value || ""}","${log.unit || ""}","${log.details}","${log.severity}"`,
          ),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        // For PDF, we would typically use a library like jsPDF
        // For now, we'll simulate the download
        alert(`PDF report "${filename}" would be generated and downloaded in a real implementation.`)
      }

      setIsGeneratingReport(false)
    }, 2000)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sensor":
        return <BarChart3 className="w-3 h-3" />
      case "device":
        return <Database className="w-3 h-3" />
      case "ai_decision":
        return <TrendingUp className="w-3 h-3" />
      case "user_action":
        return <Clock className="w-3 h-3" />
      case "system":
        return <FileText className="w-3 h-3" />
      default:
        return <FileText className="w-3 h-3" />
    }
  }

  const isReadOnly = user?.role === "Viewer"

  return (
    <div className="space-y-6">
      {/* Reports Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold font-sans">{logs.length}</p>
                <p className="text-sm text-muted-foreground font-sans">Total Log Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold font-sans">{reportData.sensors.temperature.readings}</p>
                <p className="text-sm text-muted-foreground font-sans">Sensor Readings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold font-sans">{reportData.devices.uptime}%</p>
                <p className="text-sm text-muted-foreground font-sans">System Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold font-sans">{logs.filter((l) => l.severity === "error").length}</p>
                <p className="text-sm text-muted-foreground font-sans">Error Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs" className="font-sans">
            System Logs
          </TabsTrigger>
          <TabsTrigger value="reports" className="font-sans">
            Generate Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* System Logs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-sans">System Activity Logs</CardTitle>
                  <CardDescription className="font-sans">
                    Detailed logs of all system events and activities
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateReport("csv")}
                    disabled={isGeneratingReport}
                    className="font-sans bg-transparent"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 font-sans"
                  />
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sensor">Sensor</SelectItem>
                    <SelectItem value="device">Device</SelectItem>
                    <SelectItem value="ai_decision">AI Decision</SelectItem>
                    <SelectItem value="user_action">User Action</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="Temperature">Temperature</SelectItem>
                    <SelectItem value="Humidity">Humidity</SelectItem>
                    <SelectItem value="Fan">Fans</SelectItem>
                    <SelectItem value="Pump">Pumps</SelectItem>
                    <SelectItem value="AI Controller">AI Controller</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="font-sans bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="font-sans bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "MMM dd") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Logs Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-sans">Timestamp</TableHead>
                    <TableHead className="font-sans">Type</TableHead>
                    <TableHead className="font-sans">Source</TableHead>
                    <TableHead className="font-sans">Event</TableHead>
                    <TableHead className="font-sans">Value</TableHead>
                    <TableHead className="font-sans">User</TableHead>
                    <TableHead className="font-sans">Details</TableHead>
                    <TableHead className="font-sans">Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-sans">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {log.timestamp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-sans">
                          {getTypeIcon(log.type)}
                          <span className="ml-1">{log.type.replace("_", " ")}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-sans font-medium">{log.source}</TableCell>
                      <TableCell className="font-sans">{log.event}</TableCell>
                      <TableCell className="font-sans">
                        {log.value && (
                          <span>
                            {log.value} {log.unit}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-sans">{log.user || "-"}</TableCell>
                      <TableCell className="font-sans max-w-xs truncate">{log.details}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.severity === "error"
                              ? "destructive"
                              : log.severity === "warning"
                                ? "default"
                                : "secondary"
                          }
                          className="font-sans"
                        >
                          {log.severity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {/* Generate Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Environment Report</CardTitle>
                <CardDescription className="font-sans">
                  Comprehensive sensor data and environmental conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-sans">Report Period</Label>
                  <Select value={reportPeriod} onValueChange={setReportPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Report</SelectItem>
                      <SelectItem value="weekly">Weekly Report</SelectItem>
                      <SelectItem value="monthly">Monthly Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleGenerateReport("csv")}
                    disabled={isGeneratingReport}
                    className="font-sans"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    {isGeneratingReport ? "Generating..." : "Download CSV"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateReport("pdf")}
                    disabled={isGeneratingReport}
                    className="font-sans bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isGeneratingReport ? "Generating..." : "Download PDF"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Report Preview</CardTitle>
                <CardDescription className="font-sans">Current period: {reportData.period}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-sans">Temperature</span>
                    <span className="text-sm font-medium font-sans">Avg: {reportData.sensors.temperature.avg}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-sans">Humidity</span>
                    <span className="text-sm font-medium font-sans">Avg: {reportData.sensors.humidity.avg}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-sans">CO₂</span>
                    <span className="text-sm font-medium font-sans">Avg: {reportData.sensors.co2.avg} ppm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-sans">System Uptime</span>
                    <span className="text-sm font-medium font-sans">{reportData.devices.uptime}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-sans">Total Alerts</span>
                    <span className="text-sm font-medium font-sans">{reportData.alerts.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Detailed Statistics</CardTitle>
              <CardDescription className="font-sans">
                Comprehensive data breakdown for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium font-sans">Sensor Performance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-sans">Total Readings:</span>
                      <span className="font-sans">{reportData.sensors.temperature.readings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans">Data Quality:</span>
                      <span className="font-sans">99.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans">Calibration Events:</span>
                      <span className="font-sans">3</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium font-sans">Device Operations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-sans">Total Operations:</span>
                      <span className="font-sans">{reportData.devices.totalOperations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans">Maintenance Events:</span>
                      <span className="font-sans">{reportData.devices.maintenanceEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans">Efficiency:</span>
                      <span className="font-sans">94.2%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium font-sans">Alert Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-sans">Total Alerts:</span>
                      <span className="font-sans">{reportData.alerts.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans">Resolved:</span>
                      <span className="font-sans">{reportData.alerts.resolved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans">Avg Resolution:</span>
                      <span className="font-sans">{reportData.alerts.avgResolutionTime} min</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
