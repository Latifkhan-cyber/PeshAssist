import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Compass, ArrowRight } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import { PlaceCard } from '../components/PlaceCard'

export const FavoritesPage = () => {
  const { favorites, loading } = useFavorites()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center space-x-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
        <Heart className="w-4 h-4 fill-rose-500" />
        <span>Your Personal Wishlist</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Saved Places in Peshawar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Quickly access your saved restaurants, emergency clinics, historic sites, and services.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 self-start">
          {favorites.length} Places Saved
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            No saved places yet
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse through the Peshawar directory or ask our AI assistant, then click the heart icon on any place to save it here!
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Places Now</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  )
}
