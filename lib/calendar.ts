/**
 * Calendar utility functions for adding events
 */

export interface CalendarEvent {
  title: string
  description: string
  location: string
  startDate: string // Format: YYYYMMDDTHHmmss
  endDate: string   // Format: YYYYMMDDTHHmmss
  timezone?: string // Optional timezone (e.g., 'Asia/Jakarta')
}

/**
 * Generate Google Calendar URL
 * 
 * @param {CalendarEvent} event - Event details
 * @returns {string} Google Calendar URL
 */
export const generateGoogleCalendarUrl = (event: CalendarEvent): string => {
  const url = new URL('https://calendar.google.com/calendar/render')
  
  url.searchParams.append('action', 'TEMPLATE')
  url.searchParams.append('text', event.title)
  url.searchParams.append('details', event.description)
  url.searchParams.append('location', event.location)
  url.searchParams.append('dates', `${event.startDate}/${event.endDate}`)
  
  if (event.timezone) {
    url.searchParams.append('ctz', event.timezone)
  }
  
  return url.toString()
}

/**
 * Generate iCal file content (.ics format)
 * Compatible with Apple Calendar, Outlook, etc.
 * 
 * @param {CalendarEvent} event - Event details
 * @returns {string} iCal file content
 */
export const generateICalContent = (event: CalendarEvent): string => {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sam & Eli Wedding//EN
BEGIN:VEVENT
UID:${now}@kondangin.com
DTSTAMP:${now}
DTSTART:${event.startDate}Z
DTEND:${event.endDate}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`
}

/**
 * Download iCal file
 * 
 * @param {CalendarEvent} event - Event details
 * @param {string} filename - File name (default: event.ics)
 */
export const downloadICalFile = (event: CalendarEvent, filename: string = 'event.ics'): void => {
  const content = generateICalContent(event)
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = globalThis.window?.URL.createObjectURL(blob)
  
  if (url) {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    globalThis.window?.URL.revokeObjectURL(url)
  }
}

/**
 * Format date to calendar string format (YYYYMMDDTHHmmss)
 * 
 * @param {Date} date - JavaScript Date object
 * @returns {string} Formatted date string
 */
export const formatDateForCalendar = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}`
}

/**
 * Open Google Calendar in new tab
 * 
 * @param {CalendarEvent} event - Event details
 */
export const openGoogleCalendar = (event: CalendarEvent): void => {
  const url = generateGoogleCalendarUrl(event)
  globalThis.window?.open(url, '_blank')
}

/**
 * Generate Outlook Calendar URL
 * 
 * @param {CalendarEvent} event - Event details
 * @returns {string} Outlook Calendar URL
 */
export const generateOutlookCalendarUrl = (event: CalendarEvent): string => {
  const url = new URL('https://outlook.live.com/calendar/0/deeplink/compose')
  
  // Convert YYYYMMDDTHHmmss to ISO format
  const startISO = event.startDate.replace(
    /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,
    '$1-$2-$3T$4:$5:$6'
  )
  const endISO = event.endDate.replace(
    /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,
    '$1-$2-$3T$4:$5:$6'
  )
  
  url.searchParams.append('subject', event.title)
  url.searchParams.append('body', event.description)
  url.searchParams.append('location', event.location)
  url.searchParams.append('startdt', startISO)
  url.searchParams.append('enddt', endISO)
  url.searchParams.append('path', '/calendar/action/compose')
  url.searchParams.append('rru', 'addevent')
  
  return url.toString()
}

/**
 * Open Outlook Calendar in new tab
 * 
 * @param {CalendarEvent} event - Event details
 */
export const openOutlookCalendar = (event: CalendarEvent): void => {
  const url = generateOutlookCalendarUrl(event)
  globalThis.window?.open(url, '_blank')
}
