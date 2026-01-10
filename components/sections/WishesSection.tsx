'use client'

import React, { useState } from 'react'
import { Mic, Play, Pause, Volume2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

interface VoiceWish {
  id: number
  name: string
  audioUrl: string
  duration: string
  date: string
}

export default function WishesSection() {
  const searchParams = useSearchParams()

  // Parse guest JSON from URL parameter
  let guestName = ''
  try {
    const guestParam = searchParams.get('guest')
    if (guestParam) {
      const guestData = JSON.parse(decodeURIComponent(guestParam))
      guestName = guestData.name || ''
    }
  } catch (error) {
    console.error('Error parsing guest data:', error)
  }

  const [voiceWishes] = useState<VoiceWish[]>([
    {
      id: 1,
      name: 'Anika Curtis',
      audioUrl: '/music.mp3',
      duration: '0:09',
      date: '2024-01-05',
    },
    {
      id: 2,
      name: 'Cooper Lipshutz',
      audioUrl: '/music.mp3',
      duration: '0:09',
      date: '2024-01-04',
    },
    {
      id: 3,
      name: 'Jakob Schleifer',
      audioUrl: '/music.mp3',
      duration: '0:09',
      date: '2024-01-03',
    },
    {
      id: 4,
      name: 'Leo Vetrovs',
      audioUrl: '/music.mp3',
      duration: '0:09',
      date: '2024-01-02',
    },
    {
      id: 5,
      name: 'Leo George',
      audioUrl: '/music.mp3',
      duration: '0:09',
      date: '2024-01-01',
    },
  ])

  const [isRecording, setIsRecording] = useState(false)
  const [playingId, setPlayingId] = useState<number | null>(null)

  const handleRecordClick = () => {
    setIsRecording(!isRecording)
    console.log('Recording:', !isRecording)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submit voice message')
  }

  const togglePlay = (id: number) => {
    if (playingId === id) {
      setPlayingId(null)
    } else {
      setPlayingId(id)
    }
    console.log('Toggle play:', id)
  }

  return (
    <section className="bg-white px-6 py-12">
      <div className="mx-auto max-w-lg">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="font-lexend-deca mb-2 text-3xl font-semibold text-gray-800">
            Ucapan & Doa
          </h2>
        </div>

        {/* Voice Recording Form */}
        <div className="mb-8 rounded-xl border-2 border-dashed border-gray-300 bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Display */}
            <div>
              <p className="mb-2 block text-sm font-medium text-gray-700">
                Nama
              </p>
              <div className="rounded-lg bg-gray-50 px-4 py-3 text-gray-800">
                {guestName || '#NamaUndangan'}
              </div>
            </div>

            {/* Voice Recording Message */}
            <div>
              <p className="mb-2 block text-sm font-medium text-gray-700">
                Mohon tinggalkan pesan suara untuk kami
              </p>

              {/* Recording Button */}
              <button
                type="button"
                onClick={handleRecordClick}
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-gray-500 transition-colors hover:bg-gray-50"
              >
                <span>Klik tombol untuk merekam suara</span>
                <Mic className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-gray-800 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-900"
            >
              Kirim
            </button>
          </form>
        </div>

        {/* Voice Messages List */}
        <div className="space-y-4">
          {voiceWishes.map(wish => (
            <div key={wish.id} className="border-b border-gray-200 pb-4">
              <h3 className="mb-3 font-medium text-gray-800">{wish.name}</h3>

              {/* Audio Player */}
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
                <button
                  onClick={() => togglePlay(wish.id)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:shadow-md"
                >
                  {playingId === wish.id ? (
                    <Pause className="h-5 w-5 text-gray-700" />
                  ) : (
                    <Play
                      className="h-5 w-5 text-gray-700"
                      fill="currentColor"
                    />
                  )}
                </button>

                {/* Progress Bar */}
                <div className="flex-1">
                  <div className="mb-1 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full transition-all ${
                        playingId === wish.id
                          ? 'w-1/4 bg-red-500'
                          : 'w-0 bg-gray-400'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{playingId === wish.id ? '0:02' : '0:00'}</span>
                    <span>/ {wish.duration}</span>
                  </div>
                </div>

                {/* Volume Icon */}
                <Volume2 className="h-5 w-5 shrink-0 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
