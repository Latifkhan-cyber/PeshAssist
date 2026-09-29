import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Clock,
  Star,
  ShieldCheck,
  Heart,
  Navigation,
  Share2,
  ChevronLeft,
  CheckCircle2,
  MessageSquarePlus,
  Compass,
} from 'lucide-react'
import { placesService, reviewsService } from '../services/api'
import { useFavorites } from '../context/FavoritesContext'
import { RatingStars } from '../components/RatingStars'
import { MapView } from '../components/MapView'
import { ReviewModal } from '../components/ReviewModal'

export const PlaceDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [place, setPlace] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        setLoading(true)
        const [placeRes, reviewsRes] = await Promise.all([
          placesService.getById(id),
          reviewsService.getByPlace(id),
        ])

        if (placeRes.data.success) {
          setPlace(placeRes.data.data)
        }
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.data)
        }
      } catch (err) {
        setError(err.message || 'Failed to load place details. The location may not exist.')
      } finally {
        setLoading(false)
      }
    }

    fetchPlaceDetails()
  }, [id])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: `Check out ${place.name} in Peshawar on PeshAssist!`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleReviewAdded = (newReview) => {
    setReviews((prev) => [newReview, ...prev])
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
      </div>
    )
  }

  if (error || !place) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Place Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'Could not find this Peshawar place.'}</p>
        <Link
          to="/explore"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          <Compass className="w-4 h-4" />
          <span>Back to Explore Directory</span>
        </Link>
      </div>
    )
  }

  const saved = isFavorite(place.id)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back navigation & Actions Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center space-x-1 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => toggleFavorite(place)}
            className={`p-2 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 transition-all ${
              saved
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline">{saved ? 'Saved' : 'Save to Favorites'}</span>
          </button>
        </div>
      </div>

      {/* Hero Showcase & Gallery */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="relative h-72 sm:h-96 w-full">
          <img
            src={place.cover_image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80'}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Floating Details Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full font-bold bg-emerald-600 text-white uppercase tracking-wider">
                {place.category_slug}
              </span>
              <span className="px-2.5 py-1 rounded-full font-bold bg-slate-900/80 backdrop-blur-md border border-white/20 text-emerald-300">
                {place.price_range || '₨₨'} Price Level
              </span>
              {place.is_verified && (
                <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-500/30 backdrop-blur-md border border-emerald-400/40 text-emerald-200 inline-flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Verified Peshawar Authority</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{place.name}</h1>

            {place.urdu_name && (
              <p className="text-sm sm:text-base text-emerald-300 font-arabic font-semibold" dir="rtl">
                {place.urdu_name}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 pt-1">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{place.area_name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-white">{place.rating || 4.5}</span>
                <span className="text-slate-300">({reviews.length || place.review_count || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              About this Place
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {place.description}
            </p>

            {/* Amenities / Key Highlights */}
            {place.amenities && place.amenities.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Highlights & Facilities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                  {place.amenities.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-xl"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Map */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Location & Map View
            </h2>
            <p className="text-xs text-slate-500">{place.address}</p>
            <MapView selectedPlace={place} height="h-72" />
          </div>

          {/* Reviews Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Visitor Reviews
                </h2>
                <p className="text-xs text-slate-500">
                  Real feedback from Peshawar residents and travelers
                </p>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 transition-all"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Write Review</span>
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <p className="text-xs">No reviews written yet. Be the first to review {place.name}!</p>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={rev.user_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.user_name}`}
                          alt={rev.user_name}
                          className="w-7 h-7 rounded-full bg-slate-100 ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {rev.user_name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(rev.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <RatingStars rating={rev.rating} size="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 pl-9 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Contact & Schedule Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5 sticky top-20">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Quick Details & Contacts
            </h3>

            <div className="space-y-3.5 text-xs">
              {/* Address */}
              <div className="flex items-start space-x-3 text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">Address</p>
                  <p className="text-slate-500">{place.address}</p>
                </div>
              </div>

              {/* Phone */}
              {place.phone && (
                <div className="flex items-start space-x-3 text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">Phone</p>
                    <a
                      href={`tel:${place.phone}`}
                      className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      {place.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Opening Hours */}
              {place.opening_hours && (
                <div className="flex items-start space-x-3 text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="w-full">
                    <p className="font-semibold text-slate-800 dark:text-white mb-1">Timings</p>
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Mon - Fri:</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{place.opening_hours.mon_fri}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sat - Sun:</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{place.opening_hours.sat_sun}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct CTA Buttons */}
            <div className="pt-2 space-y-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/30 transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate in Google Maps</span>
              </a>

              {place.phone && (
                <a
                  href={`tel:${place.phone}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {place.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        place={place}
        onReviewAdded={handleReviewAdded}
      />
    </div>
  )
}
