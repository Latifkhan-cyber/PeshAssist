import React from 'react'
import { MapPin, Navigation, ExternalLink } from 'lucide-react'

export const MapView = ({ places = [], center = [34.008, 71.545], height = 'h-72', selectedPlace = null }) => {
  const activePlace = selectedPlace || (places.length === 1 ? places[0] : null)
  const lat = activePlace ? activePlace.latitude : center[0]
  const lng = activePlace ? activePlace.longitude : center[1]

  const googleMapsUrl = activePlace
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=Peshawar`

  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.04}%2C${lat - 0.02}%2C${lng + 0.04}%2C${lat + 0.02}&layer=mapnik&marker=${lat}%2C${lng}`

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-slate-900 flex flex-col`}>
      <iframe
        title="Peshawar OpenStreetMap"
        src={osmEmbedUrl}
        className="w-full h-full border-0 grayscale-[20%] contrast-[105%]"
        loading="lazy"
      />

      <div className="absolute top-3 left-3 z-10">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-md flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>{activePlace ? activePlace.name : 'Peshawar, KP, Pakistan'}</span>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-10">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/40 transition-all hover:scale-105"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get Directions</span>
          <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
        </a>
      </div>
    </div>
  )
}
