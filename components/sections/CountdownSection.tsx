'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Calendar, ChevronDown } from 'lucide-react'
import {
  openGoogleCalendar,
  openOutlookCalendar,
  downloadICalFile,
  type CalendarEvent,
} from '@/lib/calendar'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownSection() {
  const weddingDate = new Date('2026-01-24T09:00:00').getTime()

  const calculateTimeLeft = (): TimeLeft => {
    const difference = weddingDate - Date.now()

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [mounted, setMounted] = useState(false)
  const [showCalendarOptions, setShowCalendarOptions] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Wedding event details
  const weddingEvent: CalendarEvent = {
    title: 'Pernikahan Sam & Eli',
    description:
      'Dengan penuh sukacita, kami mengundang Anda untuk hadir di hari bahagia kami. Pernikahan Sam & Eli.',
    location: 'Lokasi Acara Pernikahan', // Update with actual venue
    startDate: '20260124T090000', // 24 January 2026, 09:00 AM
    endDate: '20260124T120000', // 24 January 2026, 12:00 PM
    timezone: 'Asia/Jakarta',
  }

  // Function to handle calendar selection
  const handleAddToCalendar = (type: 'google' | 'outlook' | 'ical') => {
    switch (type) {
      case 'google':
        openGoogleCalendar(weddingEvent)
        break
      case 'outlook':
        openOutlookCalendar(weddingEvent)
        break
      case 'ical':
        downloadICalFile(weddingEvent, 'pernikahan-sam-eli.ics')
        break
    }
    setShowCalendarOptions(false)
  }

  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-5">
      <div className="mx-auto max-w-2xl">
        {/* Save The Date Title */}
        <div className="relative mb-8 text-center">
          <div className="absolute top-1/2 left-1/2 z-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 md:h-64 md:w-64">
            <Image
              src="/image-5.png"
              alt="Flower decoration"
              width={256}
              height={256}
              className="object-contain"
            />
          </div>
          <h2 className="font-imperial-script text-primary relative z-10 -ml-20 text-6xl italic md:text-7xl">
            Save
          </h2>
          <h2 className="font-imperial-script text-primary relative z-10 -mt-5 text-6xl italic md:text-7xl">
            The
          </h2>
          <h2 className="font-imperial-script text-primary relative z-10 -mt-5 -mr-20 text-6xl italic md:text-7xl">
            Date
          </h2>
        </div>

        {/* Decorative Flowers and Wedding Info */}
        <div className="relative mt-20 mb-12">
          {/* Left Flower */}
          <Image
            src="/image-7.png"
            alt="Flower decoration"
            height={1000}
            width={1000}
            className="absolute -top-15 left-0 h-[250px] w-auto object-contain"
          />

          {/* Right Flower mirror */}
          <Image
            src="/image-7.png"
            alt="Flower decoration"
            height={1000}
            width={1000}
            className="absolute -top-15 right-0 h-[250px] w-auto -scale-x-100 object-contain"
          />

          {/* Center Content */}
          <div className="text-center">
            <p className="text-normal font-public-sans text-primary mb-4">
              For the wedding of
            </p>
            <h3 className="font-lexend-deca text-primary -mt-4 mb-4 text-4xl md:text-5xl">
              Sam & Eli
            </h3>
            <p className="font-public-sans text-primary -mt-3 text-lg">
              24 January 2026
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mt-20 p-6">
          <div className="mb-8 grid grid-cols-4 gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-center">
              <div
                className="font-public-sans mb-2 text-4xl text-gray-900 md:text-5xl"
                suppressHydrationWarning
              >
                {mounted ? timeLeft.days : 0}
              </div>
              <div className="font-public-sans text-gray-600">Hari</div>
            </div>

            <div className="text-center">
              <div
                className="font-public-sans mb-2 text-4xl text-gray-900 md:text-5xl"
                suppressHydrationWarning
              >
                {mounted ? timeLeft.hours : 0}
              </div>
              <div className="font-public-sans text-gray-600">Jam</div>
            </div>

            <div className="text-center">
              <div
                className="font-public-sans mb-2 text-4xl text-gray-900 md:text-5xl"
                suppressHydrationWarning
              >
                {mounted ? timeLeft.minutes : 0}
              </div>
              <div className="font-public-sans text-gray-600">Menit</div>
            </div>

            <div className="text-center">
              <div
                className="font-public-sans mb-2 text-4xl text-gray-900 md:text-5xl"
                suppressHydrationWarning
              >
                {mounted ? timeLeft.seconds : 0}
              </div>
              <div className="font-public-sans text-gray-600">Detik</div>
            </div>
          </div>
          {/* Add to Calendar Button with Dropdown */}
          <div className="relative text-center">
            <button
              onClick={() => setShowCalendarOptions(!showCalendarOptions)}
              className="bg-primary font-public-sans flex w-full items-center justify-center gap-2 rounded-lg px-8 py-4 text-white transition-colors hover:bg-gray-900"
            >
              <Calendar className="h-5 w-5" />
              Tambahkan ke Kalendar
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showCalendarOptions ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Options */}
            {showCalendarOptions && (
              <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                <button
                  onClick={() => handleAddToCalendar('google')}
                  className="font-public-sans flex w-full items-center gap-3 border-b border-gray-200 px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.3 8.9h-7.8v4.1h5.4c-.5 2.3-2.5 4.1-5.4 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.5 0 2.9.6 4 1.5l3.1-3.1C16.8 2.2 14.5 1 12 1 6.5 1 2 5.5 2 11s4.5 10 10 10c5 0 9-3.7 9-10 0-.7-.1-1.3-.2-2.1h-.5z" />
                  </svg>
                  Google Calendar
                </button>
                <button
                  onClick={() => handleAddToCalendar('outlook')}
                  className="font-public-sans flex w-full items-center gap-3 border-b border-gray-200 px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 6v12l10-6L7 6z" />
                  </svg>
                  Outlook Calendar
                </button>
                <button
                  onClick={() => handleAddToCalendar('ical')}
                  className="font-public-sans flex w-full items-center gap-3 rounded-b-lg px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Calendar className="h-5 w-5" />
                  Apple Calendar / iCal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
