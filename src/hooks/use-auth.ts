"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)
    setIsLoading(false)
  }, [])

  const login = () => {
    localStorage.setItem("isLoggedIn", "true")
    setIsLoggedIn(true)
    window.location.reload()
  }

  const logout = () => {
    localStorage.removeItem("isLoggedIn")
    setIsLoggedIn(false)
  }

  return { isLoggedIn, isLoading, login, logout }
}
