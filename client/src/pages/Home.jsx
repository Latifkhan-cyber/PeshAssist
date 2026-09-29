import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  Search,
  MapPin,
  Utensils,
  Hospital,
  Hotel,
  Landmark,
  ShoppingBag,
  GraduationCap,
  Wrench,
  Bus,
  ShieldCheck,
  CheckCircle2,
  Compass,
  MessageSquare,
} from 'lucide-react'
import { PlaceCard } from '../components/PlaceCard'
import { placesService } from '../services/api'

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredPlaces, setFeaturedPlaces] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [placesRes, catRes] = await Promise.all([
          placesService.getAll({ featured: 'true', limit: 6 }),
          placesService.getCategories(),
        ])

        if (placesRes.data.success) {
          setFeaturedPlaces(placesRes.data.data)
        }
        if (catRes.data.success) {
          setCategories(catRes.data.data)
        }
      } catch (err) {
        console.warn('Failed to load home data:', err.message)
      } finally {
        setLoading(false)
      }
    }

    loadHomeData()
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/chat?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const quickPrompts = [
    'Namak Mandi Dumbah Karahi',
    'Emergency Hospital in Hayatabad',
    'Laptop Repair in Deans Saddar',
    'Bala Hissar Fort visiting hours',
    'Zu BRT stations',
  ]

  const iconMap = {
    Utensils: <Utensils className="w-5 h-5" />,
    Hospital: <Hospital className="w-5 h-5" />,
    Hotel: <Hotel className="w-5 h-5" />,
    Landmark: <Landmark className="w-5 h-5" />,
    ShoppingBag: <ShoppingBag className="w-5 h-5" />,
    GraduationCap: <GraduationCap className="w-5 h-5" />,
    Wrench: <Wrench className="w-5 h-5" />,
    Bus: <Bus className="w-5 h-5" />,
  }

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-emerald-950/20 via-slate-50 to-white dark:from-emerald-950/40 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
            <span>Dedicated AI Guide for Peshawar, KP</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
            Explore Peshawar with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">Intelligent AI</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Ask in <strong>English, Urdu, or Roman Urdu</strong>. Discover verified restaurants, 24/7 hospitals, historic monuments, repair markets, and local services without hallucinations.
          </p>

          {/* AI Search Bar Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-emerald-900/10 dark:shadow-none border border-slate-200 dark:border-slate-800 flex items-center gap-2 mb-4"
          >
            <div className="pl-3 text-emerald-600">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Try: "University Road ke qareeb family restaurant chahiye" or "HMC Hospital"...'
              className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/30 shrink-0 inline-flex items-center space-x-1.5"
            >
              <span>Ask AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Prompt Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Quick Prompts:</span>
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => navigate(`/chat?q=${encodeURIComponent(prompt)}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. STATS & GUARANTEES RIBBON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-emerald-900/5 dark:bg-slate-900 border border-emerald-500/10">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">100%</p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Verified Peshawar Data</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">8+</p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Key Local Categories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">3 Langs</p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">English, Urdu, Roman Urdu</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">0%</p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">AI Hallucinations</p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Browse by Interest
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Top Peshawar Categories
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            <span>View all directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/explore?category=${cat.slug}`}
              className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {iconMap[cat.icon] || <Compass className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED & TRENDING IN PESHAWAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Handpicked & Verified
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Popular Spots in Peshawar
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            <span>Explore all places</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              AI Grounding Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">
              How PeshAssist Delivers Accurate Answers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
                1
              </div>
              <h3 className="font-bold text-base mb-2">Natural Conversational Input</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Type your question in natural Urdu, Roman Urdu, or English. Ask about food, emergency doctors, prices, or transit.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
                2
              </div>
              <h3 className="font-bold text-base mb-2">Peshawar Database Query</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gemini uses function calling to search our curated PostgreSQL/Supabase database for factual addresses, phone numbers, and hours.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
                3
              </div>
              <h3 className="font-bold text-base mb-2">Interactive Place Cards</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Get grounded recommendations complete with interactive cards, instant directions, phone dialers, and OpenStreetMap pins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-900/20">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Ready to explore the historic City of Flowers?
          </h2>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto mb-6 leading-relaxed">
            Start a chat with our AI assistant or browse the categorized directory of Peshawar.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/chat"
              className="px-6 py-3 rounded-xl bg-white text-emerald-800 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-all shadow-md"
            >
              Open AI Chat
            </Link>
            <Link
              to="/explore"
              className="px-6 py-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all border border-emerald-400/30"
            >
              Browse Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
