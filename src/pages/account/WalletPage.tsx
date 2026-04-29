import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AccountBalanceWalletOutlined,
  AddOutlined,
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  HistoryOutlined,
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import { walletApi, type WalletDTO, type WalletTransactionDTO } from '@/services/api'
import { formatPrice } from '@/utils/mockData'

export default function WalletPage() {
  const [searchParams] = useSearchParams()
  const [wallet, setWallet] = useState<WalletDTO | null>(null)
  const [transactions, setTransactions] = useState<WalletTransactionDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDepositing, setIsDepositing] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [showDepositForm, setShowDepositForm] = useState(false)

  useEffect(() => {
    document.title = 'My Wallet | CraftworldCentre'
    fetchWalletData()
  }, [])

  // Effect to handle refresh parameter in URL
  useEffect(() => {
    const shouldRefresh = searchParams.get('refresh')
    if (shouldRefresh === 'true') {
      // Remove the refresh parameter from URL without triggering navigation
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('refresh');
      const newUrl = `${window.location.pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);

      // Fetch fresh data
      fetchWalletData();
    }
  }, [searchParams]) // This will run when searchParams changes

  const fetchWalletData = async () => {
    try {
      setIsLoading(true)
      // First get the wallet balance
      const walletRes = await walletApi.getBalance();
      setWallet(walletRes.data ?? null)
      
      // Then get transactions
      const transactionsRes = await walletApi.getTransactions(1, 10);
      setTransactions(transactionsRes.data?.data ?? [])
    } catch (err) {
      console.error('Failed to fetch wallet data:', err)
      toast.error('Failed to load wallet data. Please refresh the page.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeposit = async () => {
    const amount = Number(depositAmount)
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      setIsDepositing(true)
      const response = await walletApi.initializeDeposit(amount)

      console.log('Deposit response:', response)

      if (response.success && response.data?.authorizationUrl) {
        // Redirect to Paystack for payment
        window.location.href = response.data.authorizationUrl
      } else {
        console.error('Invalid response structure:', response)
        toast.error('Failed to get payment link. Please try again.')
      }
    } catch (err: unknown) {
      console.error('Deposit error:', err)
      
      let errorMessage = 'Failed to initialize deposit'
      
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'object' && err !== null) {
        const errorObj = err as Record<string, unknown>
        if (typeof errorObj.message === 'string') {
          errorMessage = errorObj.message
        }
      }
      
      // Provide helpful error messages
      if (errorMessage.includes('timeout') || errorMessage.includes('408')) {
        toast.error('Payment link request timed out. Please check your internet connection and try again.')
      } else if (errorMessage.includes('Session expired')) {
        toast.error('Your session has expired. Please log back in and try again.')
      } else if (errorMessage.includes('Insufficient') || errorMessage.includes('balance')) {
        toast.error('Payment failed. ' + errorMessage)
      } else {
        toast.error(errorMessage || 'Failed to initialize deposit. Please try again.')
      }
    } finally {
      setIsDepositing(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownwardOutlined className="text-green-500" />
      case 'payment':
        return <ArrowUpwardOutlined className="text-red-500" />
      case 'refund':
        return <ArrowDownwardOutlined className="text-blue-500" />
      default:
        return <HistoryOutlined className="text-gray-500" />
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit'
      case 'payment':
        return 'Payment'
      case 'refund':
        return 'Refund'
      case 'withdrawal':
        return 'Withdrawal'
      default:
        return type
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Wallet Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-4">
          <AccountBalanceWalletOutlined sx={{ fontSize: 32 }} />
          <div>
            <p className="text-teal-100 text-sm">Available Balance</p>
            <h2 className="text-3xl font-bold">
              {isLoading ? '...' : formatPrice(wallet?.balance ?? 0)}
            </h2>
          </div>
        </div>
        
        <button
          onClick={() => setShowDepositForm(true)}
          className="bg-white text-teal-600 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-teal-50 transition-colors"
        >
          <AddOutlined sx={{ fontSize: 18 }} />
          Add Money
        </button>
      </motion.div>

      {/* Deposit Form Modal */}
      {showDepositForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Add Money to Wallet</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum: ₦100</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDepositForm(false)
                    setDepositAmount('')
                  }}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeposit}
                  disabled={isDepositing || !depositAmount}
                  className="flex-1 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 disabled:opacity-50"
                >
                  {isDepositing ? 'Processing...' : 'Proceed to Pay'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Transaction History</h3>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {wallet?.balance === 0 ? 'No transactions yet. Add money to your wallet to get started!' : 'Loading transactions...'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {getTransactionIcon(tx.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{tx.description}</p>
                  <p className="text-xs text-gray-500">
                    {getTransactionLabel(tx.type)} • {new Date(tx.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className={`font-semibold ${
                  tx.type === 'payment' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {tx.type === 'payment' ? '-' : '+'}{formatPrice(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}