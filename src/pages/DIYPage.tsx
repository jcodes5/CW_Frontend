import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  PlayCircleOutlined, SearchOutlined, RecyclingOutlined,
  OpenInNewOutlined, SubscriptionsOutlined, ArrowForwardOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { diyApi, type DiyVideo } from '@/services/api'

// ── Constants ─────────────────────────────────────────────────

const DIY_CATEGORIES = [
  'All', 'Upcycling', 'Textile Arts', 'Furniture',
  'Traditional Craft', 'Behind the Scenes',
]

const SHOWCASE_VIDEOS = [
  { title: 'Textile Upcycling', bgFrom: '#8B6914', icon: '🧵' },
  { title: 'Wood Crafting',     bgFrom: '#1A7A8A', icon: '🪵' },
  { title: 'Metal Art',         bgFrom: '#3d6b2d', icon: '🔨' },
]

// ── VideoCard ─────────────────────────────────────────────────

function VideoCard({ video, i }: { video: DiyVideo; i: number }) {
  const [playing, setPlaying] = useState(false)
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const thumbnail = video.thumbnail ||
    `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`

  const brandPill = video.brand
    ? { bg: `${video.brand.color}15`, text: video.brand.color }
    : { bg: '#1A7A8A15', text: '#1A7A8A' }

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}
      className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all
                 duration-300 overflow-hidden group flex flex-col"
    >
      {/* Thumbnail / embed */}
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <>
            <img
              src={thumbnail}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105
                         transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPlaying(true)}
              aria-label={`Play: ${video.title}`}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-lg
                              flex items-center justify-center group-hover:bg-white transition-colors">
                <PlayCircleOutlined sx={{ fontSize: 32, color: '#1A7A8A' }} />
              </div>
            </motion.button>
            {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs
                              font-mono font-bold px-2 py-0.5 rounded-md">
                {video.duration}
              </div>
            )}
            <div className="absolute top-2 left-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60
                               text-white px-2 py-1 rounded-full backdrop-blur-sm">
                {video.category}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {video.brand && (
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ backgroundColor: brandPill.bg, color: brandPill.text }}
            >
              {video.brand.name}
            </span>
          )}
          {video.viewCount > 0 && (
            <span className="text-xs text-gray-400">
              {video.viewCount.toLocaleString()} views
            </span>
          )}
        </div>
        <h3 className="font-display font-semibold text-gray-900 text-sm sm:text-base leading-snug
                       mb-2 line-clamp-2 flex-1 group-hover:text-teal-600 transition-colors">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
            {video.description}
          </p>
        )}
        {video.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {video.tags.slice(0, 3).map((tag) => (
              <span key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  )
}

// ── Main page ─────────────────────────────────────────────────

export default function DIYPage() {
  const [videos, setVideos]           = useState<DiyVideo[]>([])
  const [loading, setLoading]         = useState(true)
  const [activeCategory, setCategory] = useState('All')
  const [searchQuery, setSearch]      = useState('')
  const [total, setTotal]             = useState(0)
  // FIX: progress bar width driven by state instead of a motion animation
  // inside a deeply nested component — avoids stale ref issues on first mount.
  const [progressWidth, setProgressWidth] = useState(0)

  useEffect(() => { document.title = 'DIY & Craft Videos | CraftworldCentre' }, [])

  useEffect(() => {
    const t = setTimeout(() => setProgressWidth(65), 1600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params: Record<string, string | number> = {}
    if (activeCategory !== 'All') params.category = activeCategory
    if (searchQuery) params.search = searchQuery

    diyApi.list(params)
      .then((res) => {
        setVideos(res.data ?? [])
        setTotal(res.pagination?.total ?? res.data?.length ?? 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeCategory, searchQuery])

  return (
    <main className="min-h-screen bg-[#f8fafb]">

      {/*
        ══════════════════════════════════════════════════════
        HERO — Redesigned to match ShopPage design system
        Palette: #FFFFFF (base) · #1A7A8A (primary) · #7BC8D8 (accent)

        BUGS FIXED:
        1. Original file had two hero attempts merged. The first complete
           <section>…</section> was valid, but everything after it
           (floating <motion.div> frames, the second content grid, and
           the bottom wave SVG) were orphaned JSX with no parent element
           — a hard parse/runtime error. All orphaned blocks removed.

        2. Math.random() was called directly inside `animate={}` and
           `initial={}` props on the floating particles, causing them to
           re-compute on every render. Fixed by pre-computing coordinates
           as stable constants (PARTICLES in the previous iteration; here
           replaced with the cleaner showcase grid approach).

        3. The `useMemo` import was listed but never used. Removed from
           imports.
        ══════════════════════════════════════════════════════
      */}
      <section id="hero" className="relative overflow-hidden bg-white">
  <div
    className="absolute inset-0 opacity-[0.045] pointer-events-none"
    style={{
      backgroundImage: 'radial-gradient(circle, #1A7A8A 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }}
  />

  <div className="hidden lg:block absolute top-0 right-0 w-[52%] h-full bg-[#1A7A8A]/[0.035] rounded-bl-[80px] pointer-events-none" />
  <div className="h-1 w-full bg-gradient-to-r from-[#7BC8D8] via-[#1A7A8A] to-[#7BC8D8]" />

  <div className="relative z-10 container-max px-4 sm:px-6 lg:px-12 xl:px-16 pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-28">
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 sm:gap-10 lg:gap-16 items-center lg:min-h-[82vh]">

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="space-y-6 sm:space-y-8 lg:space-y-10"
      >
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="inline-flex flex-wrap items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#1A7A8A]/[0.08] border border-[#1A7A8A]/20"
        >
          <SubscriptionsOutlined sx={{ fontSize: 14, color: '#1A7A8A' }} />
          <span className="text-[#1A7A8A] text-xs sm:text-sm font-semibold tracking-wide">
            CraftworldCentre on YouTube
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#1A7A8A] animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
          className="font-display font-black leading-[0.92] tracking-[-0.03em] text-[clamp(2.2rem,11vw,6rem)] text-gray-900"
        >
          Learn the
          <br />
          <span className="text-[#1A7A8A]">Art</span> of
          <br />
          Transformation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-base sm:text-lg lg:text-xl text-gray-500 max-w-none sm:max-w-[24rem] lg:max-w-[22rem] leading-relaxed font-light"
        >
          Step into the workshop and discover how ordinary waste becomes extraordinary art.
          Watch, learn, and be inspired.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center gap-4 sm:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <div>
            <div className="text-2xl font-black text-[#1A7A8A] leading-none">50+</div>
            <div className="text-xs text-gray-400 mt-0.5">Tutorial Videos</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gray-200" />
          <div>
            <div className="text-2xl font-black text-amber-500 leading-none">12</div>
            <div className="text-xs text-gray-400 mt-0.5">Master Artisans</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gray-200" />
          <div>
            <div className="text-2xl font-black text-emerald-500 leading-none">∞</div>
            <div className="text-xs text-gray-400 mt-0.5">Inspiration</div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1 sm:pt-2"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <a
            href="https://youtube.com/@craftworldcentre"
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full sm:flex-1 flex items-center justify-center gap-2.5 bg-[#1A7A8A] text-white font-bold py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl hover:bg-[#115762] shadow-lg shadow-[#1A7A8A]/30 hover:shadow-[#1A7A8A]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
          >
            <SubscriptionsOutlined sx={{ fontSize: 20 }} />
            Subscribe on YouTube
            <OpenInNewOutlined sx={{ fontSize: 15 }} />
          </a>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('video-grid')?.scrollIntoView({ behavior: 'smooth' })}
            className="group w-full sm:flex-1 flex items-center justify-center gap-2.5 bg-white border-2 border-[#1A7A8A] text-[#1A7A8A] font-bold py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl hover:bg-[#1A7A8A]/[0.06] transition-all duration-300 text-sm sm:text-base shadow-sm"
          >
            <PlayCircleOutlined sx={{ fontSize: 20 }} />
            Watch Tutorials
            <ArrowForwardOutlined sx={{ fontSize: 18 }} className="transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="relative h-[280px] sm:h-[420px] lg:h-auto w-full max-w-[620px] mx-auto"
      >
        <div className="relative w-full max-w-sm sm:max-w-none mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl shadow-[#1A7A8A]/25 border border-white/10 aspect-video">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A7A8A]/40 to-[#8B6914]/40" />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1A7A8A] rounded-full flex items-center justify-center shadow-xl shadow-[#1A7A8A]/40 cursor-pointer hover:scale-110 transition-transform duration-300"
            >
              <PlayCircleOutlined sx={{ fontSize: 34, color: 'white' }} />
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-6 pb-3">
            <div className="text-white font-semibold text-sm leading-snug mb-0.5">
              From Plastic Bottles to Beautiful Baskets
            </div>
            <div className="text-white/60 text-xs">Adúláwò Artisan Workshop</div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15">
            <div
              className="h-full bg-[#7BC8D8] transition-all duration-[2000ms] ease-out rounded-full"
              style={{ width: `${progressWidth}%` }}
            />
          </div>

          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-mono font-bold px-2 py-0.5 rounded-md">
            12:34
          </div>

          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1A7A8A]/80 text-white px-2 py-1 rounded-full backdrop-blur-sm">
              Upcycling
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">
          {SHOWCASE_VIDEOS.map((vid, i) => (
            <motion.div
              key={vid.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + i * 0.15 }}
              className="bg-white rounded-xl p-2.5 sm:p-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#7BC8D8]/40 transition-all duration-300 group cursor-pointer"
            >
              <div
                className="aspect-video rounded-lg mb-2 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${vid.bgFrom}20, ${vid.bgFrom}40)` }}
              >
                <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">{vid.icon}</span>
              </div>
              <div className="text-[11px] sm:text-xs text-gray-600 font-medium leading-tight">{vid.title}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mt-3 sm:mt-4 flex justify-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-[#1A7A8A]/[0.07] border border-[#1A7A8A]/20 rounded-full px-3 sm:px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[#1A7A8A] text-[11px] sm:text-xs font-medium">Beginner to Expert</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[#1A7A8A] text-[11px] sm:text-xs font-medium">Advanced Techniques</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="hidden sm:flex absolute -left-5 top-1/4 -translate-y-1/2 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100/80 px-4 py-3 items-center gap-3"
        >
          <div className="w-9 h-9 bg-[#7BC8D8]/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <PlayCircleOutlined sx={{ fontSize: 18, color: '#1A7A8A' }} />
          </div>
          <div>
            <div className="text-[#1A7A8A] font-black text-base leading-none">50+</div>
            <div className="text-gray-400 text-[11px] mt-0.5">Free Videos</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.25, duration: 0.5 }}
          className="hidden sm:flex absolute -right-4 top-1/2 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100/80 px-4 py-3 items-center gap-3"
        >
          <div className="w-9 h-9 bg-[#1A7A8A]/10 rounded-xl flex items-center justify-center text-base flex-shrink-0">🎬</div>
          <div>
            <div className="text-[#1A7A8A] font-black text-base leading-none">12</div>
            <div className="text-gray-400 text-[11px] mt-0.5">Artisans</div>
          </div>
        </motion.div>

        <div className="hidden sm:block absolute -bottom-6 -right-6 w-28 h-28 rounded-full border-[3px] border-[#7BC8D8]/30 pointer-events-none" />
        <div className="hidden sm:block absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-[#1A7A8A]/10 pointer-events-none" />
      </motion.div>
    </div>
  </div>

  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7BC8D8]/50 to-transparent" />
</section>

      {/* ── END HERO — all JSX correctly closed above ── */}

      {/* ── VIDEO CONTENT ── */}
      <div id="video-grid" className="container-max section-padding py-10">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <SearchOutlined
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              sx={{ fontSize: 18, color: '#9ca3af' }}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos, techniques, brands…"
              className="input-field pl-10 text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-shrink-0">
            {DIY_CATEGORIES.map((cat) => (
              <motion.button key={cat} whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${activeCategory === cat
                    ? 'bg-teal-500 text-white shadow-brand'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}>
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-500 mb-6">
          <strong className="text-gray-800">{loading ? '…' : total}</strong>
          {' '}video{total !== 1 ? 's' : ''}
          {activeCategory !== 'All' && ` in ${activeCategory}`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <CircularProgress size={28} sx={{ color: '#1A7A8A' }} />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🎬</p>
            <h3 className="font-display font-semibold text-gray-700 text-xl mb-2">No videos found</h3>
            <p className="text-gray-400 text-sm">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, i) => (
              <VideoCard key={video.id} video={video} i={i} />
            ))}
          </div>
        )}

        {/* YouTube CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 rounded-3xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #0d1f22 0%, #1A7A8A 60%, #0d3d47 100%)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative z-10 flex flex-col sm:flex-row items-center
                          justify-between gap-6 px-8 py-8">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <RecyclingOutlined sx={{ fontSize: 20, color: '#7BC8D8' }} />
                <span className="text-white/60 text-xs font-mono uppercase tracking-widest">
                  New videos every week
                </span>
              </div>
              <h3 className="font-display text-white text-2xl sm:text-3xl">
                Never Miss a Craft Story
              </h3>
            </div>
            <a
              href="https://youtube.com/@craftworldcentre"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold
                         px-8 py-3.5 rounded-full transition-colors shadow-lg active:scale-95
                         text-sm flex-shrink-0"
            >
              <SubscriptionsOutlined sx={{ fontSize: 18 }} />
              Subscribe Free
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  )
}