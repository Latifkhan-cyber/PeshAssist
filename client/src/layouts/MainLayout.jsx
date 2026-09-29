import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export const MainLayout = () => {
  const location = useLocation()
  const isChat = location.pathname === '/chat'

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${isChat ? 'h-screen overflow-hidden' : ''}`}>
      <Navbar />
      <main className={`flex-1 ${isChat ? 'overflow-hidden flex flex-col' : ''}`}>
        <Outlet />
      </main>
      {!isChat && <Footer />}
    </div>
  )
}

