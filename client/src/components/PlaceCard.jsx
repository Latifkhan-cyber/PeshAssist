import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Star, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'

export const PlaceCard = ({ place }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const saved = isFavorite(place.id)

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(place)
  }

  const categoryColorMap = {
    restaurants: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    hospitals: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    hotels: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    tourism: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    shopping: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    services: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    education: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    transport: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  }

  const badgeClass =
    categoryColorMap[place.category_slug] ||
    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={place.cover_image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=60'}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:scale-110 transition-all shadow-md"
        >
          <Heart
            className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`}
          />
        </button>

        {/* Price Tag & Category Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <span className={`px-2.5 py-1 rounded-full font-medium border backdrop-blur-md bg-white/90 dark:bg-slate-900/90 ${badgeClass}`}>
            {place.category_slug ? place.category_slug.toUpperCase() : 'PLACE'}
          </span>
          <span className="px-2.5 py-1 rounded-full font-bold bg-slate-900/80 text-emerald-300 backdrop-blur-md border border-emerald-500/30">
            {place.price_range || '₨₨'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Verification */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {place.name}
            </h3>
            {place.is_verified && (
              <span className="shrink-0 flex items-center text-emerald-600 dark:text-emerald-400" title="Verified Peshawar Entity">
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>

          {place.urdu_name && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-arabic mb-2 font-medium" dir="rtl">
              {place.urdu_name}
            </p>
          )}

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
            {place.description}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <div className="flex items-center space-x-1 truncate max-w-[65%]">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{place.area_name}</span>
            </div>
            <div className="flex items-center space-x-1 font-semibold text-slate-800 dark:text-slate-200">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{place.rating || 4.5}</span>
              <span className="text-[10px] text-slate-400">({place.review_count || 0})</span>
            </div>
          </div>

          {/* Action Link */}
          <Link
            to={`/place/${place.id}`}
            className="w-full mt-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-600 text-slate-800 hover:text-white dark:text-slate-200 dark:hover:text-white font-medium text-xs transition-all duration-200 group/btn"
          >
            <span>View Full Details & Directions</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
