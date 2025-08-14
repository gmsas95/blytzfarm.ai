"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Key, Activity, TrendingUp, Moon, Sun, Monitor, Save, Eye, EyeOff, Shield } from "lucide-react"
import { useTheme } from "next-themes"

interface ApiKeyData {
  provider: "moonshot" | "gemini"
  key: string
  model: string
}

export function SettingsPage() {
  const [apiKeyData, setApiKeyData] = useState<ApiKeyData>({
    provider: "moonshot",
    key: "",
    model: "moonshot-v1-8k",
  })
  const [showKey, setShowKey] = useState(false)
  const [aiStatus, setAiStatus] = useState(true)
  const [lastDecision, setLastDecision] = useState("Increased humidity to 70% - Temperature rising")
  const [autoMode, setAutoMode] = useState(true)
  const [learningMode, setLearningMode] = useState(false)
  const [decisionInterval, setDecisionInterval] = useState(5)
  const [saving, setSaving] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load current API configuration from server
    loadApiConfiguration()
  }, [])

  const loadApiConfiguration = async () => {
    try {
      const response = await fetch("/api/settings/ai-config")
      if (response.ok) {
        const config = await response.json()
        setApiKeyData({
          provider: config.provider || "moonshot",
          key: "", // Never load the actual key for security
          model: config.model || "moonshot-v1-8k",
        })
      }
    } catch (error) {
      console.error("Failed to load AI configuration:", error)
    }
  }

  const handleProviderChange = (provider: "moonshot" | "gemini") => {
    const defaultModels = {
      moonshot: "moonshot-v1-8k",
      gemini: "gemini-1.5-pro",
    }

    setApiKeyData((prev) => ({
      ...prev,
      provider,
      model: defaultModels[provider],
    }))
  }

  const handleModelChange = (model: string) => {
    setApiKeyData((prev) => ({
      ...prev,
      model,
    }))
  }

  const saveApiConfiguration = async () => {
    if (!apiKeyData.key.trim()) {
      alert("Please enter an API key")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/settings/ai-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: apiKeyData.provider,
          apiKey: apiKeyData.key,
          model: apiKeyData.model,
        }),
      })

      if (response.ok) {
        alert("AI configuration saved successfully!")
        // Clear the key input for security
        setApiKeyData((prev) => ({ ...prev, key: "" }))
        setShowKey(false)
      } else {
        throw new Error("Failed to save configuration")
      }
    } catch (error) {
      console.error("Failed to save AI configuration:", error)
      alert("Failed to save configuration. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const getModelOptions = () => {
    if (apiKeyData.provider === "moonshot") {
      return [
        { value: "moonshot-v1-8k", label: "Moonshot v1 8K" },
        { value: "moonshot-v1-32k", label: "Moonshot v1 32K" },
        { value: "moonshot-v1-128k", label: "Moonshot v1 128K" },
      ]
    } else {
      return [
        { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
        { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
        { value: "gemini-1.0-pro", label: "Gemini 1.0 Pro" },
      ]
    }
  }

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* AI Automation Control */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="font-sans flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            AI Automation Control
          </CardTitle>
          <CardDescription className="font-sans">Manage AI automation status and view recent decisions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-sans">AI Status</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold font-sans">{aiStatus ? "ACTIVE" : "INACTIVE"}</div>
                  <Badge variant={aiStatus ? "default" : "secondary"} className="font-sans">
                    {aiStatus ? "ON" : "OFF"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-sans">
                  AI is {aiStatus ? "monitoring and adjusting" : "in manual mode"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-sans">Last AI Decision</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-sans">{lastDecision}</div>
                <p className="text-xs text-muted-foreground mt-1 font-sans">2 minutes ago</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-sans">Enable AI Automation</Label>
                <p className="text-sm text-muted-foreground font-sans">
                  Allow AI to automatically control farm systems
                </p>
              </div>
              <Switch checked={aiStatus} onCheckedChange={setAiStatus} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-sans">Auto Mode</Label>
                <p className="text-sm text-muted-foreground font-sans">
                  Automatically adjust settings based on sensor data
                </p>
              </div>
              <Switch checked={autoMode} onCheckedChange={setAutoMode} disabled={!aiStatus} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-sans">Learning Mode</Label>
                <p className="text-sm text-muted-foreground font-sans">
                  AI learns from manual adjustments to improve decisions
                </p>
              </div>
              <Switch checked={learningMode} onCheckedChange={setLearningMode} disabled={!aiStatus} />
            </div>

            <div className="space-y-2">
              <Label className="font-sans">Decision Interval (minutes)</Label>
              <Input
                type="number"
                value={decisionInterval}
                onChange={(e) => setDecisionInterval(Number(e.target.value))}
                min={1}
                max={60}
                disabled={!aiStatus}
                className="w-32"
              />
              <p className="text-sm text-muted-foreground font-sans">How often AI evaluates and makes decisions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Appearance Settings
          </CardTitle>
          <CardDescription className="font-sans">Customize the interface appearance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="font-sans">Theme</Label>
              <p className="text-sm text-muted-foreground font-sans mb-3">Choose your preferred interface theme</p>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                  className="font-sans"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                  className="font-sans"
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("system")}
                  className="font-sans"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  System
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans flex items-center gap-2">
            <Key className="h-5 w-5" />
            AI Configuration
          </CardTitle>
          <CardDescription className="font-sans">Configure AI provider and model for automation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200 font-sans">
              API keys are securely stored server-side and encrypted. They are never exposed to the client.
            </div>
          </div>

          <div className="space-y-4">
            {/* AI Provider Selection */}
            <div className="space-y-2">
              <Label className="font-sans">AI Provider</Label>
              <Select value={apiKeyData.provider} onValueChange={handleProviderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select AI provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moonshot">Moonshot Kimi</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground font-sans">
                Choose your preferred AI provider for automation decisions
              </p>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <Label className="font-sans">Model</Label>
              <Select value={apiKeyData.model} onValueChange={handleModelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {getModelOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground font-sans">Select the specific model variant to use</p>
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
              <Label htmlFor="api-key" className="font-sans">
                {apiKeyData.provider === "moonshot" ? "Moonshot API Key" : "Gemini API Key"}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="api-key"
                  type={showKey ? "text" : "password"}
                  placeholder={apiKeyData.provider === "moonshot" ? "sk-..." : "AIza..."}
                  value={apiKeyData.key}
                  onChange={(e) => setApiKeyData((prev) => ({ ...prev, key: e.target.value }))}
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="icon" onClick={() => setShowKey(!showKey)}>
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground font-sans">
                {apiKeyData.provider === "moonshot"
                  ? "Your Moonshot Kimi API key for AI automation"
                  : "Your Google Gemini API key for AI automation"}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={saveApiConfiguration} disabled={saving} className="font-sans">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
