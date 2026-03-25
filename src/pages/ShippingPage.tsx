import { useEffect } from 'react'
import InfoPageLayout from '@/components/ui/InfoPageLayout'
import { Link } from 'react-router-dom'

export default function ShippingPage() {
  useEffect(() => { document.title = 'Shipping Information | CraftworldCentre' }, [])
  return (
    <InfoPageLayout title="Shipping Information" subtitle="Everything you need to know about how we get your order to you." lastUpdated="November 2024">
      <h2>Delivery Zones & Timeframes</h2>
      <table>
        <thead><tr><th>Zone</th><th>States</th><th>Delivery Time</th><th>Fee</th></tr></thead>
        <tbody>
          <tr><td>Zone 1</td><td>Lagos, Ogun</td><td>1–2 business days</td><td>₦2,000 – ₦2,500</td></tr>
          <tr><td>Zone 2</td><td>Oyo, Osun, Ekiti, Ondo</td><td>2–4 business days</td><td>₦3,000 – ₦3,500</td></tr>
          <tr><td>Zone 3</td><td>FCT, Rivers, Edo, Delta</td><td>2–4 business days</td><td>₦3,500 – ₦4,000</td></tr>
          <tr><td>Zone 4</td><td>Anambra, Enugu, Imo, Kano, Kaduna</td><td>3–5 business days</td><td>₦4,000 – ₦4,500</td></tr>
          <tr><td>Zone 5</td><td>All other states</td><td>4–7 business days</td><td>₦5,000</td></tr>
        </tbody>
      </table>
      <h2>Free Delivery</h2>
      <p>All orders above <strong>₦25,000</strong> qualify for free delivery, regardless of destination state. Free delivery is automatically applied at checkout.</p>
      <h2>Order Processing</h2>
      <p>Orders are processed within 24 hours of payment confirmation on business days (Monday–Friday). Orders placed on weekends or public holidays are processed the next business day.</p>
      <h2>Tracking Your Order</h2>
      <p>Once your order is dispatched, you will receive an SMS and email with your tracking details. You can also track your order from <strong>My Account → My Orders</strong> at any time.</p>
      <h2>Packaging</h2>
      <p>All orders are shipped in recycled and compostable packaging. We never use single-use plastic in our fulfilment process. Fragile items are wrapped in recycled tissue paper and kraft paper padding.</p>
      <h2>Missed Deliveries</h2>
      <p>If you miss your delivery, our courier will attempt redelivery the following business day. After two failed attempts, the package is held at a local pickup point for 5 days before being returned to us.</p>
      <h2>Questions?</h2>
      <p>For any delivery-related questions, please <Link to="/contact">contact our support team</Link>.</p>
    </InfoPageLayout>
  )
}
