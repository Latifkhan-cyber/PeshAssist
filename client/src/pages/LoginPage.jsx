import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Sparkles, Shield, User, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const LoginPage = () => {
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get('role') || 'user'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleDemoLogin = (role, name, demoEmail) => {
    login(demoEmail, role, name)
    if (role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/explore')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      login(email, initialRole === 'admin' ? 'admin' : 'user')
      navigate(initialRole === 'admin' ? '/admin' : '/explore')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 mx-auto flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Welcome to PeshAssist
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to save favorite Peshawar spots and post verified reviews
          </p>
        </div>

        {/* 1-Click Demo Buttons */}
        <div className="space-y-2.5 pt-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Instant 1-Click Demo Access
          </p>

          <button
            type="button"
            onClick={() => handleDemoLogin('admin', 'Engr. Tariq Afridi (Admin)', 'admin@peshass.pk')}
            className="w-full py-3 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-between transition-all"
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-amber-500" />
              <span>Login as Peshawar Admin Officer</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('user', 'Farhan Durrani', 'farhan@gmail.com')}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center justify-between transition-all"
          >
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Login as Regular User (Farhan)</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-slate-400">
            Or continue with email
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all"
          >
            Sign In with Email
          </button>
        </form>
      </div>
    </div>
  )
}
