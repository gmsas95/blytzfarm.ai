"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate authentication
    setTimeout(() => {
      if (email === "admin@farm.ai" && password === "admin123") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email,
            role: "Admin",
            name: "Farm Administrator",
          }),
        )
        window.location.href = "/dashboard"
      } else if (email === "operator@farm.ai" && password === "operator123") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email,
            role: "Operator",
            name: "Farm Operator",
          }),
        )
        window.location.href = "/dashboard"
      } else if (email === "viewer@farm.ai" && password === "viewer123") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email,
            role: "Viewer",
            name: "Farm Viewer",
          }),
        )
        window.location.href = "/dashboard"
      } else {
        setError("Invalid email or password")
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Card className="border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-black text-center font-sans text-slate-800 dark:text-slate-100">
          Sign In
        </CardTitle>
        <CardDescription className="text-center font-sans text-slate-600 dark:text-slate-300">
          Enter your credentials to access the control panel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-sans font-medium text-slate-700 dark:text-slate-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@farm.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="font-sans bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-sans font-medium text-slate-700 dark:text-slate-200">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="font-sans bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
            />
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
              <AlertDescription className="text-red-700 dark:text-red-300 font-sans">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-sans font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2 font-sans">Demo Accounts:</p>
          <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300 font-sans">
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Admin:</strong> admin@farm.ai / admin123
            </div>
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Operator:</strong> operator@farm.ai / operator123
            </div>
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Viewer:</strong> viewer@farm.ai / viewer123
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
