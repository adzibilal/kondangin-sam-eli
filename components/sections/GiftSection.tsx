'use client'

import React, { useState } from 'react'

export default function GiftSection() {
  const [copiedBank, setCopiedBank] = useState<string | null>(null)

  const giftOptions = [
    {
      id: 'bca',
      bank: 'BCA: Eli Tio',
      accountNumber: '2210044810',
    },
    {
      id: 'gopay',
      bank: 'Gopay: Eli Tio',
      accountNumber: '6281289166607',
    },
  ]

  const copyToClipboard = (text: string, bankId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedBank(bankId)
    setTimeout(() => setCopiedBank(null), 2000)
  }

  return (
    <section className="bg-white px-6 py-6">
      <div className="mx-auto">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="font-lexend-deca text-primary text-3xl font-normal">
            Tanda Kasih
          </h2>
        </div>

        {/* Gift Cards */}
        <div className="space-y-4">
          {giftOptions.map(option => (
            <div key={option.id} className="">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-public-sans text-primary mb-3 font-medium">
                    {option.bank}
                  </h3>
                  <p className="font-public-sans bg-primary/5 text-primary flex items-center justify-between rounded-lg border border-gray-300 px-4 py-3 text-base">
                    {option.accountNumber}
                    <button
                      onClick={() =>
                        copyToClipboard(option.accountNumber, option.id)
                      }
                      className="shrink-0 rounded-lg p-1 transition-colors hover:bg-gray-200"
                      aria-label="Copy account number"
                    >
                      {copiedBank === option.id ? (
                        <svg
                          className="text-primary h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="text-primary h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
