'use client'

import React, { useEffect, useState } from 'react'
import { Trash2, Loader2, Download, Filter } from 'lucide-react'
import { RSVPData } from '@/types'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

export default function RSVPPage() {
  const [rsvps, setRsvps] = useState<RSVPData[]>([])
  const [filteredRsvps, setFilteredRsvps] = useState<RSVPData[]>([])
  const [guests, setGuests] = useState<Map<string, string>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [attendanceFilter, setAttendanceFilter] = useState<string>('all')

  // Delete dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [rsvpToDelete, setRsvpToDelete] = useState<RSVPData | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchRSVPs()
  }, [])

  useEffect(() => {
    filterRSVPs()
  }, [rsvps, attendanceFilter])

  const fetchRSVPs = async () => {
    setIsLoading(true)
    try {
      const [rsvpsRes, guestsRes] = await Promise.all([
        fetch('/api/admin/rsvp'),
        fetch('/api/admin/guests'),
      ])
      
      const rsvpsData = await rsvpsRes.json()
      const guestsData = await guestsRes.json()
      
      // Create guest slug to name mapping
      const guestMap = new Map<string, string>()
      guestsData.guests?.forEach((guest: any) => {
        guestMap.set(guest.slug, guest.name)
      })
      
      setGuests(guestMap)
      setRsvps(rsvpsData.rsvps || [])
    } catch (error) {
      console.error('Error fetching RSVPs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterRSVPs = () => {
    let filtered = [...rsvps]

    if (attendanceFilter !== 'all') {
      filtered = filtered.filter(rsvp => rsvp.attendance === attendanceFilter)
    }

    setFilteredRsvps(filtered)
  }

  const handleDeleteClick = (rsvp: RSVPData) => {
    setRsvpToDelete(rsvp)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!rsvpToDelete?.id) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/rsvp?id=${rsvpToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchRSVPs()
        setIsDeleteDialogOpen(false)
      }
    } catch (error) {
      console.error('Error deleting RSVP:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['Name', 'Attendance', 'Guest Count', 'Submitted At'],
      ...filteredRsvps.map(rsvp => [
        rsvp.name,
        rsvp.attendance === 'yes' ? 'Yes' : 'No',
        rsvp.guestCount.toString(),
        formatDate(rsvp.submittedAt),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rsvps-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
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

  const stats = {
    total: rsvps.length,
    attending: rsvps.filter(r => r.attendance === 'yes').length,
    notAttending: rsvps.filter(r => r.attendance === 'no').length,
    totalGuests: rsvps
      .filter(r => r.attendance === 'yes')
      .reduce((sum, r) => sum + r.guestCount, 0),
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">RSVP Management</h1>
        <p className="text-gray-700 font-medium">View and manage guest confirmations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-700 font-medium mb-1">Total Responses</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-700 font-medium mb-1">Attending</p>
          <p className="text-2xl font-bold text-green-600">{stats.attending}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-700 font-medium mb-1">Not Attending</p>
          <p className="text-2xl font-bold text-red-600">{stats.notAttending}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-700 font-medium mb-1">Total Guests Coming</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalGuests}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={attendanceFilter}
              onChange={e => setAttendanceFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900 font-medium"
            >
              <option value="all">All Responses</option>
              <option value="yes">Attending</option>
              <option value="no">Not Attending</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={filteredRsvps.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-2" />
            <p className="text-gray-700 font-medium">Loading RSVPs...</p>
          </div>
        ) : filteredRsvps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-700 font-medium">No RSVPs found</p>
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
                    RSVP Name (Submitted)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Guest Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRsvps.map(rsvp => {
                  const guestNameFromTable = rsvp.guestSlug
                    ? guests.get(rsvp.guestSlug) || 'Unknown'
                    : 'Legacy Entry'
                  
                  return (
                    <tr key={rsvp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {guestNameFromTable}
                        {rsvp.guestSlug && (
                          <span className="ml-2 text-xs text-gray-500">
                            (linked)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {rsvp.name}
                      </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          rsvp.attendance === 'yes'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {rsvp.attendance === 'yes' ? 'Attending' : 'Not Attending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {rsvp.guestCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(rsvp.submittedAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => handleDeleteClick(rsvp)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete RSVP"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
        title="Delete RSVP"
        message={`Are you sure you want to delete RSVP from ${rsvpToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  )
}
