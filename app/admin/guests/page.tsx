'use client'

import React, { useEffect, useState, useRef } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Send,
  Loader2,
  Search,
  Upload,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { GuestData } from '@/types'
import GuestModal from '@/components/admin/GuestModal'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { getInvitationLink, getWhatsAppUrl } from '@/lib/url'

export default function GuestsPage() {
  const [guests, setGuests] = useState<GuestData[]>([])
  const [filteredGuests, setFilteredGuests] = useState<GuestData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sessionFilter, setSessionFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'session' | 'totalGuest'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [whatsappMessageTemplate, setWhatsappMessageTemplate] = useState<string | undefined>(undefined)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedGuest, setSelectedGuest] = useState<GuestData | null>(null)

  // Delete dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [guestToDelete, setGuestToDelete] = useState<GuestData | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Import states
  const [isImporting, setIsImporting] = useState(false)
  const [importResults, setImportResults] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchGuests()
    fetchWhatsAppMessageTemplate()
  }, [])

  useEffect(() => {
    filterGuests()
  }, [guests, searchTerm, sessionFilter, sortBy, sortOrder])

  const fetchGuests = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/guests')
      const data = await response.json()
      setGuests(data.guests || [])
    } catch (error) {
      console.error('Error fetching guests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchWhatsAppMessageTemplate = async () => {
    try {
      const response = await fetch('/api/admin/settings/whatsapp_message')
      if (response.ok) {
        const data = await response.json()
        setWhatsappMessageTemplate(data.value)
      }
    } catch (error) {
      console.error('Error fetching WhatsApp template:', error)
    }
  }

  const filterGuests = () => {
    let filtered = [...guests]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(guest =>
        guest.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Session filter
    if (sessionFilter !== 'all') {
      filtered = filtered.filter(
        guest => guest.session.toString() === sessionFilter
      )
    }

    // Sorting
    filtered.sort((a, b) => {
      let compareA: any
      let compareB: any

      switch (sortBy) {
        case 'name':
          compareA = a.name.toLowerCase()
          compareB = b.name.toLowerCase()
          break
        case 'session':
          compareA = a.session
          compareB = b.session
          break
        case 'totalGuest':
          compareA = a.totalGuest
          compareB = b.totalGuest
          break
        default:
          compareA = a.name.toLowerCase()
          compareB = b.name.toLowerCase()
      }

      if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1
      if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    setFilteredGuests(filtered)
  }

  const handleSort = (field: 'name' | 'session' | 'totalGuest') => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new field and default to ascending
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const SortIcon = ({ field }: { field: 'name' | 'session' | 'totalGuest' }) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-gray-700" />
    ) : (
      <ArrowDown className="w-4 h-4 text-gray-700" />
    )
  }

  const handleAddGuest = () => {
    setModalMode('create')
    setSelectedGuest(null)
    setIsModalOpen(true)
  }

  const handleEditGuest = (guest: GuestData) => {
    setModalMode('edit')
    setSelectedGuest(guest)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (guest: GuestData) => {
    setGuestToDelete(guest)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!guestToDelete?.id) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/guests/${guestToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchGuests()
        setIsDeleteDialogOpen(false)
      }
    } catch (error) {
      console.error('Error deleting guest:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCopyLink = (guest: GuestData) => {
    const link = getInvitationLink(guest.slug)
    
    navigator.clipboard.writeText(link)
    alert('Link copied to clipboard!')
  }

  const handleSendWhatsApp = (guest: GuestData) => {
    if (!guest.whatsapp) return
    
    const whatsappUrl = getWhatsAppUrl(guest.whatsapp, guest.name, guest.slug, whatsappMessageTemplate)
    window.open(whatsappUrl, '_blank')
  }

  const handleDownloadTemplate = () => {
    const csvContent = [
      ['name', 'session', 'totalGuest', 'whatsapp'],
      ['John Doe', '1', '2', '628123456789'],
      ['Jane Smith', '2', '1', '628987654321'],
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'guests_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportResults(null)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        alert('CSV file is empty or invalid')
        return
      }

      // Parse CSV
      const headers = lines[0].split(',').map(h => h.trim())
      const guests = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const guest: any = {}
        
        headers.forEach((header, index) => {
          guest[header] = values[index] || ''
        })

        if (guest.name) {
          guests.push(guest)
        }
      }

      if (guests.length === 0) {
        alert('No valid guests found in CSV')
        return
      }

      // Send to API
      const response = await fetch('/api/admin/guests/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guests }),
      })

      const data = await response.json()

      if (response.ok) {
        setImportResults(data.results)
        await fetchGuests()
        alert(
          `Import completed!\nSuccess: ${data.results.success.length}\nFailed: ${data.results.failed.length}`
        )
      } else {
        alert(`Import failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Error importing CSV:', error)
      alert('Error reading CSV file')
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Guests</h1>
          <p className="text-gray-700 font-medium">Manage wedding guests and invitations</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
            title="Download CSV Template"
          >
            <Download className="w-5 h-5" />
            Template
          </button>
          <button
            onClick={handleImportClick}
            disabled={isImporting}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
            title="Import from CSV"
          >
            {isImporting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            Import CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleAddGuest}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Guest
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search guests..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Session Filter */}
            <select
              value={sessionFilter}
              onChange={e => setSessionFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900 font-medium"
            >
              <option value="all">All Sessions</option>
              <option value="1">Session 1</option>
              <option value="2">Session 2</option>
            </select>
          </div>

          {/* Sort Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Sorted by:</span>
            <span className="text-gray-900 font-semibold">
              {sortBy === 'name' ? 'Name' : sortBy === 'session' ? 'Session' : 'Total Guests'}
            </span>
            <span className="text-gray-500">
              ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-2" />
            <p className="text-gray-700 font-medium">Loading guests...</p>
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-700 font-medium">No guests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider hover:text-gray-900 transition-colors"
                    >
                      Name
                      <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('session')}
                      className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider hover:text-gray-900 transition-colors"
                    >
                      Session
                      <SortIcon field="session" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('totalGuest')}
                      className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider hover:text-gray-900 transition-colors"
                    >
                      Total Guests
                      <SortIcon field="totalGuest" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    WhatsApp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Link
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGuests.map(guest => (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {guest.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Session {guest.session}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {guest.totalGuest}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {guest.whatsapp || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleCopyLink(guest)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                        title="Copy invitation link"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        {guest.whatsapp && (
                          <button
                            onClick={() => handleSendWhatsApp(guest)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Send via WhatsApp"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditGuest(guest)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit guest"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(guest)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete guest"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <GuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchGuests}
        guest={selectedGuest}
        mode={modalMode}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Guest"
        message={`Are you sure you want to delete ${guestToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  )
}
