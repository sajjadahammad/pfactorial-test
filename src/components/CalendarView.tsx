"use client"

import { useState, useMemo } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addDays,
  startOfWeek,
  endOfWeek,
} from "date-fns"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppointments } from "@/hooks/use-appointments"
import { AppointmentForm } from "./AppointmentForm"
import { type Appointment, patients, doctors } from "@/lib/data"
import { formatDateToYYYYMMDD, cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CalendarView() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment, getAppointmentsForDate } =
    useAppointments()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date()) // For mobile day view
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [selectedDayForForm, setSelectedDayForForm] = useState<string>(formatDateToYYYYMMDD(new Date()))

  const isMobile = useIsMobile()

  const [filterPatientId, setFilterPatientId] = useState<string | null>("") // Updated default value
  const [filterDoctorId, setFilterDoctorId] = useState<string | null>("") // Updated default value

  const daysInMonth = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const handleDayClick = (date: Date) => {
    setSelectedDayForForm(formatDateToYYYYMMDD(date))
    setEditingAppointment(null)
    setIsFormOpen(true)
  }

  const handleAppointmentClick = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setSelectedDayForForm(appointment.date)
    setIsFormOpen(true)
  }

  const handleSaveAppointment = (appointmentData: Omit<Appointment, "id"> | (Appointment & { _delete?: boolean })) => {
    if ("_delete" in appointmentData && appointmentData._delete && "id" in appointmentData) {
      deleteAppointment(appointmentData.id)
    } else if ("id" in appointmentData) {
      updateAppointment(appointmentData as Appointment)
    } else {
      addAppointment(appointmentData as Omit<Appointment, "id">)
    }
  }

  const getPatientName = (id: string) => patients.find((p) => p.id === id)?.name || "Unknown Patient"
  const getDoctorName = (id: string) => doctors.find((d) => d.id === id)?.name || "Unknown Doctor"

  const renderDesktopMonthView = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex items-center gap-2">
          <Select
            value={filterPatientId === null ? "all" : filterPatientId}
            onValueChange={(value) => setFilterPatientId(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Patient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterDoctorId === null ? "all" : filterDoctorId}
            onValueChange={(value) => setFilterDoctorId(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="grid grid-cols-7 text-center text-sm font-medium text-muted-foreground border-b">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 flex-grow">
        {daysInMonth.map((day, index) => {
          const allDayAppointments = getAppointmentsForDate(formatDateToYYYYMMDD(day))
          const dayAppointments = allDayAppointments.filter((appt) => {
            const matchesPatient = filterPatientId ? appt.patientId === filterPatientId : true
            const matchesDoctor = filterDoctorId ? appt.doctorId === filterDoctorId : true
            return matchesPatient && matchesDoctor
          })
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isToday = isSameDay(day, new Date())

          return (
            <div
              key={index}
              className={cn(
                "relative border p-2 min-h-[120px] flex flex-col overflow-hidden",
                !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                isToday && "bg-blue-50 dark:bg-blue-950/20",
                isCurrentMonth && "hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer",
              )}
              onClick={() => isCurrentMonth && handleDayClick(day)}
            >
              <span
                className={cn(
                  "absolute top-2 right-2 text-sm font-medium",
                  isToday && "text-blue-600 dark:text-blue-400",
                )}
              >
                {format(day, "d")}
              </span>
              <div className="mt-8 space-y-1 text-xs overflow-y-auto scrollbar-hide">
                {dayAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-sm px-1 py-0.5 truncate hover:bg-blue-200 dark:hover:bg-blue-700 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation() // Prevent day click
                      handleAppointmentClick(appt)
                    }}
                  >
                    <span className="font-medium">{appt.time}</span> - {getPatientName(appt.patientId)}
                  </div>
                ))}
              </div>
              {isCurrentMonth && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDayClick(day)
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderMobileDayView = () => {
    const daysToShow = Array.from({ length: 7 }).map((_, i) => addDays(selectedDate, i))

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={() => handleDayClick(selectedDate)}>
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 p-4 border-b">
          <Select
            value={filterPatientId === null ? "all" : filterPatientId}
            onValueChange={(value) => setFilterPatientId(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Patient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterDoctorId === null ? "all" : filterDoctorId}
            onValueChange={(value) => setFilterDoctorId(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {daysToShow.map((day, index) => {
            const allDayAppointments = getAppointmentsForDate(formatDateToYYYYMMDD(day))
            const dayAppointments = allDayAppointments.filter((appt) => {
              const matchesPatient = filterPatientId ? appt.patientId === filterPatientId : true
              const matchesDoctor = filterDoctorId ? appt.doctorId === filterDoctorId : true
              return matchesPatient && matchesDoctor
            })
            const isToday = isSameDay(day, new Date())

            return (
              <Card key={index} className={cn(isToday && "border-blue-500 dark:border-blue-700")}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold">{format(day, "EEEE, MMMM d")}</CardTitle>
                  {isToday && <span className="text-sm text-blue-600 dark:text-blue-400">Today</span>}
                </CardHeader>
                <CardContent className="space-y-2">
                  {dayAppointments.length > 0 ? (
                    dayAppointments.map((appt) => (
                      <div
                        key={appt.id}
                        className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900 rounded-md cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800"
                        onClick={() => handleAppointmentClick(appt)}
                      >
                        <div>
                          <p className="font-medium">
                            {appt.time} - {getPatientName(appt.patientId)}
                          </p>
                          <p className="text-sm text-muted-foreground">{getDoctorName(appt.doctorId)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No appointments</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      {isMobile ? renderMobileDayView() : renderDesktopMonthView()}
      <AppointmentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveAppointment}
        initialData={editingAppointment}
        patients={patients}
        doctors={doctors}
        selectedDate={selectedDayForForm}
      />
    </div>
  )
}
