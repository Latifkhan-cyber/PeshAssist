import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Star, ShieldCheck, ArrowRight } from 'lucide-react'

export const ChatPlaceCard = ({ place }) => {
  return (
    <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row text-left">
      {/* Thumbnail */}
      <div className="relative w-full sm:w-28 sm:h-auto h-24 shrink-0 bg-slate-100 dark:bg-slate-700">
        <img
          src={place.cover_image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=60'}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-900/80 text-[10px] font-bold text-emerald-400">
          {place.price_range || '₨₨'}
        </div>
      </div>

      {/* Details */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1.5 mb-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
              {place.name}
            </h4>
            {place.is_verified && (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-300 line-clamp-2 mb-2">
            {place.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/50 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1 truncate max-w-[130px]">
            <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="truncate">{place.area_name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-0.5 font-bold text-slate-700 dark:text-slate-200">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{place.rating || 4.5}</span>
            </span>
            <Link
              to={`/place/${place.id}`}
              className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Details <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
