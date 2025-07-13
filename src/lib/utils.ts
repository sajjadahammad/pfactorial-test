import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDateToYYYYMMDD(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function parseYYYYMMDDToDate(dateString: string): Date {
  return parseISO(dateString)
}

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}