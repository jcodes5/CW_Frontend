import { useEffect } from 'react'
import InfoPageLayout from '@/components/ui/InfoPageLayout'

export default function CookiesPage() {
  useEffect(() => { document.title = 'Cookie Policy | CraftworldCentre' }, [])
  return (
    <InfoPageLayout title="Cookie Policy" subtitle="How we use cookies to improve your experience." lastUpdated="November 2024">
      <p>Cookies are small text files placed on your device when you visit our website. We use them to personalise your experience, remember your preferences, and understand how visitors use our site.</p>
      <h2>Types of Cookies We Use</h2>
      <h3>Essential Cookies</h3>
      <p>These are required for the website to function. They include session cookies that keep you logged in, shopping cart persistence, and security tokens. You cannot opt out of these.</p>
      <h3>Analytics Cookies</h3>
      <p>We use anonymised analytics (e.g. page views, session duration) to understand how visitors use our site and improve it. This data does not identify you personally.</p>
      <h3>Preference Cookies</h3>
      <p>These remember your settings such as language preferences, recently viewed products, and filter choices so you don't have to reset them on each visit.</p>
      <h3>Marketing Cookies</h3>
      <p>Only set if you have opted in. These help us show you relevant advertisements on other platforms. You can opt out at any time below.</p>
      <h2>Managing Cookies</h2>
      <p>You can manage or disable cookies through your browser settings. Note that disabling essential cookies may affect site functionality. Most browsers allow you to block third-party cookies without affecting essential site functions.</p>
      <h2>Updates</h2>
      <p>We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated date.</p>
    </InfoPageLayout>
  )
}
