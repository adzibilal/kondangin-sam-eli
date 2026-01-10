'use client'

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

// Event data in JSON format
const eventsDataSession1 = [
  {
    id: 1,
    title: 'Pemberkatan Pernikahan',
    time: '10:00',
    location: 'GKI Halimun',
    address:
      'Jl. Halimun Raya No. 11, RT 8/RW 2, Guntur, Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12980',
    mapsUrl: 'https://maps.app.goo.gl/xP2USer9VG4G7sny6',
  },
  {
    id: 2,
    title: 'Ramah Tamah',
    time: 'Sesi 1: 11.30 -13:00',
    location: 'GSG GKI Halimun',
    address:
      'Jl. Halimun Raya No. 7, RT 8/RW 2, Guntur, Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12980',
    mapsUrl: 'https://maps.app.goo.gl/xP2USer9VG4G7sny6',
  },
]

const eventsDataSession2 = [
  {
    id: 1,
    title: 'Ramah Tamah',
    time: 'Sesi 2: 13.30 - 15:00',
    location: 'GKI Halimun',
    address:
      'Jl. Halimun Raya No. 11, RT 8/RW 2, Guntur, Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12980',
    mapsUrl: 'https://maps.app.goo.gl/xP2USer9VG4G7sny6',
  },
]

// get session from url
export default function EventDetailsSection() {
  const searchParams = useSearchParams()
  
  // Parse guest slug from URL parameter to get session
  const [session, setSession] = useState('2')
  const [isLoadingGuest, setIsLoadingGuest] = useState(true)

  useEffect(() => {
    const fetchGuestData = async () => {
      try {
        const guestSlug = searchParams.get('guest')
        
        if (!guestSlug) {
          setIsLoadingGuest(false)
          return
        }

        // Try to fetch by UUID slug first
        try {
          const response = await fetch(`/api/guests/${guestSlug}`)
          if (response.ok) {
            const data = await response.json()
            setSession(data.guest.session?.toString() || '2')
            setIsLoadingGuest(false)
            return
          }
        } catch {
          // If UUID fetch fails, try legacy JSON format
        }

        // Fallback: Try parsing as JSON (legacy format)
        try {
          const decodedParam = decodeURIComponent(guestSlug)
          try {
            const parsed = JSON.parse(decodedParam)
            setSession(parsed.session?.toString() || '2')
          } catch {
            // Plain string or invalid - default to session 2
            setSession('2')
          }
        } catch (error) {
          console.error('Error parsing guest data:', error)
        }
      } finally {
        setIsLoadingGuest(false)
      }
    }

    fetchGuestData()
  }, [searchParams])
  
  const eventsData = session === '1' ? eventsDataSession1 : eventsDataSession2

  return (
    <section className="bg-white p-6">
      <div className="mx-auto max-w-4xl">
        {/* Events */}
        <div className="space-y-6">
          {eventsData.map(event => (
            <div key={event.id} className="">
              {/* Event Title */}
              <h3 className="font-lexend-deca mb-2 text-2xl text-gray-800">
                {event.title}
              </h3>

              {/* Time */}
              <div className="mb-3 flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700">{event.time}</span>
              </div>

              {/* Location */}
              <div className="mb-4 flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 shrink-0 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-800">
                    {event.location}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {event.address}
                  </p>
                </div>
              </div>

              {/* View Location Button */}
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-primary font-public-sans text-primary hover:bg-primary mt-4 inline-block w-full rounded-lg border px-8 py-4 text-center transition-colors hover:text-white"
              >
                Lihat Lokasi
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
