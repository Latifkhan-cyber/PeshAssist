import {
  createPlace,
  updatePlace,
  deletePlace,
  getAdminStats,
  searchPlaces,
} from '../services/searchService.js'

export const getStats = async (req, res, next) => {
  try {
    const stats = await getAdminStats()
    res.status(200).json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}

export const getAdminPlaces = async (req, res, next) => {
  try {
    const places = await searchPlaces({ limit: 100 })
    res.status(200).json({
      success: true,
      data: places,
    })
  } catch (error) {
    next(error)
  }
}

export const addAdminPlace = async (req, res, next) => {
  try {
    const { name, category_slug, area_name, address, phone, price_range, description, latitude, longitude, cover_image, urdu_name } = req.body

    if (!name || !address) {
      return res.status(400).json({
        success: false,
        error: { message: 'Name and address are required.' },
      })
    }

    const place = await createPlace({
      name,
      urdu_name: urdu_name || name,
      category_slug: category_slug || 'restaurants',
      area_name: area_name || 'University Road',
      address,
      phone: phone || '+92 91 0000000',
      price_range: price_range || '₨₨',
      description: description || 'Verified local service in Peshawar.',
      latitude: latitude ? parseFloat(latitude) : 34.008,
      longitude: longitude ? parseFloat(longitude) : 71.545,
      cover_image: cover_image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=60',
      tags: [category_slug || 'general', area_name || 'peshawar'],
    })

    res.status(201).json({
      success: true,
      message: 'Place created and verified successfully.',
      data: place,
    })
  } catch (error) {
    next(error)
  }
}

export const updateAdminPlace = async (req, res, next) => {
  try {
    const { id } = req.params
    const updated = await updatePlace(id, req.body)

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { message: `Place with ID ${id} not found.` },
      })
    }

    res.status(200).json({
      success: true,
      message: 'Place updated successfully.',
      data: updated,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteAdminPlace = async (req, res, next) => {
  try {
    const { id } = req.params
    const deleted = await deletePlace(id)

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { message: `Place with ID ${id} not found.` },
      })
    }

    res.status(200).json({
      success: true,
      message: 'Place deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}
