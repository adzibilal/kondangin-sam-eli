'use client'

import React, { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { GuestData } from '@/types'

interface GuestModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  guest?: GuestData | null
  mode: 'create' | 'edit'
}

export default function GuestModal({
  isOpen,
  onClose,
  onSuccess,
  guest,
  mode,
}: GuestModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    session: '1',
    totalGuest: '1',
    whatsapp: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (guest && mode === 'edit') {
      setFormData({
        name: guest.name,
        session: guest.session.toString(),
        totalGuest: guest.totalGuest.toString(),
        whatsapp: guest.whatsapp || '',
      })
    } else {
      setFormData({
        name: '',
        session: '1',
        totalGuest: '1',
        whatsapp: '',
      })
    }
    setError('')
  }, [guest, mode, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const url =
        mode === 'create'
          ? '/api/admin/guests'
          : `/api/admin/guests/${guest?.id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save guest')
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Error saving guest:', err)
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'create' ? 'Add New Guest' : 'Edit Guest'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900 placeholder:text-gray-500"
              placeholder="Guest name"
              required
              disabled={isLoading}
            />
          </div>

          {/* Session */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Session <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.session}
              onChange={e =>
                setFormData({ ...formData, session: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900"
              required
              disabled={isLoading}
            >
              <option value="1">Session 1</option>
              <option value="2">Session 2</option>
            </select>
          </div>

          {/* Total Guest */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Total Guests <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.totalGuest}
              onChange={e =>
                setFormData({ ...formData, totalGuest: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900 placeholder:text-gray-500"
              placeholder="Number of guests"
              required
              disabled={isLoading}
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={e =>
                setFormData({ ...formData, whatsapp: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900 placeholder:text-gray-500"
              placeholder="628xxxxxxxxxx"
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 font-medium text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
