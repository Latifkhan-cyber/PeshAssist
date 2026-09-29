import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  Compass,
  MessageSquareText,
  Heart,
  Shield,
  LogOut,
  Menu,
  X,
  Sparkles,
  MapPin,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const { favorites } = useFavorites()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
        : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Pesh<span className="text-emerald-600 dark:text-emerald-400">Assist</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide flex items-center space-x-0.5">
              <MapPin className="w-2.5 h-2.5 text-emerald-500 inline" />
              <span>Peshawar Local Guide</span>
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1.5">
          <NavLink to="/explore" className={navLinkClass}>
            <Compass className="w-4 h-4" />
            <span>Explore Places</span>
          </NavLink>

          <NavLink to="/chat" className={navLinkClass}>
            <MessageSquareText className="w-4 h-4" />
            <span>AI Assistant</span>
          </NavLink>

          <NavLink to="/favorites" className={navLinkClass}>
            <Heart className="w-4 h-4" />
            <span>Favorites</span>
            {favorites.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold">
                {favorites.length}
              </span>
            )}
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              <Shield className="w-4 h-4 text-amber-500" />
              <span className="text-amber-600 dark:text-amber-400 font-semibold">Admin</span>
            </NavLink>
          )}
        </nav>

        {/* User / Auth Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full ring-2 ring-emerald-500/30 bg-slate-100"
                />
                <div className="text-left leading-tight">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/auth/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth/login?role=admin"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 transition-all"
              >
                Admin Demo
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 space-y-2 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xl">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Explore Places</span>
          </Link>
          <Link
            to="/chat"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <MessageSquareText className="w-4 h-4 text-emerald-600" />
            <span>AI Assistant</span>
          </Link>
          <Link
            to="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Heart className="w-4 h-4 text-emerald-600" />
            <span>Saved Favorites ({favorites.length})</span>
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          )}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Signed in as {user.name} ({user.role})
                </span>
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs"
              >
                Sign In / Demo Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
