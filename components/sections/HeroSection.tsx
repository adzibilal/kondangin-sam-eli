'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function HeroSection() {
  const [showPopup, setShowPopup] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const searchParams = useSearchParams()
  const guestName = searchParams.get('guest') || 'Nama Tamu'

  const handleOpenInvitation = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setShowPopup(false)
    }, 800) // Match animation duration
  }

  return (
    <>
      {/* Full Screen Popup */}
      {showPopup && (
        <div
          className={`bg-primary fixed inset-0 z-50 mx-auto flex max-w-lg items-center justify-center transition-all duration-700 ease-in-out ${
            isAnimating
              ? '-translate-y-full opacity-0'
              : 'translate-y-0 opacity-100'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/gallery/AND02783.jpg"
              alt="Wedding Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex h-[60%] flex-col items-center justify-between px-4 text-center text-white">
            <div className="">
              <p className="font-imperial-script -mb-2 text-[32px]">
                The Wedding of
              </p>
              <h1 className="font-lexend-deca mb-12 text-[54px]">Sam & Eli</h1>
            </div>
            <div className="">
              <div className="font-public-sans mb-5 space-y-0">
                <p className="text-base md:text-lg">Kepada Yth.</p>
                <p className="text-base md:text-lg">
                  Bapak / Ibu / Saudara / i
                </p>
              </div>
              <div className="font-public-sans mb-8">
                <p className="mb-2 text-2xl font-light md:text-3xl">
                  {guestName}
                </p>
              </div>

              {/* Button */}
              <button
                onClick={handleOpenInvitation}
                disabled={isAnimating}
                className="group bg-primary hover:bg-primary/90 hover:shadow-primary/50 flex cursor-pointer items-center gap-3 rounded-full px-8 py-2 backdrop-blur-sm transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="font-public-sans text-base text-white md:text-lg">
                  Buka Undangan
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-white transition-transform duration-300 ${
                    isAnimating ? 'animate-bounce' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-white">
        <Image
          src="/gallery/AND02464.jpg"
          alt="Sam & Eli"
          width={1000}
          height={1000}
          className="w-full rounded-br-full object-contain"
          priority
        />
        <div className="mt-4 p-4">
          <p className="font-public-sans text-primary mb-4 text-lg md:text-lg">
            “Two are better than one, because they have a good return for their
            labor”
          </p>

          <p className="font-public-sans text-primary mb-4 text-lg md:text-lg">
            Ecclesiaste 4:9 NIV
          </p>
        </div>
        <div className="-mt-2 p-4">
          <p className="font-public-sans text-primary mb-4 text-lg md:text-lg">
            “Dengan kasih dan anugerah dari Tuhan Yesus Kristus, Kami mengundang
            Bapak/Ibu/Saudara/i untuk hadir dan berbagi sukacita dalam moment
            sakral penyatuan kami dalam kasih Tuhan.”
          </p>
        </div>
      </section>
    </>
  )
}
