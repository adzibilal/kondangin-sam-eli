'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Mic, Play, Pause, Volume2, Square, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useReactMediaRecorder } from 'react-media-recorder'
import { WishData } from '@/types'

export default function WishesSectionClient() {
  const searchParams = useSearchParams()

  // Parse guest JSON from URL parameter
  let guestName = ''
  try {
    const guestParam = searchParams.get('guest')
    if (guestParam) {
      const decodedParam = decodeURIComponent(guestParam)
      
      // Try to parse as JSON first
      try {
        const guestData = JSON.parse(decodedParam)
        guestName = guestData.name || ''
      } catch {
        // If not JSON, treat as plain string name
        guestName = decodedParam
      }
    }
  } catch (error) {
    console.error('Error parsing guest data:', error)
  }

  const [voiceWishes, setVoiceWishes] = useState<WishData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioElements, setAudioElements] = useState<
    Map<string, HTMLAudioElement>
  >(new Map())
  const [currentTimes, setCurrentTimes] = useState<Map<string, number>>(
    new Map()
  )
  const [durations, setDurations] = useState<Map<string, number>>(new Map())

  const recordingInterval = useRef<NodeJS.Timeout | null>(null)

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
  } = useReactMediaRecorder({
    audio: true,
    onStop: async (blobUrl, blob) => {
      setRecordedBlob(blob)
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
      }
    },
  })

  // Fetch wishes on component mount
  useEffect(() => {
    void fetchWishes()
  }, [])

  // Handle recording timer
  useEffect(() => {
    if (status === 'recording') {
      setRecordingTime(0)
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      return
    }
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current)
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
      }
    }
  }, [status])

  // Setup audio elements for wishes
  useEffect(() => {
    const newAudioElements = new Map<string, HTMLAudioElement>()

    voiceWishes.forEach(wish => {
      if (wish.id) {
        const audio = new Audio(wish.audioUrl)
        
        const handleTimeUpdate = () => {
          setCurrentTimes(prev => new Map(prev).set(wish.id!, audio.currentTime))
        }
        
        const handleLoadedMetadata = () => {
          setDurations(prev => new Map(prev).set(wish.id!, audio.duration))
        }
        
        const handleEnded = () => {
          setPlayingId(null)
        }
        
        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('loadedmetadata', handleLoadedMetadata)
        audio.addEventListener('ended', handleEnded)
        
        newAudioElements.set(wish.id, audio)
      }
    })

    setAudioElements(newAudioElements)

    return () => {
      newAudioElements.forEach(audio => {
        audio.pause()
        audio.remove()
      })
    }
  }, [voiceWishes])

  const fetchWishes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/wishes')
      if (!response.ok) {
        throw new Error('Failed to fetch wishes')
      }
      const data = await response.json()
      setVoiceWishes(data.wishes)
    } catch (err) {
      console.error('Error fetching wishes:', err)
      setError('Gagal memuat ucapan. Silakan refresh halaman.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecordClick = () => {
    if (status === 'recording') {
      stopRecording()
      return
    }
    
    clearBlobUrl()
    setRecordedBlob(null)
    startRecording()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!recordedBlob) {
      setError('Silakan rekam pesan suara terlebih dahulu')
      return
    }

    if (!guestName) {
      setError('Nama tidak ditemukan')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Upload audio to Cloudinary
      const formData = new FormData()
      formData.append('audio', recordedBlob, 'voice-message.webm')

      const uploadResponse = await fetch('/api/upload-audio', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload audio')
      }

      const uploadData = await uploadResponse.json()
      const audioDuration = formatTime(uploadData.duration || recordingTime)

      // Save wish to Firestore
      const guestParam = searchParams.get('guest') || ''
      const wishResponse = await fetch('/api/wishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: guestName,
          audioUrl: uploadData.audioUrl,
          duration: audioDuration,
          guestParam,
        }),
      })

      if (!wishResponse.ok) {
        throw new Error('Failed to save wish')
      }

      setSuccess(true)
      setRecordedBlob(null)
      clearBlobUrl()
      setRecordingTime(0)

      // Refresh wishes list
      await fetchWishes()

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Error submitting wish:', err)
      setError('Gagal mengirim ucapan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePlay = (id: string) => {
    const audio = audioElements.get(id)
    if (!audio) return

    if (playingId === id) {
      audio.pause()
      setPlayingId(null)
    } else {
      // Pause any currently playing audio
      if (playingId) {
        const currentAudio = audioElements.get(playingId)
        currentAudio?.pause()
      }
      audio.play()
      setPlayingId(id)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDisplayDuration = (
    wishId: string,
    duration: number,
    fallbackDuration: string
  ): string => {
    return duration > 0 ? formatTime(duration) : fallbackDuration
  }

  const recordButtonText = status === 'recording'
    ? `Merekam... ${formatTime(recordingTime)}`
    : recordedBlob
      ? `Rekaman siap (${formatTime(recordingTime)})`
      : 'Klik tombol untuk merekam suara'

  return (
    <section className="bg-white px-6 py-12">
      <div className="mx-auto max-w-lg">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="font-lexend-deca mb-2 text-3xl font-semibold text-gray-800">
            Ucapan & Doa
          </h2>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-700">
            Ucapan berhasil dikirim! Terima kasih.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

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
                disabled={isSubmitting}
                className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                  status === 'recording'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span>
                  {recordButtonText}
                </span>
                {status === 'recording' ? (
                  <Square className="h-5 w-5 text-red-500 fill-red-500" />
                ) : (
                  <Mic className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {/* Audio Preview */}
              {mediaBlobUrl && recordedBlob && (
                <div className="mt-3">
                  <audio src={mediaBlobUrl} controls className="w-full">
                    <track kind="captions" />
                  </audio>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!recordedBlob || isSubmitting}
              className="w-full rounded-lg bg-gray-800 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
              {isSubmitting ? 'Mengirim...' : 'Kirim'}
            </button>
          </form>
        </div>

        {/* Voice Messages List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2">Memuat ucapan...</p>
            </div>
          ) : voiceWishes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada ucapan. Jadilah yang pertama!
            </div>
          ) : (
            voiceWishes.map(wish => {
              const wishId = wish.id || ''
              const currentTime = currentTimes.get(wishId) || 0
              const duration = durations.get(wishId) || 0
              const progress =
                duration > 0 ? (currentTime / duration) * 100 : 0
              const isPlaying = playingId === wishId

              return (
                <div key={wishId} className="border-b border-gray-200 pb-4">
                  <h3 className="mb-3 font-medium text-gray-800">
                    {wish.name}
                  </h3>

                  {/* Audio Player */}
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
                    <button
                      onClick={() => togglePlay(wishId)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:shadow-md"
                    >
                      {isPlaying ? (
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
                          className="h-full bg-red-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatTime(currentTime)}</span>
                        <span>
                          / {getDisplayDuration(wishId, duration, wish.duration)}
                        </span>
                      </div>
                    </div>

                    {/* Volume Icon */}
                    <Volume2 className="h-5 w-5 shrink-0 text-gray-400" />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
