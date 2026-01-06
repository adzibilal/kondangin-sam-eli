'use client'

import React, { useState } from 'react'
import Image from 'next/image'

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const galleryImages = [
    { id: 1, src: '/gallery/AND02464.jpg', alt: 'Sam and Eli - Photo 1' },
    { id: 2, src: '/gallery/AND02489.jpg', alt: 'Sam and Eli - Photo 2' },
    { id: 3, src: '/gallery/AND02446.jpg', alt: 'Sam and Eli - Photo 3' },
  ]

  const openPreview = (id: number) => {
    setSelectedImage(id)
  }

  const closePreview = () => {
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    if (selectedImage === null) return
    const currentIndex = galleryImages.findIndex(
      img => img.id === selectedImage
    )
    const previousIndex =
      currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1
    setSelectedImage(galleryImages[previousIndex].id)
  }

  const goToNext = () => {
    if (selectedImage === null) return
    const currentIndex = galleryImages.findIndex(
      img => img.id === selectedImage
    )
    const nextIndex =
      currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1
    setSelectedImage(galleryImages[nextIndex].id)
  }

  const selectedImageData = galleryImages.find(img => img.id === selectedImage)

  return (
    <>
      <section className="bg-white px-6 py-12">
        <div className="mx-auto">
          {/* Section Title */}
          <div className="mb-8">
            <h2 className="font-lexend-deca text-primary text-3xl font-normal">
              Galeri
            </h2>
          </div>

          {/* Gallery Grid */}
          <div className="space-y-4">
            {galleryImages.map(image => (
              <button
                key={image.id}
                onClick={() => openPreview(image.id)}
                className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-2xl"
                type="button"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      {selectedImage !== null && selectedImageData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closePreview}
          onKeyDown={e => {
            if (e.key === 'Escape') closePreview()
            if (e.key === 'ArrowLeft') goToPrevious()
            if (e.key === 'ArrowRight') goToNext()
          }}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <button
            onClick={closePreview}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close preview"
            type="button"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Previous Button */}
          <button
            onClick={e => {
              e.stopPropagation()
              goToPrevious()
            }}
            className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            aria-label="Previous image"
            type="button"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Image */}
          <div className="relative h-[80vh] w-full max-w-5xl">
            <Image
              src={selectedImageData.src}
              alt={selectedImageData.alt}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Next Button */}
          <button
            onClick={e => {
              e.stopPropagation()
              goToNext()
            }}
            className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            aria-label="Next image"
            type="button"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
            {galleryImages.findIndex(img => img.id === selectedImage) + 1} /{' '}
            {galleryImages.length}
          </div>
        </div>
      )}
    </>
  )
}
