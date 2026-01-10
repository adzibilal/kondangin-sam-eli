'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

export default function RSVPSection() {
  const searchParams = useSearchParams()

  // Parse guest slug from URL parameter
  const [guestData, setGuestData] = useState<{
    name: string
    totalGuest: number
  } | null>(null)
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
            setGuestData({
              name: data.guest.name,
              totalGuest: data.guest.totalGuest,
            })
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
            setGuestData({
              name: parsed.name || '',
              totalGuest: parsed.total_guest || 1,
            })
          } catch {
            // Plain string name
            setGuestData({
              name: decodedParam,
              totalGuest: 1,
            })
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

  const guestName = guestData?.name || ''
  const totalGuests = guestData?.totalGuest?.toString() || '1'

  const [formData, setFormData] = useState({
    attendance: 'yes',
    guests: totalGuests,
    name: guestName,
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasExistingRSVP, setHasExistingRSVP] = useState(false)
  const [existingRSVP, setExistingRSVP] = useState<any>(null)

  // Check if user already has RSVP
  useEffect(() => {
    const checkExistingRSVP = async () => {
      const guestSlug = searchParams.get('guest')
      if (!guestSlug || isLoadingGuest) return

      try {
        const response = await fetch(`/api/rsvp?guestSlug=${guestSlug}`)
        if (response.ok) {
          const data = await response.json()
          console.log('Existing RSVP data:', data)
          if (data.hasRSVP) {
            setHasExistingRSVP(true)
            setExistingRSVP(data.rsvp)
            console.log('RSVP attendance:', data.rsvp.attendance)
          }
        }
      } catch (error) {
        console.error('Error checking existing RSVP:', error)
      }
    }

    if (!isLoadingGuest) {
      checkExistingRSVP()
    }
  }, [searchParams, isLoadingGuest])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const guestSlug = searchParams.get('guest') || ''

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: guestName || formData.name,
          attendance: formData.attendance,
          guestCount: Number.parseInt(formData.guests) || 1,
          guestParam: guestSlug,
          guestSlug: guestSlug,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setError('Anda sudah mengirim konfirmasi sebelumnya.')
          return
        }
        throw new Error(data.error || 'Failed to submit RSVP')
      }

      setIsSubmitted(true)

      // Immediately fetch updated RSVP to show correct data
      const checkResponse = await fetch(`/api/rsvp?guestSlug=${guestSlug}`)
      if (checkResponse.ok) {
        const checkData = await checkResponse.json()
        if (checkData.hasRSVP) {
          setExistingRSVP(checkData.rsvp)
          setHasExistingRSVP(true)
        }
      }

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          attendance: 'yes',
          guests: totalGuests,
          name: guestName,
        })
      }, 3000)
    } catch (err: any) {
      console.error('Error submitting RSVP:', err)
      setError(err.message || 'Gagal mengirim konfirmasi. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-white px-6 py-12">
      {/* Background Flower Image */}
      <Image
        src="/image-7.png"
        alt="Flower decoration"
        width={200}
        height={200}
        className="absolute top-0 -right-10 rotate-180 object-contain opacity-30"
      />
      <Image
        src="/image-7.png"
        alt="Flower decoration"
        width={200}
        height={200}
        className="absolute top-20 -left-20 object-contain opacity-30"
      />

      <div className="relative mx-auto">
        {/* Section Title */}
        <div className="mb-6">
          <h2 className="font-lexend-deca text-primary mb-4 text-3xl font-normal">
            RSVP
          </h2>
          <p className="font-public-sans text-primary leading-relaxed">
            Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
            berkenan hadir dan berbagi sukacita dalam moment sakral penyatuan
            kami, terima kasih.
          </p>
        </div>

        {/* RSVP Form */}
        {isLoadingGuest ? (
          <div className="rounded-lg bg-white py-12 text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : hasExistingRSVP && !isSubmitted ? (
          <div className="rounded-lg bg-white py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-semibold text-gray-800">
              RSVP Sudah Terkirim
            </h3>
            <p className="mb-4 text-gray-600">
              Anda telah mengirim konfirmasi kehadiran sebelumnya.
            </p>
            <div className="inline-block rounded-lg bg-gray-50 px-6 py-4 text-left">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Status:</span>{' '}
                <span
                  className={
                    existingRSVP?.attendance === 'yes'
                      ? 'font-medium text-green-600'
                      : 'font-medium text-red-600'
                  }
                >
                  {existingRSVP?.attendance === 'yes' ? 'Hadir' : 'Tidak Hadir'}
                </span>
              </p>
            </div>
          </div>
        ) : isSubmitted ? (
          <div className="rounded-lg bg-white py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-semibold text-gray-800">
              Terima Kasih!
            </h3>
            <p className="text-gray-600">
              Konfirmasi kehadiran Anda telah berhasil dikirim.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {error}
              </div>
            )}

            {/* Konfirmasi Kehadiran */}
            <div>
              <div className="font-public-sans text-primary mb-3 block font-medium">
                Konfirmasi kehadiran
              </div>
              <div className="space-y-3">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-6 py-4 transition-colors ${
                    formData.attendance === 'yes'
                      ? 'border-primary bg-gray-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="yes"
                    checked={formData.attendance === 'yes'}
                    onChange={e =>
                      setFormData({ ...formData, attendance: e.target.value })
                    }
                    className="accent-primary h-5 w-5"
                  />
                  <span className="font-public-sans text-primary">
                    Saya hadir
                  </span>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-6 py-4 transition-colors ${
                    formData.attendance === 'no'
                      ? 'border-primary bg-gray-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="no"
                    checked={formData.attendance === 'no'}
                    onChange={e =>
                      setFormData({ ...formData, attendance: e.target.value })
                    }
                    className="accent-primary h-5 w-5"
                  />
                  <span className="font-public-sans text-primary">
                    Maaf, saya tidak bisa hadir
                  </span>
                </label>
              </div>
            </div>

            {totalGuests === '1' && (
              <p className="font-public-sans text-primary text-center text-sm">
                Undangan hanya berlaku untuk 1 orang
              </p>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="font-public-sans bg-primary hover:bg-primary/90 w-full cursor-pointer rounded-xl px-6 py-4 text-base font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Mengirim...' : 'Konfirmasi'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
