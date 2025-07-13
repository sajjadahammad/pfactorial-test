export type Patient = {
    id: string
    name: string
  }
  
  export type Doctor = {
    id: string
    name: string
  }
  
  export type Appointment = {
    id: string
    date: string // YYYY-MM-DD
    time: string // HH:MM
    patientId: string
    doctorId: string
  }
  
  export const patients: Patient[] = [
    { id: "p1", name: "Alice Smith" },
    { id: "p2", name: "Bob Johnson" },
    { id: "p3", name: "Charlie Brown" },
    { id: "p4", name: "Diana Prince" },
    { id: "p5", name: "Clark Kent" },
  ]
  
  export const doctors: Doctor[] = [
    { id: "d1", name: "Dr. Emily White" },
    { id: "d2", name: "Dr. John Doe" },
    { id: "d3", name: "Dr. Sarah Lee" },
    { id: "d4", name: "Dr. Bruce Banner" },
  ]
  