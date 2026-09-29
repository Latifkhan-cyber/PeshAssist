import React, { createContext, useContext, useState, useEffect } from 'react'
import { favoritesService } from '../services/api'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext(null)

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [loading, setLoading] = useState(false)

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const res = await favoritesService.getAll()
      if (res.data.success) {
        setFavorites(res.data.data)
        setFavoriteIds(new Set(res.data.data.map((p) => p.id)))
      }
    } catch (err) {
      console.warn('Could not fetch favorites:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [user])

  const toggleFavorite = async (place) => {
    // Optimistic UI update
    const placeId = place.id
    const isCurrentlySaved = favoriteIds.has(placeId)

    const updatedSet = new Set(favoriteIds)
    if (isCurrentlySaved) {
      updatedSet.delete(placeId)
      setFavorites((prev) => prev.filter((p) => p.id !== placeId))
    } else {
      updatedSet.add(placeId)
      setFavorites((prev) => [place, ...prev])
    }
    setFavoriteIds(updatedSet)

    try {
      await favoritesService.toggle(placeId)
    } catch (err) {
      console.error('Failed to toggle favorite on server:', err)
      // Revert if error
      fetchFavorites()
    }
  }

  const isFavorite = (placeId) => favoriteIds.has(placeId)

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)
