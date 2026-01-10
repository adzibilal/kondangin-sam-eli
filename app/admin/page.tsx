'use client'

import React, { useEffect, useState } from 'react'
import { Users, CheckSquare, MessageSquare, TrendingUp } from 'lucide-react'
import StatsCard from '@/components/admin/StatsCard'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalGuests: 0,
    totalRSVPs: 0,
    totalWishes: 0,
    attendingGuests: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [guestsRes, rsvpsRes, wishesRes] = await Promise.all([
        fetch('/api/admin/guests'),
        fetch('/api/admin/rsvp'),
        fetch('/api/admin/wishes'),
      ])

      const guestsData = await guestsRes.json()
      const rsvpsData = await rsvpsRes.json()
      const wishesData = await wishesRes.json()

      const attending = rsvpsData.rsvps?.filter(
        (r: any) => r.attendance === 'yes'
      ).length || 0

      setStats({
        totalGuests: guestsData.guests?.length || 0,
        totalRSVPs: rsvpsData.rsvps?.length || 0,
        totalWishes: wishesData.wishes?.length || 0,
        attendingGuests: attending,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to Sam & Eli Wedding Admin</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading stats...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Guests"
            value={stats.totalGuests}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Total RSVPs"
            value={stats.totalRSVPs}
            icon={CheckSquare}
            color="green"
          />
          <StatsCard
            title="Attending"
            value={stats.attendingGuests}
            icon={TrendingUp}
            color="purple"
          />
          <StatsCard
            title="Voice Wishes"
            value={stats.totalWishes}
            icon={MessageSquare}
            color="orange"
          />
        </div>
      )}
    </div>
  )
}
