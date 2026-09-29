import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, MapPin } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Pesh<span className="text-emerald-400">Assist</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart AI-powered local guide and verified discovery engine for Peshawar, Khyber Pakhtunkhwa.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium pt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Namak Mandi • University Road • Hayatabad • Saddar</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore?category=restaurants" className="hover:text-emerald-400 transition-colors">
                  Food & Shinwari Karahi
                </Link>
              </li>
              <li>
                <Link to="/explore?category=hospitals" className="hover:text-emerald-400 transition-colors">
                  24/7 Emergency Hospitals
                </Link>
              </li>
              <li>
                <Link to="/explore?category=tourism" className="hover:text-emerald-400 transition-colors">
                  Historic Forts & Tourism
                </Link>
              </li>
              <li>
                <Link to="/explore?category=services" className="hover:text-emerald-400 transition-colors">
                  Laptop & Mobile Repair
                </Link>
              </li>
              <li>
                <Link to="/explore?category=transport" className="hover:text-emerald-400 transition-colors">
                  Zu Peshawar BRT Routes
                </Link>
              </li>
            </ul>
          </div>

          {/* Key Areas */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Key Peshawar Zones
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore?area=University%20Road" className="hover:text-emerald-400 transition-colors">
                  University Road & Town
                </Link>
              </li>
              <li>
                <Link to="/explore?area=Hayatabad" className="hover:text-emerald-400 transition-colors">
                  Hayatabad (Phases 1-7)
                </Link>
              </li>
              <li>
                <Link to="/explore?area=Saddar" className="hover:text-emerald-400 transition-colors">
                  Saddar Cantonment & Deans
                </Link>
              </li>
              <li>
                <Link to="/explore?area=Namak%20Mandi" className="hover:text-emerald-400 transition-colors">
                  Namak Mandi & Qissa Khwani
                </Link>
              </li>
              <li>
                <Link to="/explore?area=Warsak%20Road" className="hover:text-emerald-400 transition-colors">
                  Warsak & Ring Road
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech & AI Integrity */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              AI Grounding & Tech
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Powered by Google Gemini with strict local factual grounding to eliminate hallucinations.
            </p>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                React + Vite
              </span>
              <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                Express REST
              </span>
              <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                Supabase
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PeshAssist. Made for the people of Peshawar with ❤️</p>
          <div className="flex items-center space-x-4">
            <Link to="/chat" className="hover:text-emerald-400 transition-colors">
              Chat with Assistant
            </Link>
            <Link to="/admin" className="hover:text-emerald-400 transition-colors">
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
