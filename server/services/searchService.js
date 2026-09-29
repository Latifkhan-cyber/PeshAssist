import { places as localPlaces, categories as localCategories, areas as localAreas, sampleReviews as localReviews } from '../data/peshawarData.js'
import { supabase } from '../config/supabase.js'

// In-memory runtime state (allows live admin additions/edits even without remote Supabase DB)
let placesStore = [...localPlaces]
let categoriesStore = [...localCategories]
let areasStore = [...localAreas]
let reviewsStore = [...localReviews]
let favoritesStore = new Map() // userId -> Set of placeIds

/**
 * Calculate distance between two GPS coordinates in kilometers (Haversine Formula)
 */
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return +(R * c).toFixed(2)
}

/**
 * Levenshtein distance for fuzzy matching typos (e.g. 'plaaza' -> 'plaza', 'haaji' -> 'haji')
 */
const levenshteinDistance = (s1, s2) => {
  if (s1 === s2) return 0
  if (!s1.length) return s2.length
  if (!s2.length) return s1.length

  const d = []
  for (let i = 0; i <= s1.length; i++) d[i] = [i]
  for (let j = 0; j <= s2.length; j++) d[0][j] = j

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      )
    }
  }
  return d[s1.length][s2.length]
}

const isFuzzyMatch = (w1, w2) => {
  if (!w1 || !w2) return false
  if (w1 === w2) return true
  if (w1.includes(w2) || w2.includes(w1)) return true
  const maxLen = Math.max(w1.length, w2.length)
  if (maxLen <= 3) return w1 === w2
  const maxDistance = maxLen <= 5 ? 1 : 2
  return levenshteinDistance(w1, w2) <= maxDistance
}

/**
 * Search places across categories, areas, keywords, and prices with intelligent relevance scoring
 */
export const searchPlaces = async ({
  query = '',
  category = '',
  area = '',
  priceRange = '',
  minRating = 0,
  featuredOnly = false,
  limit = 20,
  lat = null,
  lng = null,
}) => {
  let results = [...placesStore]

  const stopWords = new Set([
    'in', 'at', 'near', 'the', 'a', 'an', 'and', 'or', 'for', 'of', 'to', 'is', 'are', 'where', 'can', 'find',
    'tell', 'about', 'know', 'give', 'information', 'detail', 'details', 'show', 'search', 'it', 'there',
    'mein', 'main', 'me', 'ke', 'ki', 'ka', 'ko', 'se', 'par', 'paas', 'qareeb', 'wali', 'wala', 'wale',
    'batao', 'kahan', 'kidhar', 'hai', 'hein', 'hain', 'best', 'acha', 'achha', 'achi', 'ache',
    'chahiye', 'karo', 'mujhe', 'hum', 'aap', 'kuch', 'bhi', 'kya', 'konsa', 'konsi', 'baray', 'bare'
  ])

  const normalizedQuery = query.toLowerCase().trim()

  if (category) {
    const catLower = category.toLowerCase().trim()
    results = results.filter(
      (p) => p.category_slug.toLowerCase() === catLower || p.category_id.toString() === category
    )
  }

  if (area) {
    const areaLower = area.toLowerCase().trim()
    results = results.filter(
      (p) =>
        p.area_name.toLowerCase().includes(areaLower) ||
        p.area_id.toString() === area
    )
  }

  if (priceRange) {
    results = results.filter((p) => p.price_range === priceRange)
  }

  if (minRating > 0) {
    results = results.filter((p) => p.rating >= minRating)
  }

  if (featuredOnly) {
    results = results.filter((p) => p.is_featured)
  }

  if (normalizedQuery) {
    const tokens = normalizedQuery
      .split(/[\s,?.!/\\-]+/)
      .filter((w) => w.length > 1 && !stopWords.has(w))

    const scoredResults = []

    for (const p of results) {
      let score = 0
      const nameLower = p.name.toLowerCase()
      const nameWords = nameLower.split(/[\s,?.!/\\-]+/)
      const urduLower = (p.urdu_name || '').toLowerCase()
      const descLower = p.description.toLowerCase()
      const addressLower = p.address.toLowerCase()
      const tagsLower = (p.tags || []).map((t) => t.toLowerCase())
      const areaLower = p.area_name.toLowerCase()
      const catLower = p.category_slug.toLowerCase()

      // 1. Exact full normalized query match
      if (nameLower.includes(normalizedQuery)) score += 120
      if (tagsLower.some((t) => t.includes(normalizedQuery))) score += 100
      if (descLower.includes(normalizedQuery) || addressLower.includes(normalizedQuery)) score += 60

      // 2. Token-level matches
      for (const t of tokens) {
        // Name checks
        if (nameLower.includes(t)) {
          score += 45
        } else if (nameWords.some((nw) => isFuzzyMatch(nw, t))) {
          score += 35
        }

        // Tags checks
        for (const tag of tagsLower) {
          if (tag.includes(t)) {
            score += 40
            break
          } else if (isFuzzyMatch(tag, t)) {
            score += 30
            break
          }
        }

        // Urdu name check
        if (urduLower.includes(t)) score += 40

        // Area & Category match
        if (areaLower.includes(t) || isFuzzyMatch(areaLower, t)) score += 25
        if (catLower.includes(t) || isFuzzyMatch(catLower, t)) score += 25

        // Description / Address check
        if (descLower.includes(t) || addressLower.includes(t)) score += 15
      }

      if (score > 0) {
        scoredResults.push({ ...p, _relevanceScore: score })
      }
    }

    // Sort strictly by relevance score first, then rating
    scoredResults.sort((a, b) => b._relevanceScore - a._relevanceScore || b.rating - a.rating || b.review_count - a.review_count)
    results = scoredResults
  } else {
    // If GPS coordinates provided, sort by proximity
    if (lat && lng) {
      results = results.map((p) => ({
        ...p,
        distance_km: calculateDistanceKm(lat, lng, p.latitude, p.longitude),
      }))
      results.sort((a, b) => a.distance_km - b.distance_km)
    } else {
      // Default sort by rating & review count
      results.sort((a, b) => b.rating - a.rating || b.review_count - a.review_count)
    }
  }

  return results.slice(0, limit)
}

