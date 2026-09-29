import { Router } from 'express'
import { getHealthStatus } from '../controllers/healthController.js'
import { handleChat, getSuggestedQueries } from '../controllers/chatController.js'
import {
  getPlaces,
  getSinglePlace,
  getCategories,
  getAreas,
} from '../controllers/placesController.js'
import { getReviews, postReview } from '../controllers/reviewsController.js'
import { getFavorites, handleToggleFavorite } from '../controllers/favoritesController.js'
import {
  getStats,
  getAdminPlaces,
  addAdminPlace,
  updateAdminPlace,
  deleteAdminPlace,
} from '../controllers/adminController.js'

const router = Router()

// 1. Health
router.get('/health', getHealthStatus)

// 2. Chat & AI
router.post('/chat', handleChat)
router.get('/chat/suggestions', getSuggestedQueries)

// 3. Places & Taxonomy
router.get('/places', getPlaces)
router.get('/places/:id', getSinglePlace)
router.get('/categories', getCategories)
router.get('/areas', getAreas)

// 4. Reviews
router.get('/reviews/:placeId', getReviews)
router.post('/reviews', postReview)

// 5. Favorites
router.get('/favorites', getFavorites)
router.post('/favorites/:placeId', handleToggleFavorite)

// 6. Admin
router.get('/admin/stats', getStats)
router.get('/admin/places', getAdminPlaces)
router.post('/admin/places', addAdminPlace)
router.put('/admin/places/:id', updateAdminPlace)
router.delete('/admin/places/:id', deleteAdminPlace)

export default router
