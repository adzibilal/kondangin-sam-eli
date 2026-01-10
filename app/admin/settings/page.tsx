'use client'

import React, { useEffect, useState } from 'react'
import { Save, Loader2, Settings as SettingsIcon, Info } from 'lucide-react'

const DEFAULT_MESSAGE = `The Wedding of Sam & Eli 

Dear {name},

You are invited! Dengan penuh sukacita, kami mengundang kamu untuk hadir di hari bahagia kami.

Akses undangan digital kami di sini untuk info lengkapnya:

{link}

Terima kasih atas doa dan dukungannya. We look forward to celebrating with you!

Best regards, Sam & Eli`

export default function SettingsPage() {
  const [whatsappMessage, setWhatsappMessage] = useState(DEFAULT_MESSAGE)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/whatsapp_message')
      
      if (response.ok) {
        const data = await response.json()
        setWhatsappMessage(data.value || DEFAULT_MESSAGE)
      } else {
        // If setting doesn't exist, use default
        setWhatsappMessage(DEFAULT_MESSAGE)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setWhatsappMessage(DEFAULT_MESSAGE)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'whatsapp_message',
          value: whatsappMessage,
          description: 'WhatsApp invitation message template',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      setSuccessMessage('Settings saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err: any) {
      console.error('Error saving settings:', err)
      setError(err.message || 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('Reset to default message template?')) {
      setWhatsappMessage(DEFAULT_MESSAGE)
    }
  }

  const insertPlaceholder = (placeholder: string) => {
    const textarea = document.getElementById('whatsappMessage') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = whatsappMessage
    const before = text.substring(0, start)
    const after = text.substring(end)
    
    setWhatsappMessage(before + placeholder + after)
    
    // Set cursor position after inserted placeholder
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + placeholder.length, start + placeholder.length)
    }, 0)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Settings</h1>
        <p className="font-medium text-gray-700">
          Manage application settings and configurations
        </p>
      </div>

      {/* Settings Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <SettingsIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                WhatsApp Invitation Message
              </h2>
              <p className="text-sm text-gray-600">
                Customize the message template sent via WhatsApp
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="py-12 text-center">
              <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-gray-400" />
              <p className="font-medium text-gray-700">Loading settings...</p>
            </div>
          ) : (
            <>
              {/* Info Box */}
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div>
                    <h3 className="mb-2 font-semibold text-blue-900">
                      Available Placeholders:
                    </h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-blue-100 px-2 py-1 font-mono text-blue-900">
                          {'{name}'}
                        </code>
                        <span>- Guest's name</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-blue-100 px-2 py-1 font-mono text-blue-900">
                          {'{link}'}
                        </code>
                        <span>- Invitation link</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Insert Buttons */}
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => insertPlaceholder('{name}')}
                  className="rounded-lg border-2 border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Insert {'{name}'}
                </button>
                <button
                  onClick={() => insertPlaceholder('{link}')}
                  className="rounded-lg border-2 border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Insert {'{link}'}
                </button>
              </div>

              {/* Message Textarea */}
              <div className="mb-4">
                <label
                  htmlFor="whatsappMessage"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Message Template
                </label>
                <textarea
                  id="whatsappMessage"
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  rows={12}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 font-mono text-sm text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-gray-900 focus:ring-2 focus:ring-gray-900"
                  placeholder="Enter your WhatsApp message template..."
                />
                <p className="mt-2 text-sm text-gray-600">
                  {whatsappMessage.length} characters
                </p>
              </div>

              {/* Success/Error Messages */}
              {successMessage && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-gray-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                  onClick={handleReset}
                  disabled={isSaving}
                  className="rounded-lg border-2 border-gray-300 px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reset to Default
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-bold text-gray-900">Preview</h3>
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
          <p className="whitespace-pre-wrap font-mono text-sm text-gray-700">
            {whatsappMessage
              .replace(/{name}/g, 'John Doe')
              .replace(/{link}/g, 'https://yourdomain.com/?guest=abc-123')}
          </p>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Preview with sample data (John Doe, sample link)
        </p>
      </div>
    </div>
  )
}
