'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

export default function RSVPSection() {
  const searchParams = useSearchParams()

  // Parse guest JSON from URL parameter
  let guestName = ''
  let totalGuests = '1'
  try {
    const guestParam = searchParams.get('guest')
    if (guestParam) {
      const decodedParam = decodeURIComponent(guestParam)

      // Try to parse as JSON first
      try {
        const guestData = JSON.parse(decodedParam)
        guestName = guestData.name || ''
        totalGuests = guestData.total_guest?.toString() || '1'
      } catch {
        // If not JSON, treat as plain string name
        guestName = decodedParam
        totalGuests = '1'
      }
    }
  } catch (error) {
    console.error('Error parsing guest data:', error)
  }

  const [formData, setFormData] = useState({
    attendance: 'yes',
    guests: totalGuests,
    name: guestName,
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const guestParam = searchParams.get('guest') || ''

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: guestName || formData.name,
          attendance: formData.attendance,
          guestCount: Number.parseInt(formData.guests) || 1,
          guestParam,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit RSVP')
      }

      setIsSubmitted(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          attendance: 'yes',
          guests: totalGuests,
          name: guestName,
        })
      }, 3000)
    } catch (err) {
      console.error('Error submitting RSVP:', err)
      setError('Gagal mengirim konfirmasi. Silakan coba lagi.')
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
        {isSubmitted ? (
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
