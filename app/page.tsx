import { Suspense } from 'react'
import HeroSection from '@/components/sections/HeroSection'
import BrideGroomSection from '@/components/sections/BrideGroomSection'
import EventDetailsSection from '@/components/sections/EventDetailsSection'
import CountdownSection from '@/components/sections/CountdownSection'
import GiftSection from '@/components/sections/GiftSection'
import GallerySection from '@/components/sections/GallerySection'
import RSVPSection from '@/components/sections/RSVPSection'
import Footer from '@/components/sections/Footer'
import WishesSection from '@/components/sections/WishesSection'

export default function Home() {
  return (
    <main
      className="font-public-sans mx-auto min-h-screen max-w-lg overflow-x-hidden bg-white"
      suppressHydrationWarning
    >
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection />
      </Suspense>
      <BrideGroomSection />
      <CountdownSection />
      <Suspense fallback={<div>Loading...</div>}>
        <EventDetailsSection />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <RSVPSection />
      </Suspense>
      <GallerySection />
      <GiftSection />
      <Suspense fallback={<div>Loading...</div>}>
        <WishesSection />
      </Suspense>
      <Footer />
    </main>
  )
}
