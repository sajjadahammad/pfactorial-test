"use client"

import { useAuth } from "@/hooks/use-auth"
import LoginForm from "@/components/LoginForm"
import { CalendarView } from "@/components/CalendarView"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { isLoggedIn, isLoading, logout } = useAuth()
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-lg font-medium">Loading...</div>
  }
  return (
    <div className="flex flex-col h-screen">
      {isLoggedIn ? (
        <>
          <header className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-900">
            <h1 className="text-2xl font-bold">Appointment Calendar</h1>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </header>
          <main className="flex-grow">
            <CalendarView />
          </main>
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
