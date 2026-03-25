import { useEffect } from 'react'
import InfoPageLayout from '@/components/ui/InfoPageLayout'
import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  useEffect(() => { document.title = 'Privacy Policy | CraftworldCentre' }, [])
  return (
    <InfoPageLayout title="Privacy Policy" subtitle="How we collect, use, and protect your personal information." lastUpdated="November 2024">
      <p>CraftworldCentre ("we", "our", "us") is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights over it.</p>
      <h2>Information We Collect</h2>
      <p>We collect information you provide directly, including your name, email address, phone number, delivery address, and payment details when you make a purchase. We also collect usage data such as pages visited, products viewed, and device information to improve our services.</p>
      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process and fulfil your orders</li>
        <li>To send order confirmations and delivery updates</li>
        <li>To respond to your enquiries and support requests</li>
        <li>To send marketing communications (only with your consent)</li>
        <li>To improve our website and product offerings</li>
        <li>To comply with legal obligations</li>
      </ul>
      <h2>Payment Security</h2>
      <p>All payment transactions are processed securely through <strong>Paystack</strong>, a PCI DSS-compliant payment processor. We do not store your card details on our servers.</p>
      <h2>Data Sharing</h2>
      <p>We do not sell your personal data. We may share your information with trusted third-party service providers (such as delivery companies and payment processors) solely to fulfil your orders and operate our services.</p>
      <h2>Cookies</h2>
      <p>We use cookies to personalise your experience and analyse site traffic. You can control cookie preferences in our <Link to="/cookies">Cookie Policy</Link> or through your browser settings.</p>
      <h2>Your Rights</h2>
      <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, please <Link to="/contact">contact us</Link>. You may also unsubscribe from marketing emails at any time by clicking the unsubscribe link in any email we send.</p>
      <h2>Contact</h2>
      <p>For privacy-related enquiries, contact us at <strong>privacy@craftworldcentre.com</strong>.</p>
    </InfoPageLayout>
  )
}
