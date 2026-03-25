import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowForwardOutlined, SearchOutlined } from '@mui/icons-material'

const POSTS = [
  { id: 1, slug: 'circular-economy-nigeria', category: 'Circular Economy', title: 'Why Nigeria is Primed for a Circular Economy Revolution', excerpt: 'With 32M tonnes of waste generated annually and a growing creative artisan class, Nigeria sits at the intersection of problem and solution.', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80', author: 'CraftworldCentre Team', date: 'Nov 28, 2024', readTime: '6 min read', brandColor: '#1A7A8A' },
  { id: 2, slug: 'adire-history', category: 'Craft Heritage', title: 'Adire Eleko: The 600-Year-Old Yoruba Art That\'s Back in Fashion', excerpt: 'The ancient starch-resist dyeing technique from Egba Yoruba women is experiencing a remarkable global renaissance — and Adúláwò is at the forefront.', image: 'https://images.unsplash.com/photo-1558882224-dda166733046?w=600&q=80', author: 'Adúláwò Studio', date: 'Nov 15, 2024', readTime: '8 min read', brandColor: '#8B6914' },
  { id: 3, slug: 'plastic-upcycling', category: 'Upcycling', title: 'From Sachet Water to Stylish Planter: The Planet 3R Process', excerpt: 'An inside look at how post-consumer HDPE plastic — the stuff sachet water bags are made of — becomes the beautiful planters in our shop.', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80', author: 'Planet 3R Team', date: 'Oct 30, 2024', readTime: '5 min read', brandColor: '#3d6b2d' },
  { id: 4, slug: 'conscious-gifting', category: 'Lifestyle', title: '10 Circular Gifts for the Conscious Shopper This Season', excerpt: 'A curated gift guide featuring the most thoughtful, sustainable, and beautifully made products across all three CraftworldCentre brands.', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', author: 'CraftworldCentre Team', date: 'Oct 14, 2024', readTime: '4 min read', brandColor: '#1A7A8A' },
  { id: 5, slug: 'artisan-spotlight', category: 'Artisan Spotlight', title: 'Meet Mama Folake: The Weaver Who\'s Been at It for 40 Years', excerpt: 'A profile of one of Adúláwò\'s most skilled master weavers — and how the circular economy gave her craft a new generation of admirers.', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', author: 'Adúláwò Studio', date: 'Sep 22, 2024', readTime: '7 min read', brandColor: '#8B6914' },
  { id: 6, slug: 'tyre-furniture', category: 'DIY & Making', title: 'How a Used Tyre Becomes a Garden Stool in 8 Steps', excerpt: 'Planet 3R\'s production team walks us through the full upcycling process — from tyre collection to finished product, no step skipped.', image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80', author: 'Planet 3R Team', date: 'Sep 5, 2024', readTime: '5 min read', brandColor: '#3d6b2d' },
]

const CATEGORIES = ['All', 'Circular Economy', 'Craft Heritage', 'Upcycling', 'Lifestyle', 'Artisan Spotlight', 'DIY & Making']

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  useEffect(() => { document.title = 'Blog | CraftworldCentre' }, [])

  const filtered = POSTS.filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    (!search || p.title.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <main className="min-h-screen bg-[#f8fafb]">
      <div className="bg-[#0d1f22] relative overflow-hidden">
        <div className="container-max section-padding py-16 sm:py-20 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
            <span className="inline-block text-teal-300 text-xs font-mono uppercase tracking-widest mb-3">
              Stories · Ideas · Craft
            </span>
            <h1 className="font-display font-bold text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              The <em className="not-italic text-teal-300">Circular</em> Blog
            </h1>
            <p className="text-white/60 leading-relaxed">
              Deep dives into circular design, craft heritage, artisan spotlights, and sustainable
              living from the CraftworldCentre family.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 30" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0,15 C480,30 960,0 1440,15 L1440,30 L0,30 Z" fill="#f8fafb" />
          </svg>
        </div>
      </div>

      <div className="container-max section-padding py-10">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <SearchOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" sx={{ fontSize: 18, color: '#9ca3af' }} />
            <input type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search articles…" className="input-field pl-10 text-sm" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? 'bg-teal-500 text-white shadow-brand' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured post */}
        {filtered.length > 0 && activeCategory === 'All' && !search && (
          <Link to={`/blog/${filtered[0].slug}`}
            className="block mb-8 group rounded-3xl overflow-hidden bg-white shadow-card
                       hover:shadow-card-hover transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-video md:aspect-auto overflow-hidden">
                <img src={filtered[0].image} alt={filtered[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-4"
                  style={{ backgroundColor: `${filtered[0].brandColor}15`, color: filtered[0].brandColor }}>
                  {filtered[0].category}
                </span>
                <h2 className="font-display font-bold text-gray-900 text-2xl mb-3 leading-snug
                               group-hover:text-teal-600 transition-colors">
                  {filtered[0].title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{filtered[0].excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{filtered[0].author} · {filtered[0].date}</span>
                  <span className="flex items-center gap-1 text-teal-600 font-semibold">
                    Read More <ArrowForwardOutlined sx={{ fontSize: 14 }} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeCategory === 'All' && !search ? filtered.slice(1) : filtered).map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}>
              <Link to={`/blog/${post.slug}`}
                className="block bg-white rounded-2xl shadow-card hover:shadow-card-hover
                           transition-all duration-300 overflow-hidden group h-full">
                <div className="aspect-video overflow-hidden">
                  <img src={post.image} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1
                                   rounded-full inline-block mb-3"
                    style={{ backgroundColor: `${post.brandColor}15`, color: post.brandColor }}>
                    {post.category}
                  </span>
                  <h3 className="font-display font-semibold text-gray-900 text-base leading-snug mb-2
                                 line-clamp-2 group-hover:text-teal-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>{post.date} · {post.readTime}</span>
                    <ArrowForwardOutlined sx={{ fontSize: 14, color: '#1A7A8A' }} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-gray-500">No articles found. Try a different search.</p>
          </div>
        )}
      </div>
    </main>
  )
}
