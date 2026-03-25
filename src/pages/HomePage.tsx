import { useEffect } from 'react'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import PartnersSection from '@/components/sections/PartnersSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import CategoriesSection from '@/components/sections/CategoriesSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import NewsletterSection from '@/components/sections/NewsletterSection'

export default function HomePage() {
  useEffect(() => {
    document.title = 'CraftworldCentre | Circular Economy Marketplace'
  }, [])

  return (
    <main aria-label="CraftworldCentre Homepage">
      <HeroSection />
      <StatsSection />
      <PartnersSection />
      <HowItWorksSection />
      <CategoriesSection />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  )
}
