import {
  searchPlaces,
  getPlaceById,
  getAllCategories,
  getAllAreas,
} from '../services/searchService.js'

export const getPlaces = async (req, res, next) => {
  try {
    const { query, category, area, priceRange, minRating, featured, limit, lat, lng } = req.query

    const places = await searchPlaces({
      query,
      category,
      area,
      priceRange,
      minRating: minRating ? parseFloat(minRating) : 0,
      featuredOnly: featured === 'true',
      limit: limit ? parseInt(limit, 10) : 50,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
    })

    res.status(200).json({
      success: true,
      count: places.length,
      data: places,
    })
  } catch (error) {
    next(error)
  }
}

export const getSinglePlace = async (req, res, next) => {
  try {
    const { id } = req.params
    const place = await getPlaceById(id)

    if (!place) {
      return res.status(404).json({
        success: false,
        error: { message: `Place with ID ${id} not found.` },
      })
    }

    res.status(200).json({
      success: true,
      data: place,
    })
  } catch (error) {
    next(error)
  }
}

export const getCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategories()
    res.status(200).json({
      success: true,
      data: categories,
    })
  } catch (error) {
    next(error)
  }
}

export const getAreas = async (req, res, next) => {
  try {
    const areas = await getAllAreas()
    res.status(200).json({
      success: true,
      data: areas,
    })
  } catch (error) {
    next(error)
  }
}
