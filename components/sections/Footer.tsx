import React from 'react'
import Image from 'next/image'

export default function Footer() {
  return (
    <>
      <footer className="bg-white">
        <div className="mx-auto">
          {/* Couple Image */}
          <div className="relative aspect-4/3 w-full overflow-hidden">
            <Image
              src="/gallery/BIL02017.jpg"
              alt="Sam & Eli"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-normal text-primary mb-6 leading-relaxed">
              Menjadi kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan
              hadir dalam hari bahagia kami.
            </p>

            <p className="text-normal text-primary mb-5">
              Terima kasih & sampai jumpa
            </p>

            <h2 className="font-lexend-deca text-4xl font-normal text-gray-900">
              Sam & Eli
            </h2>
          </div>
        </div>
      </footer>

      {/* Credit Section */}
      <div className="bg-[#FF3B6F] py-3 text-center text-sm text-white">
        Invitation by Kondangin.id
      </div>
    </>
  )
}
