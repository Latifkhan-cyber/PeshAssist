import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Building2,
  Layers,
  MapPin,
  Star,
  ExternalLink,
} from 'lucide-react'
import { adminService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { PlaceModal } from '../components/PlaceModal'

export const AdminDashboard = () => {
  const { user, isAdmin, login } = useAuth()
  const [stats, setStats] = useState(null)
  const [places, setPlaces] = useState([])
  const [searchFilter, setSearchFilter] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlace, setEditingPlace] = useState(null)

  const loadAdminData = async () => {
    try {
      const [statsRes, placesRes] = await Promise.all([
        adminService.getStats(),
        adminService.getPlaces(),
      ])

      if (statsRes.data.success) setStats(statsRes.data.data)
      if (placesRes.data.success) setPlaces(placesRes.data.data)
    } catch (err) {
      console.warn('Error loading admin data:', err)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadAdminData()
    }
  }, [isAdmin])

  // Delete place
  const handleDeletePlace = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from Peshawar verified database?`)) {
      try {
        await adminService.deletePlace(id)
        setPlaces((prev) => prev.filter((p) => p.id !== id))
        if (stats) setStats({ ...stats, totalPlaces: stats.totalPlaces - 1 })
      } catch {
        alert('Failed to delete place.')
      }
    }
  }

  const handleSavePlace = (savedPlace) => {
    if (editingPlace) {
      setPlaces((prev) => prev.map((p) => (p.id === savedPlace.id ? savedPlace : p)))
    } else {
      setPlaces((prev) => [savedPlace, ...prev])
      if (stats) setStats({ ...stats, totalPlaces: stats.totalPlaces + 1 })
    }
    setEditingPlace(null)
  }

  // If user is not logged in as Admin, show access gate
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center mx-auto shadow-lg">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Admin Portal Authentication
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The Admin Control Center allows managing verified Peshawar places, moderating reviews, and syncing AI ground truth data.
        </p>

        <button
          onClick={() => {
            login('admin@peshass.pk', 'admin', 'Engr. Tariq Afridi')
          }}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all"
        >
          Click Here for Instant Admin Access
        </button>
      </div>
    )
  }

  const filteredPlaces = places.filter(
    (p) =>
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.area_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category_slug.toLowerCase().includes(searchFilter.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Peshawar Municipal Data Authority</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Admin Management Console
          </h1>
          <p className="text-xs text-slate-500">
            Logged in as <strong>{user?.name}</strong> • Ground-truth database live
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPlace(null)
            setIsModalOpen(true)
          }}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Peshawar Place</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Places</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalPlaces}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Categories</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalCategories}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Peshawar Zones</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalAreas}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Verified Entities</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.verifiedPlaces}</p>
            </div>
          </div>
        </div>
      )}

      {/* Places Table & Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h2 className="font-bold text-base text-slate-900 dark:text-white">
            Peshawar Local Entity Database ({filteredPlaces.length})
          </h2>

          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search table..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Place</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Zone / Area</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPlaces.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white flex items-center space-x-2.5">
                    <img
                      src={p.cover_image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=80&auto=format&fit=crop&q=60'}
                      alt={p.name}
                      className="w-8 h-8 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <p className="line-clamp-1">{p.name}</p>
                      {p.urdu_name && (
                        <p className="text-[10px] text-slate-400 font-arabic font-normal">{p.urdu_name}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 capitalize">{p.category_slug}</td>
                  <td className="py-3 px-4">{p.area_name}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-1 font-bold text-slate-800 dark:text-slate-200">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{p.rating}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-600">{p.price_range}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link
                      to={`/place/${p.id}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 inline-block"
                      title="View Place Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => {
                        setEditingPlace(p)
                        setIsModalOpen(true)
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                      title="Edit Place"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePlace(p.id, p.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete Place"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Place Edit/Create Modal */}
      <PlaceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingPlace(null)
        }}
        place={editingPlace}
        onSave={handleSavePlace}
      />
    </div>
  )
}
