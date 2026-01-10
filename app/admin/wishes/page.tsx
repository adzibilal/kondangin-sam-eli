'use client'

import React, { useEffect, useState } from 'react'
import { Trash2, Loader2, Play, Pause, Download } from 'lucide-react'
import { WishData } from '@/types'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

export default function WishesPage() {
  const [wishes, setWishes] = useState<WishData[]>([])
  const [guests, setGuests] = useState<Map<string, string>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioElements, setAudioElements] = useState<
    Map<string, HTMLAudioElement>
  >(new Map())

  // Delete dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [wishToDelete, setWishToDelete] = useState<WishData | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchWishes()
  }, [])

  useEffect(() => {
    // Setup audio elements
    const newAudioElements = new Map<string, HTMLAudioElement>()

    wishes.forEach(wish => {
      if (wish.id) {
        const audio = new Audio(wish.audioUrl)
        audio.addEventListener('ended', () => {
          setPlayingId(null)
        })
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
  }, [wishes])

  const fetchWishes = async () => {
    setIsLoading(true)
    try {
      const [wishesRes, guestsRes] = await Promise.all([
        fetch('/api/admin/wishes'),
        fetch('/api/admin/guests'),
      ])

      const wishesData = await wishesRes.json()
      const guestsData = await guestsRes.json()

      // Create guest slug to name mapping
      const guestMap = new Map<string, string>()
      guestsData.guests?.forEach((guest: any) => {
        guestMap.set(guest.slug, guest.name)
      })

      setGuests(guestMap)
      setWishes(wishesData.wishes || [])
    } catch (error) {
      console.error('Error fetching wishes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (wish: WishData) => {
    setWishToDelete(wish)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!wishToDelete?.id) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/wishes?id=${wishToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchWishes()
        setIsDeleteDialogOpen(false)
      }
    } catch (error) {
      console.error('Error deleting wish:', error)
    } finally {
      setIsDeleting(false)
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

  const handleDownload = (wish: WishData) => {
    const a = document.createElement('a')
    a.href = wish.audioUrl
    a.download = `wish-${wish.name}-${wish.id}.mp3`
    a.target = '_blank'
    a.click()
  }

  const stats = {
    total: wishes.length,
    totalDuration: wishes
      .map(w => {
        const [mins, secs] = w.duration.split(':').map(Number)
        return mins * 60 + secs
      })
      .reduce((sum, duration) => sum + duration, 0),
  }

  const formatTotalDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const formatDate = (timestamp: any): string => {
    try {
      if (timestamp instanceof Date) {
        return timestamp.toLocaleString()
      }
      if (timestamp?.toDate) {
        return timestamp.toDate().toLocaleString()
      }
      if (timestamp?.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString()
      }
      return 'N/A'
    } catch {
      return 'N/A'
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Voice Wishes Management
        </h1>
        <p className="font-medium text-gray-700">
          Listen and manage voice wishes from guests
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="mb-1 text-sm font-medium text-gray-700">Total Wishes</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="mb-1 text-sm font-medium text-gray-700">
            Total Duration
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {formatTotalDuration(stats.totalDuration)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {isLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-gray-400" />
            <p className="font-medium text-gray-700">Loading wishes...</p>
          </div>
        ) : wishes.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-medium text-gray-700">No wishes found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                    Guest Name (From Table)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                    Wish Name (Submitted)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                    Audio
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold tracking-wider text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {wishes.map(wish => {
                  const guestNameFromTable = wish.guestSlug
                    ? guests.get(wish.guestSlug) || 'Unknown'
                    : 'Legacy Entry'

                  return (
                    <tr key={wish.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {guestNameFromTable}
                        {wish.guestSlug && (
                          <span className="ml-2 text-xs text-gray-500">
                            (linked)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {wish.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {wish.duration}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(wish.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => wish.id && togglePlay(wish.id)}
                          className="flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1 text-blue-900 transition-colors hover:bg-blue-200"
                        >
                          {playingId === wish.id ? (
                            <>
                              <Pause className="h-4 w-4" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" fill="currentColor" />
                              <span>Play</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownload(wish)}
                            className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                            title="Download audio"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(wish)}
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                            title="Delete wish"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Wish"
        message={`Are you sure you want to delete wish from ${wishToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  )
}
