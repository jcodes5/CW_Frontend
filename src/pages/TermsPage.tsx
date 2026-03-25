import { useEffect } from 'react'
import InfoPageLayout from '@/components/ui/InfoPageLayout'
import { Link } from 'react-router-dom'

export default function TermsPage() {
  useEffect(() => { document.title = 'Terms of Service | CraftworldCentre' }, [])
  return (
    <InfoPageLayout title="Terms of Service" subtitle="The rules that govern your use of CraftworldCentre." lastUpdated="November 2024">
      <p>By accessing or using CraftworldCentre, you agree to be bound by these Terms of Service. Please read them carefully.</p>
      <h2>Use of the Platform</h2>
      <p>CraftworldCentre is an e-commerce marketplace for circular economy products. You must be at least 18 years old to make purchases. You are responsible for maintaining the confidentiality of your account credentials.</p>
      <h2>Product Listings</h2>
      <p>We strive to ensure all product descriptions and images are accurate. However, slight variations in colour, texture, or appearance may occur due to the handcrafted and upcycled nature of our products — these are features, not defects.</p>
      <h2>Pricing</h2>
      <p>All prices are displayed in Nigerian Naira (₦) and include VAT where applicable. Prices may change at any time, but changes will not affect orders already placed.</p>
      <h2>Orders & Payment</h2>
      <p>Placing an order constitutes an offer to purchase. Orders are confirmed only upon successful payment. We reserve the right to cancel orders for reasons including stock unavailability or suspected fraud.</p>
      <h2>Intellectual Property</h2>
      <p>All content on this platform — including images, text, brand names, and logos — is the property of CraftworldCentre or its partner brands and may not be reproduced without permission.</p>
      <h2>Limitation of Liability</h2>
      <p>CraftworldCentre is not liable for indirect or consequential losses arising from the use of our platform or products, to the maximum extent permitted by applicable Nigerian law.</p>
      <h2>Governing Law</h2>
      <p>These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved under Nigerian jurisdiction.</p>
      <h2>Contact</h2>
      <p>For questions about these terms, <Link to="/contact">contact us</Link>.</p>
    </InfoPageLayout>
  )
}
