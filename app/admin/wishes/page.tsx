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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Voice Wishes Management
        </h1>
        <p className="text-gray-700 font-medium">Listen and manage voice wishes from guests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-700 font-medium mb-1">Total Wishes</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-700 font-medium mb-1">Total Duration</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatTotalDuration(stats.totalDuration)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-2" />
            <p className="text-gray-700 font-medium">Loading wishes...</p>
          </div>
        ) : wishes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-700 font-medium">No wishes found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Guest Name (From Table)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Wish Name (Submitted)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Audio
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                        className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {playingId === wish.id ? (
                          <>
                            <Pause className="w-4 h-4" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" fill="currentColor" />
                            <span>Play</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownload(wish)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download audio"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(wish)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete wish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
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
