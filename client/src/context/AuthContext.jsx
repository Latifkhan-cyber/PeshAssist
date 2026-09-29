import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('peshass_user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        localStorage.removeItem('peshass_user')
      }
    }
    return null
  })

  const login = (email, role = 'user', name = '') => {
    const defaultName = role === 'admin' ? 'Admin Officer' : name || email.split('@')[0]
    const userData = {
      id: `usr-${Date.now()}`,
      email,
      name: defaultName,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    }
    setUser(userData)
    localStorage.setItem('peshass_user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('peshass_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
