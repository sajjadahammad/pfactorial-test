"use client"

import { useState, useEffect } from "react"
import type { Appointment } from "@/lib/data"
import { generateUniqueId } from "@/lib/utils"

const LOCAL_STORAGE_KEY = "clinic_appointments"

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    try {
      const storedAppointments = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments))
      }
    } catch (error) {
      console.error("Failed to load appointments from localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appointments))
    }
  }, [appointments, isLoading])

  const addAppointment = (newAppt: Omit<Appointment, "id">) => {
    const appointmentWithId = { ...newAppt, id: generateUniqueId() }
    setAppointments((prev) => [...prev, appointmentWithId])
  }

  const updateAppointment = (updatedAppt: Appointment) => {
    setAppointments((prev) => prev.map((appt) => (appt.id === updatedAppt.id ? updatedAppt : appt)))
  }

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((appt) => appt.id !== id))
  }

  const getAppointmentsForDate = (dateString: string): Appointment[] => {
    return appointments.filter((appt) => appt.date === dateString).sort((a, b) => a.time.localeCompare(b.time))
  }

  return {
    appointments,
    isLoading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsForDate,
  }
}
