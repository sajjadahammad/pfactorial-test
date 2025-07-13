"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Appointment, Patient, Doctor } from "@/lib/data"

interface AppointmentFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (appointment: Omit<Appointment, "id"> | Appointment) => void
  initialData?: Appointment | null
  patients: Patient[]
  doctors: Doctor[]
  selectedDate: string // YYYY-MM-DD
}

export function AppointmentForm({
  isOpen,
  onClose,
  onSave,
  initialData,
  patients,
  doctors,
  selectedDate,
}: AppointmentFormProps) {
  const [patientId, setPatientId] = useState(initialData?.patientId || "")
  const [doctorId, setDoctorId] = useState(initialData?.doctorId || "")
  const [time, setTime] = useState(initialData?.time || "09:00")

  useEffect(() => {
    if (initialData) {
      setPatientId(initialData.patientId)
      setDoctorId(initialData.doctorId)
      setTime(initialData.time)
    } else {
      // Reset form for new appointment
      setPatientId("")
      setDoctorId("")
      setTime("09:00")
    }
  }, [initialData, isOpen]) // Reset when dialog opens or initialData changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientId || !doctorId || !time) {
      alert("Please fill all fields.")
      return
    }

    const newAppointment: Omit<Appointment, "id"> | Appointment = initialData
      ? { ...initialData, patientId, doctorId, time }
      : { date: selectedDate, patientId, doctorId, time }

    onSave(newAppointment)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Appointment" : "Add Appointment"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patient" className="text-right">
              Patient
            </Label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doctor" className="text-right">
              Doctor
            </Label>
            <Select value={doctorId} onValueChange={setDoctorId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <DialogFooter>
            {initialData && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this appointment?")) {
                    onSave({ ...initialData, _delete: true }) // Signal deletion
                    onClose()
                  }
                }}
                className="mr-auto"
              >
                Delete
              </Button>
            )}
            <Button type="submit">Save Appointment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
