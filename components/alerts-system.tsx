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
import { Bell, Mail, MessageSquare, Smartphone, AlertTriangle, CheckCircle, Clock, Search, Eye } from "lucide-react"

interface AlertRule {
  id: string
  name: string
  sensor: string
  condition: "above" | "below" | "outside_range"
  value: number
  severity: "low" | "medium" | "high" | "critical"
  enabled: boolean
  notifications: {
    email: boolean
    sms: boolean
    inApp: boolean
  }
  cooldown: number // minutes
}

interface AlertEvent {
  id: string
  timestamp: string
  rule: string
  sensor: string
  value: number
  severity: "low" | "medium" | "high" | "critical"
  message: string
  status: "active" | "acknowledged" | "resolved"
  acknowledgedBy?: string
  resolvedAt?: string
}

interface NotificationSettings {
  email: {
    enabled: boolean
    address: string
    frequency: "immediate" | "hourly" | "daily"
  }
  sms: {
    enabled: boolean
    number: string
    frequency: "immediate" | "hourly"
  }
  inApp: {
    enabled: boolean
    sound: boolean
    desktop: boolean
  }
}

interface User {
  role: string
  name: string
}

export function AlertsSystem() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("alerts")
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      address: "admin@farm.ai",
      frequency: "immediate",
    },
    sms: {
      enabled: false,
      number: "+1234567890",
      frequency: "immediate",
    },
    inApp: {
      enabled: true,
      sound: true,
      desktop: true,
    },
  })

  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: "temp_high",
      name: "Temperature Too High",
      sensor: "Temperature",
      condition: "above",
      value: 28,
      severity: "high",
      enabled: true,
      notifications: { email: true, sms: false, inApp: true },
      cooldown: 15,
    },
    {
      id: "temp_low",
      name: "Temperature Too Low",
      sensor: "Temperature",
      condition: "below",
      value: 20,
      severity: "medium",
      enabled: true,
      notifications: { email: true, sms: false, inApp: true },
      cooldown: 15,
    },
    {
      id: "humidity_critical",
      name: "Humidity Critical",
      sensor: "Humidity",
      condition: "outside_range",
      value: 50, // This would be a range in real implementation
      severity: "critical",
      enabled: true,
      notifications: { email: true, sms: true, inApp: true },
      cooldown: 5,
    },
    {
      id: "co2_high",
      name: "CO₂ Levels High",
      sensor: "CO₂",
      condition: "above",
      value: 600,
      severity: "medium",
      enabled: true,
      notifications: { email: false, sms: false, inApp: true },
      cooldown: 30,
    },
    {
      id: "soil_low",
      name: "Soil Moisture Low",
      sensor: "Soil Moisture",
      condition: "below",
      value: 60,
      severity: "high",
      enabled: true,
      notifications: { email: true, sms: false, inApp: true },
      cooldown: 10,
    },
  ])

  const [alertEvents, setAlertEvents] = useState<AlertEvent[]>([
    {
      id: "1",
      timestamp: "2024-01-15 15:45:22",
      rule: "Temperature Too High",
      sensor: "Temperature",
      value: 29.2,
      severity: "high",
      message: "Temperature exceeded 28°C threshold (29.2°C)",
      status: "active",
    },
    {
      id: "2",
      timestamp: "2024-01-15 15:30:15",
      rule: "Soil Moisture Low",
      sensor: "Soil Moisture",
      value: 58,
      severity: "high",
      message: "Soil moisture below 60% threshold (58%)",
      status: "acknowledged",
      acknowledgedBy: "Farm Operator",
    },
    {
      id: "3",
      timestamp: "2024-01-15 15:15:08",
      rule: "CO₂ Levels High",
      sensor: "CO₂",
      value: 620,
      severity: "medium",
      message: "CO₂ levels above 600ppm threshold (620ppm)",
      status: "resolved",
      resolvedAt: "2024-01-15 15:25:33",
    },
    {
      id: "4",
      timestamp: "2024-01-15 14:50:42",
      rule: "Humidity Critical",
      sensor: "Humidity",
      value: 45,
      severity: "critical",
      message: "Humidity outside safe range (45%)",
      status: "resolved",
      resolvedAt: "2024-01-15 15:10:18",
    },
    {
      id: "5",
      timestamp: "2024-01-15 14:20:33",
      rule: "Temperature Too Low",
      sensor: "Temperature",
      value: 19.5,
      severity: "medium",
      message: "Temperature below 20°C threshold (19.5°C)",
      status: "resolved",
      resolvedAt: "2024-01-15 14:35:12",
    },
  ])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleRuleToggle = (ruleId: string) => {
    if (user?.role === "Viewer") return

    setAlertRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const handleNotificationToggle = (ruleId: string, type: "email" | "sms" | "inApp") => {
    if (user?.role === "Viewer") return

    setAlertRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              notifications: {
                ...rule.notifications,
                [type]: !rule.notifications[type],
              },
            }
          : rule,
      ),
    )
  }

  const handleAcknowledgeAlert = (alertId: string) => {
    if (user?.role === "Viewer") return

    setAlertEvents((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "acknowledged",
              acknowledgedBy: user?.name || "Unknown User",
            }
          : alert,
      ),
    )
  }

  const handleResolveAlert = (alertId: string) => {
    if (user?.role === "Viewer") return

    setAlertEvents((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "resolved",
              resolvedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
            }
          : alert,
      ),
    )
  }

  const filteredAlerts = alertEvents.filter((alert) => {
    const matchesSearch =
      alert.rule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.sensor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const activeAlertsCount = alertEvents.filter((alert) => alert.status === "active").length
  const isReadOnly = user?.role === "Viewer"

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold font-sans">{activeAlertsCount}</p>
                <p className="text-sm text-muted-foreground font-sans">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold font-sans">
                  {alertEvents.filter((a) => a.status === "resolved").length}
                </p>
                <p className="text-sm text-muted-foreground font-sans">Resolved Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold font-sans">{alertRules.filter((r) => r.enabled).length}</p>
                <p className="text-sm text-muted-foreground font-sans">Active Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold font-sans">{notificationSettings.email.enabled ? "ON" : "OFF"}</p>
                <p className="text-sm text-muted-foreground font-sans">Email Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isReadOnly && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-sans">
            You have read-only access. Alert settings and actions are disabled for your user role.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts" className="font-sans">
            Alert Events
          </TabsTrigger>
          <TabsTrigger value="rules" className="font-sans">
            Alert Rules
          </TabsTrigger>
          <TabsTrigger value="settings" className="font-sans">
            Notification Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {/* Alert Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-sans">Alert Events</CardTitle>
                  <CardDescription className="font-sans">Recent alerts and their current status</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64 font-sans"
                    />
                  </div>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-sans">Timestamp</TableHead>
                    <TableHead className="font-sans">Rule</TableHead>
                    <TableHead className="font-sans">Sensor</TableHead>
                    <TableHead className="font-sans">Value</TableHead>
                    <TableHead className="font-sans">Severity</TableHead>
                    <TableHead className="font-sans">Message</TableHead>
                    <TableHead className="font-sans">Status</TableHead>
                    <TableHead className="font-sans">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-sans">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {alert.timestamp}
                        </div>
                      </TableCell>
                      <TableCell className="font-sans font-medium">{alert.rule}</TableCell>
                      <TableCell className="font-sans">{alert.sensor}</TableCell>
                      <TableCell className="font-sans">{alert.value}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            alert.severity === "critical"
                              ? "destructive"
                              : alert.severity === "high"
                                ? "destructive"
                                : alert.severity === "medium"
                                  ? "default"
                                  : "secondary"
                          }
                          className="font-sans"
                        >
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-sans max-w-xs truncate">{alert.message}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            alert.status === "active"
                              ? "destructive"
                              : alert.status === "acknowledged"
                                ? "default"
                                : "secondary"
                          }
                          className="font-sans"
                        >
                          {alert.status === "active" && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {alert.status === "acknowledged" && <Eye className="w-3 h-3 mr-1" />}
                          {alert.status === "resolved" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {alert.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {alert.status === "active" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                              disabled={isReadOnly}
                              className="font-sans bg-transparent"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          )}
                          {(alert.status === "active" || alert.status === "acknowledged") && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveAlert(alert.id)}
                              disabled={isReadOnly}
                              className="font-sans bg-transparent"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          {/* Alert Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Alert Rules Configuration</CardTitle>
              <CardDescription className="font-sans">Configure when and how alerts are triggered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <Card key={rule.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => handleRuleToggle(rule.id)}
                          disabled={isReadOnly}
                        />
                        <div>
                          <h4 className="font-medium font-sans">{rule.name}</h4>
                          <p className="text-sm text-muted-foreground font-sans">
                            {rule.sensor} {rule.condition.replace("_", " ")} {rule.value}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          rule.severity === "critical"
                            ? "destructive"
                            : rule.severity === "high"
                              ? "destructive"
                              : rule.severity === "medium"
                                ? "default"
                                : "secondary"
                        }
                        className="font-sans"
                      >
                        {rule.severity}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-sans">Notification Methods</Label>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.notifications.email}
                              onCheckedChange={() => handleNotificationToggle(rule.id, "email")}
                              disabled={isReadOnly || !rule.enabled}
                              size="sm"
                            />
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-sans">Email</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.notifications.sms}
                              onCheckedChange={() => handleNotificationToggle(rule.id, "sms")}
                              disabled={isReadOnly || !rule.enabled}
                              size="sm"
                            />
                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-sans">SMS</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.notifications.inApp}
                              onCheckedChange={() => handleNotificationToggle(rule.id, "inApp")}
                              disabled={isReadOnly || !rule.enabled}
                              size="sm"
                            />
                            <Bell className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-sans">In-App</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-sans">Cooldown Period</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={rule.cooldown}
                            disabled={isReadOnly || !rule.enabled}
                            className="w-20 font-sans"
                          />
                          <span className="text-sm text-muted-foreground font-sans">minutes</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          {/* Notification Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sans">
                  <Mail className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-sans">Enable Email Alerts</Label>
                  <Switch
                    checked={notificationSettings.email.enabled}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        email: { ...prev.email, enabled: checked },
                      }))
                    }
                    disabled={isReadOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans">Email Address</Label>
                  <Input
                    type="email"
                    value={notificationSettings.email.address}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        email: { ...prev.email, address: e.target.value },
                      }))
                    }
                    disabled={isReadOnly || !notificationSettings.email.enabled}
                    className="font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans">Frequency</Label>
                  <Select
                    value={notificationSettings.email.frequency}
                    onValueChange={(value: "immediate" | "hourly" | "daily") =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        email: { ...prev.email, frequency: value },
                      }))
                    }
                    disabled={isReadOnly || !notificationSettings.email.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sans">
                  <Smartphone className="h-5 w-5" />
                  SMS Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-sans">Enable SMS Alerts</Label>
                  <Switch
                    checked={notificationSettings.sms.enabled}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        sms: { ...prev.sms, enabled: checked },
                      }))
                    }
                    disabled={isReadOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans">Phone Number</Label>
                  <Input
                    type="tel"
                    value={notificationSettings.sms.number}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        sms: { ...prev.sms, number: e.target.value },
                      }))
                    }
                    disabled={isReadOnly || !notificationSettings.sms.enabled}
                    className="font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans">Frequency</Label>
                  <Select
                    value={notificationSettings.sms.frequency}
                    onValueChange={(value: "immediate" | "hourly") =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        sms: { ...prev.sms, frequency: value },
                      }))
                    }
                    disabled={isReadOnly || !notificationSettings.sms.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sans">
                  <Bell className="h-5 w-5" />
                  In-App Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-sans">Enable In-App Alerts</Label>
                  <Switch
                    checked={notificationSettings.inApp.enabled}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        inApp: { ...prev.inApp, enabled: checked },
                      }))
                    }
                    disabled={isReadOnly}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="font-sans">Sound Notifications</Label>
                  <Switch
                    checked={notificationSettings.inApp.sound}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        inApp: { ...prev.inApp, sound: checked },
                      }))
                    }
                    disabled={isReadOnly || !notificationSettings.inApp.enabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="font-sans">Desktop Notifications</Label>
                  <Switch
                    checked={notificationSettings.inApp.desktop}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        inApp: { ...prev.inApp, desktop: checked },
                      }))
                    }
                    disabled={isReadOnly || !notificationSettings.inApp.enabled}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
