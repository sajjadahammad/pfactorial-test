'use client'
import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { login } = useAuth()


    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
    
        if (email === "staff@clinic.com" && password === "123456") {
          login()
        } else {
          setError("Invalid email or password.")
        }
      }

    
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Clinic Staff Login</CardTitle>
        <CardDescription>Enter your credentials to access the appointment calendar.</CardDescription>
      </CardHeader>
      <CardContent>
        <form  onSubmit={handleLogin}  className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="staff@clinic.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="123456"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => {
          setEmail("staff@clinic.com")
          setPassword("123456")
          setError("")
        }}>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Demo Credentials:</p>
          <p className="text-sm font-mono">Email: staff@clinic.com</p>
          <p className="text-sm font-mono">Password: 123456</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Click to auto-fill</p>
        </div>
      </CardContent>
    </Card>
  </div>
  )
}
