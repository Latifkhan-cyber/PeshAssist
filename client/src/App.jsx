import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { ChatProvider } from './context/ChatContext'
import { MainLayout } from './layouts/MainLayout'

// Pages
import { Home } from './pages/Home'
import { ExplorePage } from './pages/ExplorePage'
import { ChatPage } from './pages/ChatPage'
import { PlaceDetailsPage } from './pages/PlaceDetailsPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { AdminDashboard } from './pages/AdminDashboard'
import { LoginPage } from './pages/LoginPage'

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ChatProvider>
          <Router>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/place/:id" element={<PlaceDetailsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/auth/login" element={<LoginPage />} />
                {/* Fallback */}
                <Route path="*" element={<Home />} />
              </Route>
            </Routes>
          </Router>
        </ChatProvider>
      </FavoritesProvider>
    </AuthProvider>
  )
}

export default App
