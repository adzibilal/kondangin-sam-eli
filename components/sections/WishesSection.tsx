'use client'

import React, { useState } from 'react'

interface Wish {
  id: number
  name: string
  message: string
  attendance: string
  date: string
}

export default function WishesSection() {
  const [wishes, setWishes] = useState<Wish[]>([
    {
      id: 1,
      name: 'John Doe',
      message:
        'Congratulations on your special day! Wishing you both a lifetime of love and happiness.',
      attendance: 'Attending',
      date: '2024-01-05',
    },
    {
      id: 2,
      name: 'Jane Smith',
      message:
        'So happy for you both! May your marriage be filled with joy and laughter.',
      attendance: 'Attending',
      date: '2024-01-04',
    },
  ])

  const [formData, setFormData] = useState({
    name: '',
    message: '',
    attendance: 'attending',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newWish: Wish = {
      id: wishes.length + 1,
      name: formData.name,
      message: formData.message,
      attendance:
        formData.attendance === 'attending' ? 'Attending' : 'Not Attending',
      date: new Date().toISOString().split('T')[0],
    }

    setWishes([newWish, ...wishes])
    setFormData({ name: '', message: '', attendance: 'attending' })
  }

  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto max-w-4xl">
        {/* Section Title */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-serif text-4xl md:text-5xl">
            Wishes & Prayers
          </h2>
          <p className="text-gray-600">
            Send your best wishes and prayers for the happy couple
          </p>
        </div>

        {/* Wishes Form */}
        <div className="mb-12 rounded-lg bg-gray-50 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-rose-600"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="attendance"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Attendance *
              </label>
              <select
                id="attendance"
                required
                value={formData.attendance}
                onChange={e =>
                  setFormData({ ...formData, attendance: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-rose-600"
              >
                <option value="attending">Will Attend</option>
                <option value="not-attending">Cannot Attend</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Your Message *
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={e =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-rose-600"
                placeholder="Write your wishes and prayers..."
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-rose-600 px-6 py-3 font-medium text-white transition-colors hover:bg-rose-700"
            >
              Send Wishes
            </button>
          </form>
        </div>

        {/* Wishes List */}
        <div className="space-y-6">
          <h3 className="mb-6 text-2xl font-semibold">
            Guest Wishes ({wishes.length})
          </h3>

          <div className="max-h-[600px] space-y-4 overflow-y-auto">
            {wishes.map(wish => (
              <div
                key={wish.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">{wish.name}</h4>
                    <p className="text-sm text-gray-500">{wish.date}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      wish.attendance === 'Attending'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {wish.attendance}
                  </span>
                </div>
                <p className="text-gray-700">{wish.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
