import { useEffect } from 'react'
import InfoPageLayout from '@/components/ui/InfoPageLayout'
import { Link } from 'react-router-dom'

export default function ReturnsPage() {
  useEffect(() => { document.title = 'Returns & Refunds | CraftworldCentre' }, [])
  return (
    <InfoPageLayout title="Returns & Refunds Policy" subtitle="We want you to love everything you buy. If something isn't right, here's how we'll make it right." lastUpdated="November 2024">
      <h2>Return Window</h2>
      <p>You may return most items within <strong>14 days</strong> of delivery for a full refund or exchange. Items must be unused, in their original condition, and in original packaging where applicable.</p>
      <h2>Non-Returnable Items</h2>
      <p>The following items cannot be returned: personalised or custom-made items, digital downloads, items marked as "Final Sale", perishable goods, and items that have been used or damaged after delivery.</p>
      <h2>How to Initiate a Return</h2>
      <ol>
        <li>Log in to your account and go to <strong>My Orders</strong>.</li>
        <li>Select the order containing the item(s) you wish to return.</li>
        <li>Click <strong>"Request Return"</strong> and follow the instructions.</li>
        <li>Alternatively, <Link to="/contact">contact our support team</Link> with your order reference.</li>
      </ol>
      <h2>Return Shipping</h2>
      <p>For returns due to our error (damaged, wrong item, or defective product), we will cover the full return shipping cost. For change-of-mind returns, the customer is responsible for return shipping fees.</p>
      <h2>Refund Processing</h2>
      <p>Once we receive and inspect your return (within 3–5 business days of receipt), your refund will be processed within <strong>5–7 business days</strong> back to your original payment method.</p>
      <h2>Damaged or Defective Items</h2>
      <p>If you receive a damaged or defective item, please <Link to="/contact">contact us</Link> within 48 hours of delivery with photos of the damage. We will arrange a free replacement or full refund at no cost to you.</p>
    </InfoPageLayout>
  )
}
