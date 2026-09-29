import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Compass,
  Map as MapIcon,
  Grid,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { PlaceCard } from '../components/PlaceCard'
import { MapView } from '../components/MapView'
import { placesService } from '../services/api'

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || ''
  const initialArea = searchParams.get('area') || ''

  const [places, setPlaces] = useState([])
  const [categories, setCategories] = useState([])
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedArea, setSelectedArea] = useState(initialArea)
  const [selectedPrice, setSelectedPrice] = useState('')
  const [minRating, setMinRating] = useState(0)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'map'

  useEffect(() => {
    const loadTaxonomy = async () => {
      try {
        const [catRes, areaRes] = await Promise.all([
          placesService.getCategories(),
          placesService.getAreas(),
        ])
        if (catRes.data.success) setCategories(catRes.data.data)
        if (areaRes.data.success) setAreas(areaRes.data.data)
      } catch (e) {
        console.warn('Failed to load taxonomy:', e)
      }
    }
    loadTaxonomy()
  }, [])

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true)
        const params = {}
        if (searchQuery.trim()) params.query = searchQuery.trim()
        if (selectedCategory) params.category = selectedCategory
        if (selectedArea) params.area = selectedArea
        if (selectedPrice) params.priceRange = selectedPrice
        if (minRating > 0) params.minRating = minRating

        const res = await placesService.getAll(params)
        if (res.data.success) {
          setPlaces(res.data.data)
        }
      } catch (err) {
        console.error('Error fetching places:', err)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchPlaces, 200)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedCategory, selectedArea, selectedPrice, minRating])

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedArea('')
    setSelectedPrice('')
    setMinRating(0)
    setSearchParams({})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Peshawar Places Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Explore Verified Places
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Find the finest food, medical centers, hotels, repair hubs, and landmarks in Peshawar.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        {/* Search & Area Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, dish, service, or keyword..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Areas (Peshawar)</option>
              {areas.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Any Price</option>
              <option value="₨">₨ (Affordable)</option>
              <option value="₨₨">₨₨ (Moderate)</option>
              <option value="₨₨₨">₨₨₨ (Premium)</option>
            </select>

            {(searchQuery || selectedCategory || selectedArea || selectedPrice || minRating > 0) && (
              <button
                onClick={handleResetFilters}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === ''
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong>{places.length}</strong> verified locations in Peshawar
        </span>
        {selectedCategory && (
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            Filtered by category: {selectedCategory}
          </span>
        )}
      </div>

      {/* Map View Mode */}
      {viewMode === 'map' && (
        <div className="space-y-4">
          <MapView places={places} height="h-96" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </div>
      )}

      {/* Grid View Mode */}
      {viewMode === 'grid' && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                />
              ))}
            </div>
          ) : places.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <Compass className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                No matching places found in Peshawar
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search keyword or switching to another area or category.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs inline-flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
