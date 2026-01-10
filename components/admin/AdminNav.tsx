'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Users,
  CheckSquare,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  Settings,
} from 'lucide-react'

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/guests', icon: Users, label: 'Guests' },
    { href: '/admin/rsvp', icon: CheckSquare, label: 'RSVP' },
    { href: '/admin/wishes', icon: MessageSquare, label: 'Wishes' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <nav className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Sam & Eli</h1>
        <p className="text-gray-400 text-sm">Admin Dashboard</p>
      </div>

      {/* Navigation Items */}
      <ul className="space-y-2 flex-1">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white text-gray-900'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors w-full mt-4"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </nav>
  )
}
