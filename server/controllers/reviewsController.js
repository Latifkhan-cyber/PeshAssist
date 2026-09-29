import { getReviewsByPlaceId, addReview } from '../services/searchService.js'

export const getReviews = async (req, res, next) => {
  try {
    const { placeId } = req.params
    const reviews = await getReviewsByPlaceId(placeId)
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    })
  } catch (error) {
    next(error)
  }
}

export const postReview = async (req, res, next) => {
  try {
    const { placeId, userName, rating, comment, userAvatar } = req.body

    if (!placeId || !comment || !rating) {
      return res.status(400).json({
        success: false,
        error: { message: 'placeId, rating, and comment are required.' },
      })
    }

    const review = await addReview({ placeId, userName, rating, comment, userAvatar })

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      data: review,
    })
  } catch (error) {
    next(error)
  }
}
