import React from 'react'
import { Star } from 'lucide-react'

export const RatingStars = ({ rating = 5, max = 5, size = 'w-4 h-4', showValue = false }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(max)].map((_, i) => {
        const fillPercent = Math.max(0, Math.min(1, rating - i))
        return (
          <div key={i} className="relative">
            <Star className={`${size} text-amber-400 fill-amber-400`} />
            {fillPercent < 1 && fillPercent > 0 && (
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: `${fillPercent * 100}%` }}
              >
                <Star className={`${size} text-amber-400 fill-amber-400`} />
              </div>
            )}
            {fillPercent === 0 && (
              <div className="absolute top-0 left-0">
                <Star className={`${size} text-slate-300 dark:text-slate-600 fill-transparent`} />
              </div>
            )}
          </div>
        )
      })}
      {showValue && (
        <span className="ml-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
