import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  PlayCircleOutlined, SearchOutlined, RecyclingOutlined,
  OpenInNewOutlined, SubscriptionsOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { diyApi, type DiyVideo } from '@/services/api'

const CATEGORIES = ['All', 'Upcycling', 'Textile Arts', 'Furniture', 'Traditional Craft', 'Behind the Scenes']

function VideoCard({ video, i }: { video: DiyVideo; i: number }) {
  const [playing, setPlaying] = useState(false)
  const ref  = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const thumbnail = video.thumbnail ||
    `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`

  const brandPill = video.brand
    ? { bg: `${video.brand.color}15`, text: video.brand.color }
    : { bg: '#1A7A8A15', text: '#1A7A8A' }

  return (
    <motion.article ref={ref}
      initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}
      className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300
                 overflow-hidden group flex flex-col">

      {/* Thumbnail / embed */}
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title} allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="absolute inset-0 w-full h-full" />
        ) : (
          <>
            <img src={thumbnail} alt={video.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={() => setPlaying(true)} aria-label={`Play: ${video.title}`}
              className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-lg
                              flex items-center justify-center group-hover:bg-white transition-colors">
                <PlayCircleOutlined sx={{ fontSize: 32, color: '#1A7A8A' }} />
              </div>
            </motion.button>
            {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-mono
                              font-bold px-2 py-0.5 rounded-md">{video.duration}</div>
            )}
            <div className="absolute top-2 left-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white
                               px-2 py-1 rounded-full backdrop-blur-sm">{video.category}</span>
            </div>
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {video.brand && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ backgroundColor: brandPill.bg, color: brandPill.text }}>
              {video.brand.name}
            </span>
          )}
          {video.viewCount > 0 && (
            <span className="text-xs text-gray-400">{video.viewCount.toLocaleString()} views</span>
          )}
        </div>
        <h3 className="font-display font-semibold text-gray-900 text-sm sm:text-base leading-snug mb-2
                       line-clamp-2 flex-1 group-hover:text-teal-600 transition-colors">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{video.description}</p>
        )}
        {video.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {video.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  )
}

export default function DIYPage() {
  const [videos, setVideos]         = useState<DiyVideo[]>([])
  const [loading, setLoading]       = useState(true)
  const [activeCategory, setCategory] = useState('All')
  const [searchQuery, setSearch]    = useState('')
  const [total, setTotal]           = useState(0)

  useEffect(() => { document.title = 'DIY & Craft Videos | CraftworldCentre' }, [])

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
      {/* Hero */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1f22 0%, #1A7A8A 60%, #0d3d47 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        {[300, 500, 700].map((size, i) => (
          <motion.div key={size} className="absolute rounded-full border border-white/6 pointer-events-none"
            style={{ width: size, height: size, top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
            animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.8 }} />
        ))}

        <div className="container-max section-padding py-16 sm:py-20 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full
                            px-4 py-2 text-white text-xs font-medium mb-5 backdrop-blur-sm">
              <SubscriptionsOutlined sx={{ fontSize: 14, color: '#7BC8D8' }} />
              CraftworldCentre on YouTube
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            </div>
            <h1 className="font-display font-bold text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>
              DIY & <span className="italic" style={{ color: '#7BC8D8' }}>Craft</span>
              <br />Behind the Scenes
            </h1>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Watch our artisans turn waste into beautiful products — step by step.
            </p>
            <a href="https://youtube.com/@craftworldcentre" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white
                         font-semibold px-6 py-3 rounded-full transition-colors shadow-lg active:scale-95 text-sm">
              <SubscriptionsOutlined sx={{ fontSize: 18 }} />
              Subscribe on YouTube
              <OpenInNewOutlined sx={{ fontSize: 14 }} />
            </a>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f8fafb" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="container-max section-padding py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <SearchOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              sx={{ fontSize: 18, color: '#9ca3af' }} />
            <input type="search" value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos, techniques, brands…"
              className="input-field pl-10 text-sm" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-shrink-0">
            {CATEGORIES.map((cat) => (
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
          <strong className="text-gray-800">{loading ? '…' : videos.length}</strong> video{videos.length !== 1 ? 's' : ''}
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

        {/* YouTube CTA */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mt-16 rounded-3xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #0d1f22 0%, #1A7A8A 60%, #0d3d47 100%)' }}>
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-8">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <RecyclingOutlined sx={{ fontSize: 20, color: '#7BC8D8' }} />
                <span className="text-white/60 text-xs font-mono uppercase tracking-widest">New videos every week</span>
              </div>
              <h3 className="font-display text-white text-2xl sm:text-3xl">Never Miss a Craft Story</h3>
            </div>
            <a href="https://youtube.com/@craftworldcentre" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold
                         px-8 py-3.5 rounded-full transition-colors shadow-lg active:scale-95 text-sm flex-shrink-0">
              <SubscriptionsOutlined sx={{ fontSize: 18 }} />
              Subscribe Free
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
