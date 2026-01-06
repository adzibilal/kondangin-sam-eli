'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

export default function RSVPSection() {
  const searchParams = useSearchParams()
  const guestName = searchParams.get('guest') || ''

  const [formData, setFormData] = useState({
    attendance: 'yes',
    guests: '1',
    name: guestName,
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('RSVP Data:', {
      ...formData,
      name: guestName || formData.name,
    })
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        attendance: 'yes',
        guests: '1',
        name: guestName,
      })
    }, 3000)
  }

  return (
    <section className="relative overflow-hidden bg-white px-6 py-12">
      {/* Background Flower Image */}
      <Image
        src="/image-5.png"
        alt="Flower decoration"
        width={300}
        height={300}
        className="absolute top-0 -right-10 rotate-180 object-contain opacity-50"
      />
      <Image
        src="/image-5.png"
        alt="Flower decoration"
        width={300}
        height={300}
        className="absolute top-20 -left-20 rotate-90 object-contain opacity-50"
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
            {/* Konfirmasi Kehadiran */}
            <div>
              <label className="font-public-sans text-primary mb-3 block font-medium">
                Konfirmasi kehadiran
              </label>
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

            {/* Jumlah Tamu */}
            <div>
              <label className="font-public-sans text-primary mb-3 block font-medium">
                Jumlah tamu
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex cursor-pointer items-center justify-start gap-3 rounded-lg border-2 px-6 py-4 transition-colors ${
                    formData.guests === '1'
                      ? 'border-primary bg-gray-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="guests"
                    value="1"
                    checked={formData.guests === '1'}
                    onChange={e =>
                      setFormData({ ...formData, guests: e.target.value })
                    }
                    className="accent-primary h-5 w-5"
                  />
                  <span className="font-public-sans text-primary">1</span>
                </label>

                <label
                  className={`flex cursor-pointer items-center justify-start gap-3 rounded-lg border-2 px-6 py-4 transition-colors ${
                    formData.guests === '2'
                      ? 'border-primary bg-gray-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="guests"
                    value="2"
                    checked={formData.guests === '2'}
                    onChange={e =>
                      setFormData({ ...formData, guests: e.target.value })
                    }
                    className="accent-primary h-5 w-5"
                  />
                  <span className="font-public-sans text-primary">2</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="font-public-sans bg-primary hover:bg-primary/90 w-full cursor-pointer rounded-xl px-6 py-4 text-base font-medium text-white transition-colors"
            >
              Konfirmasi
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
