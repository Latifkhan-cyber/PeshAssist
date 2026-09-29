import React, { useState, useEffect } from 'react'
import { X, Save, Plus } from 'lucide-react'
import { adminService } from '../services/api'

export const PlaceModal = ({ isOpen, onClose, place, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    urdu_name: '',
    category_slug: 'restaurants',
    area_name: 'University Road',
    address: '',
    phone: '',
    price_range: '₨₨',
    description: '',
    cover_image: '',
    latitude: '34.008',
    longitude: '71.545',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (place) {
      setFormData({
        name: place.name || '',
        urdu_name: place.urdu_name || '',
        category_slug: place.category_slug || 'restaurants',
        area_name: place.area_name || 'University Road',
        address: place.address || '',
        phone: place.phone || '',
        price_range: place.price_range || '₨₨',
        description: place.description || '',
        cover_image: place.cover_image || '',
        latitude: place.latitude ? String(place.latitude) : '34.008',
        longitude: place.longitude ? String(place.longitude) : '71.545',
      })
    } else {
      setFormData({
        name: '',
        urdu_name: '',
        category_slug: 'restaurants',
        area_name: 'University Road',
        address: '',
        phone: '',
        price_range: '₨₨',
        description: '',
        cover_image: '',
        latitude: '34.008',
        longitude: '71.545',
      })
    }
  }, [place, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.address.trim()) {
      setError('Name and Address are required.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      let res
      if (place?.id) {
        res = await adminService.updatePlace(place.id, formData)
      } else {
        res = await adminService.addPlace(formData)
      }

      if (res.data.success) {
        onSave(res.data.data)
        onClose()
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save place.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 z-10">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            {place ? 'Edit Peshawar Place' : 'Add New Verified Place in Peshawar'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-900/50">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Place Name (English) *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Chief Burger"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Name in Urdu / Pashto (Optional)
              </label>
              <input
                type="text"
                value={formData.urdu_name}
                onChange={(e) => setFormData({ ...formData, urdu_name: e.target.value })}
                placeholder="e.g. چیف برگر یونیورسٹی روڈ"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-arabic text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category_slug}
                onChange={(e) => setFormData({ ...formData, category_slug: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="restaurants">Restaurants & Dining</option>
                <option value="hospitals">Hospitals & Healthcare</option>
                <option value="hotels">Hotels & Stays</option>
                <option value="tourism">Heritage & Tourism</option>
                <option value="shopping">Shopping & Bazaars</option>
                <option value="education">Education & Universities</option>
                <option value="services">Tech & Repair Services</option>
                <option value="transport">Transport & Transit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Area / Zone
              </label>
              <select
                value={formData.area_name}
                onChange={(e) => setFormData({ ...formData, area_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="University Road">University Road</option>
                <option value="Hayatabad">Hayatabad</option>
                <option value="Saddar">Saddar (Cantt)</option>
                <option value="Namak Mandi">Namak Mandi</option>
                <option value="Qissa Khwani Bazaar">Qissa Khwani Bazaar</option>
                <option value="Warsak Road">Warsak Road</option>
                <option value="Ring Road">Ring Road</option>
                <option value="Gulbahar">Gulbahar</option>
                <option value="Taru Jabba / GT Road">Taru Jabba</option>
                <option value="Khyber Pass / Jamrud">Khyber Pass / Jamrud</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 91 5840500"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Price Level
              </label>
              <select
                value={formData.price_range}
                onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="₨">₨ (Budget Friendly / Affordable)</option>
                <option value="₨₨">₨₨ (Moderate / Standard)</option>
                <option value="₨₨₨">₨₨₨ (Premium / Luxury)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Street Address *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Shop 12, Main University Road, Peshawar"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description & Highlights
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe popular items, emergency amenities, or historical background..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{submitting ? 'Saving...' : place ? 'Update Place' : 'Create Place'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
