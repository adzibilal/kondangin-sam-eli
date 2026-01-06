import HeroSection from '@/components/sections/HeroSection'
import BrideGroomSection from '@/components/sections/BrideGroomSection'
import EventDetailsSection from '@/components/sections/EventDetailsSection'
import CountdownSection from '@/components/sections/CountdownSection'
import GiftSection from '@/components/sections/GiftSection'
import GallerySection from '@/components/sections/GallerySection'
import WishesSection from '@/components/sections/WishesSection'
import RSVPSection from '@/components/sections/RSVPSection'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <main
      className="font-public-sans mx-auto min-h-screen max-w-lg bg-white"
      suppressHydrationWarning
    >
      <HeroSection />
      <BrideGroomSection />
      <CountdownSection />
      <EventDetailsSection />
      <RSVPSection />
      <GallerySection />
      <GiftSection />
      {/* <WishesSection /> */}
      <Footer />
    </main>
  )
}