/**
 * Get place by ID
 */
export const getPlaceById = async (id) => {
  const place = placesStore.find((p) => p.id === id)
  if (!place) return null

  // Attach reviews for this place
  const reviews = reviewsStore.filter((r) => r.place_id === id && r.status === 'approved')
  return { ...place, reviews }
}

/**
 * Get all categories
 */
export const getAllCategories = async () => {
  return categoriesStore
}

/**
 * Get all areas
 */
export const getAllAreas = async () => {
  return areasStore
}

/**
 * Reviews operations
 */
export const getReviewsByPlaceId = async (placeId) => {
  return reviewsStore.filter((r) => r.place_id === placeId && r.status === 'approved')
}

export const addReview = async ({ placeId, userName, rating, comment, userAvatar }) => {
  const newReview = {
    id: `r-${Date.now()}`,
    place_id: placeId,
    user_name: userName || 'Peshawar Resident',
    user_avatar: userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
    rating: Number(rating) || 5,
    comment,
    status: 'approved',
    created_at: new Date().toISOString(),
  }

  reviewsStore.unshift(newReview)

  // Update place review stats
  const place = placesStore.find((p) => p.id === placeId)
  if (place) {
    const placeReviews = reviewsStore.filter((r) => r.place_id === placeId && r.status === 'approved')
    place.review_count = placeReviews.length
    const totalStars = placeReviews.reduce((sum, r) => sum + r.rating, 0)
    place.rating = +(totalStars / placeReviews.length).toFixed(1)
  }

  return newReview
}

/**
 * Favorites operations
 */
export const getUserFavorites = async (userId) => {
  const favSet = favoritesStore.get(userId) || new Set()
  return placesStore.filter((p) => favSet.has(p.id))
}

export const toggleFavorite = async (userId, placeId) => {
  if (!favoritesStore.has(userId)) {
    favoritesStore.set(userId, new Set())
  }
  const favSet = favoritesStore.get(userId)
  let isSaved = false

  if (favSet.has(placeId)) {
    favSet.delete(placeId)
    isSaved = false
  } else {
    favSet.add(placeId)
    isSaved = true
  }

  return { isSaved, total: favSet.size }
}

/**
 * Admin CRUD operations
 */
export const createPlace = async (placeData) => {
  const newPlace = {
    id: `p-${Date.now()}`,
    ...placeData,
    rating: placeData.rating || 5.0,
    review_count: 0,
    is_verified: true,
    created_at: new Date().toISOString(),
  }
  placesStore.unshift(newPlace)
  return newPlace
}

export const updatePlace = async (id, updateData) => {
  const idx = placesStore.findIndex((p) => p.id === id)
  if (idx === -1) return null
  placesStore[idx] = { ...placesStore[idx], ...updateData, updated_at: new Date().toISOString() }
  return placesStore[idx]
}

export const deletePlace = async (id) => {
  const idx = placesStore.findIndex((p) => p.id === id)
  if (idx === -1) return false
  placesStore.splice(idx, 1)
  return true
}

export const getAdminStats = async () => {
  return {
    totalPlaces: placesStore.length,
    totalCategories: categoriesStore.length,
    totalAreas: areasStore.length,
    totalReviews: reviewsStore.length,
    featuredPlaces: placesStore.filter((p) => p.is_featured).length,
    verifiedPlaces: placesStore.filter((p) => p.is_verified).length,
  }
}
