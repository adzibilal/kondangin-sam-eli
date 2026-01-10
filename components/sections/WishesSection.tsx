'use client'

import dynamic from 'next/dynamic'

// Import WishesSection with no SSR to avoid Worker is not defined error
const WishesSection = dynamic(() => import('./WishesSectionClient'), {
  ssr: false,
})

export default WishesSection
