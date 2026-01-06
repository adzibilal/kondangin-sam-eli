'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

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

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
              <div className="font-public-sans mb-2 text-4xl text-gray-900 md:text-5xl">
                {timeLeft.days}
              </div>
              <div className="font-public-sans text-gray-600">Hari</div>
            </div>

            <div className="text-center">
              <div className="font-public-sans mb-2 text-4xl text-gray-900 md:text-5xl">
                {timeLeft.hours}
              </div>
              <div className="font-public-sans text-gray-600">Jam</div>
            </div>

            <div className="text-center">
              <div className="font-public-sans mb-2 text-4xl text-gray-900 md:text-5xl">
                {timeLeft.minutes}
              </div>
              <div className="font-public-sans text-gray-600">Menit</div>
            </div>

            <div className="text-center">
              <div className="font-public-sans mb-2 text-4xl text-gray-900 md:text-5xl">
                {timeLeft.seconds}
              </div>
              <div className="font-public-sans text-gray-600">Detik</div>
            </div>
          </div>
          {/* Add to Calendar Button */}
          <div className="text-center">
            <button className="bg-primary font-public-sans w-full rounded-lg px-8 py-4 text-white transition-colors hover:bg-gray-900">
              Tambahkan ke Kalendar
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
