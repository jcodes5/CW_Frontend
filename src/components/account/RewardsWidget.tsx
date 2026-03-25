import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RecyclingOutlined, StarOutlined, CardGiftcardOutlined,
  CheckCircleOutlined, InfoOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { rewardsApi, type RewardsDTO, type RedemptionResult } from '@/services/api'
import { useUIStore } from '@/store/uiStore'

const TIER_CONFIG = {
  bronze:   { label: 'Bronze',   color: '#CD7F32', bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   icon: '🥉' },
  silver:   { label: 'Silver',   color: '#C0C0C0', bg: 'bg-gray-50',    border: 'border-gray-200',    text: 'text-gray-600',    icon: '🥈' },
  gold:     { label: 'Gold',     color: '#FFD700', bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-700',  icon: '🥇' },
  platinum: { label: 'Platinum', color: '#E5E4E2', bg: 'bg-purple-50',  border: 'border-purple-200',  text: 'text-purple-700',  icon: '💎' },
}

interface Props {
  compact?: boolean
}

export default function RewardsWidget({ compact = false }: Props) {
  const [rewards, setRewards]         = useState<RewardsDTO | null>(null)
  const [loading, setLoading]         = useState(true)
  const [redeeming, setRedeeming]     = useState(false)
  const [showRedeemModal, setModal]   = useState(false)
  const [redeemResult, setResult]     = useState<RedemptionResult | null>(null)
  const addToast = useUIStore((s) => s.addToast)

  useEffect(() => {
    rewardsApi.get()
      .then((res) => setRewards(res.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleRedeem = async (type: 'cashback' | 'discount_code') => {
    setRedeeming(true)
    try {
      const res = await rewardsApi.redeem(type)
      setResult(res.data ?? null)
      // Refresh rewards balance
      const updated = await rewardsApi.get()
      setRewards(updated.data ?? null)
      addToast({ type: 'success', message: '🎉 Reward redeemed successfully!' })
    } catch (err) {
      addToast({ type: 'error', message: err instanceof Error ? err.message : 'Redemption failed' })
    } finally {
      setRedeeming(false)
    }
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-card flex items-center justify-center ${compact ? 'p-4 h-20' : 'p-6 h-40'}`}>
        <CircularProgress size={24} sx={{ color: '#1A7A8A' }} />
      </div>
    )
  }

  if (!rewards) return null

  const tier = TIER_CONFIG[rewards.tier as keyof typeof TIER_CONFIG] ?? TIER_CONFIG.bronze

  if (compact) {
    return (
      <div className={`rounded-xl p-4 border ${tier.bg} ${tier.border}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: tier.color }}>
            {tier.icon} {tier.label} Member
          </span>
          <span className="font-bold text-sm text-gray-900">{rewards.points.toLocaleString()} pts</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${rewards.progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: tier.color }}
          />
        </div>
        <p className="text-[10px] text-gray-500 mt-1">
          {rewards.canRedeem
            ? '🎉 Ready to redeem!'
            : `${rewards.pointsToReward} pts to reward`}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-5 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${tier.color}25, ${tier.color}10)` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{tier.icon}</span>
                <span className="font-bold text-base" style={{ color: tier.color }}>
                  {tier.label} Member
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {rewards.tierMultiplier > 1
                  ? `${rewards.tierMultiplier}× points on every purchase`
                  : 'Earn 10 points per ₦1,000 spent'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-3xl text-gray-900">
                {rewards.points.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">points balance</p>
            </div>
          </div>

          {/* Tier upgrade hint */}
          {rewards.nextTier && rewards.pointsToNextTier > 0 && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <InfoOutlined sx={{ fontSize: 12 }} />
              {rewards.pointsToNextTier.toLocaleString()} lifetime pts to{' '}
              <strong className="capitalize">{rewards.nextTier}</strong>
            </p>
          )}
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Progress to reward */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                <CardGiftcardOutlined sx={{ fontSize: 16, color: '#1A7A8A' }} />
                Progress to Reward
              </span>
              <span className="text-sm font-bold text-teal-600">
                {rewards.progress}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rewards.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                className="h-full rounded-full relative"
                style={{
                  background: rewards.canRedeem
                    ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                    : `linear-gradient(90deg, #1A7A8A, #7BC8D8)`,
                }}
              >
                {rewards.canRedeem && (
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                )}
              </motion.div>
              {/* Milestone marker at 100% */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full
                              border-2 border-white bg-gray-200 flex items-center justify-center shadow-sm">
                <span className="text-[8px]">🎁</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-1.5 text-xs text-gray-500">
              <span>{rewards.points.toLocaleString()} / {rewards.rewardThreshold.toLocaleString()} pts</span>
              {rewards.canRedeem ? (
                <span className="text-green-600 font-semibold">✓ Reward unlocked!</span>
              ) : (
                <span>{rewards.pointsToReward.toLocaleString()} pts to go</span>
              )}
            </div>
          </div>

          {/* Reward options */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Available Rewards
            </p>
            <div className="grid grid-cols-2 gap-3">
              <RewardOption
                emoji="💵"
                title={`₦${rewards.cashbackValue} Cashback`}
                sub="Credited to your wallet"
                color="#22c55e"
                disabled={!rewards.canRedeem}
                onClick={() => { if (rewards.canRedeem) { setModal(true) } }}
                type="cashback"
                onRedeem={handleRedeem}
                loading={redeeming}
              />
              <RewardOption
                emoji="🎟️"
                title={`${rewards.discountPercent}% Discount`}
                sub="Code valid for 30 days"
                color="#1A7A8A"
                disabled={!rewards.canRedeem}
                onClick={() => { if (rewards.canRedeem) { setModal(true) } }}
                type="discount_code"
                onRedeem={handleRedeem}
                loading={redeeming}
              />
            </div>
          </div>

          {/* Earning info */}
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-3">
            <p className="text-xs text-teal-700 leading-relaxed">
              <strong>Earn {rewards.tierMultiplier > 1 ? `${rewards.tierMultiplier}× ` : ''}points</strong> on every purchase.
              {' '}{rewards.tierMultiplier > 1
                ? `Your ${tier.label} status gives you a ${rewards.tierMultiplier}× multiplier!`
                : 'Earn 10 pts per ₦1,000 spent. Upgrade your tier for bonus multipliers.'}
            </p>
          </div>
        </div>
      </div>

      {/* Redemption success modal */}
      <AnimatePresence>
        {redeemResult && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setResult(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         bg-white rounded-3xl p-8 shadow-2xl z-50 w-full max-w-sm mx-4 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="text-5xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="font-display font-bold text-gray-900 text-2xl mb-2">Reward Redeemed!</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Your reward coupon code is ready:
              </p>
              <div className="bg-teal-50 border-2 border-teal-200 rounded-xl px-5 py-3 mb-4">
                <p className="font-mono font-bold text-teal-700 text-lg tracking-wider">
                  {redeemResult.couponCode}
                </p>
                <p className="text-xs text-teal-500 mt-1">Valid for 30 days</p>
              </div>
              <p className="text-xs text-gray-400 mb-5">
                Use this code at checkout to apply your reward.
              </p>
              <button onClick={() => setResult(null)} className="btn-primary w-full justify-center">
                <CheckCircleOutlined sx={{ fontSize: 18 }} />
                Got it!
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function RewardOption({
  emoji, title, sub, color, disabled, type, onRedeem, loading,
}: {
  emoji: string; title: string; sub: string; color: string; disabled: boolean
  type: 'cashback' | 'discount_code'; onRedeem: (t: 'cashback' | 'discount_code') => void
  loading: boolean; onClick?: () => void
}) {
  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={() => !disabled && onRedeem(type)}
      disabled={disabled || loading}
      className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all duration-200
        ${disabled
          ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
          : 'border-current hover:shadow-md cursor-pointer'}`}
      style={!disabled ? { borderColor: `${color}40`, backgroundColor: `${color}08` } : {}}
    >
      <span className="text-xl mb-2">{emoji}</span>
      <p className="font-semibold text-gray-900 text-sm">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
      {!disabled && (
        <span className="mt-2 text-xs font-bold" style={{ color }}>
          {loading ? 'Redeeming…' : 'Redeem →'}
        </span>
      )}
    </motion.button>
  )
}
