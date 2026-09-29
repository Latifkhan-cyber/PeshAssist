import { getUserFavorites, toggleFavorite } from '../services/searchService.js'

export const getFavorites = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || 'default_user'
    const favorites = await getUserFavorites(userId)
    res.status(200).json({
      success: true,
      data: favorites,
    })
  } catch (error) {
    next(error)
  }
}

export const handleToggleFavorite = async (req, res, next) => {
  try {
    const { placeId } = req.params
    const userId = req.headers['x-user-id'] || 'default_user'

    if (!placeId) {
      return res.status(400).json({
        success: false,
        error: { message: 'placeId parameter is required.' },
      })
    }

    const result = await toggleFavorite(userId, placeId)

    res.status(200).json({
      success: true,
      message: result.isSaved ? 'Place saved to favorites' : 'Place removed from favorites',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
