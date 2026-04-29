import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircleOutlined, ErrorOutlineOutlined } from '@mui/icons-material'
import { CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'
import { walletApi } from '@/services/api'

export default function WalletDepositCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    document.title = 'Processing Deposit | CraftworldCentre'
    handleCallback()
  }, [searchParams])

  const handleCallback = async () => {
    try {
      const reference = searchParams.get('reference')

      if (!reference) {
        setStatus('error')
        toast.error('Invalid payment reference')
        setTimeout(() => navigate('/account/wallet?refresh=true'), 3000)
        return
      }

      // Verify the payment with the backend
      const response = await walletApi.verifyDeposit(reference)

      if (response.success) {
        setStatus('success')
        // Show success message and redirect
        toast.success('Wallet funded successfully!')
        // Redirect to wallet page after 2 seconds with refresh flag
        setTimeout(() => navigate('/account/wallet?refresh=true'), 2000)
      } else {
        setStatus('error')
        toast.error('Failed to verify payment. Please try again.')
        setTimeout(() => navigate('/account/wallet?refresh=true'), 3000)
      }
    } catch (err) {
      console.error('Wallet deposit verification failed:', err)
      setStatus('error')
      
      let errorMessage = 'Failed to verify payment'
      if (err instanceof Error) {
        errorMessage = err.message
      }
      
      toast.error(errorMessage)
      // Redirect back to wallet page after 3 seconds with refresh flag
      setTimeout(() => navigate('/account/wallet?refresh=true'), 3000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-6">
        {status === 'loading' && (
          <>
            <CircularProgress size={60} sx={{ color: '#0d9488' }} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
              <p className="text-gray-600">
                Please wait while we verify your payment...
              </p>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center">
              <CheckCircleOutlined sx={{ fontSize: 60, color: '#10b981' }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600">
                Your wallet has been funded. Redirecting to your wallet...
              </p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center">
              <ErrorOutlineOutlined sx={{ fontSize: 60, color: '#ef4444' }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
              <p className="text-gray-600">
                There was an issue processing your payment. You will be redirected to your wallet.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}