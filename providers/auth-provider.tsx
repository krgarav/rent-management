'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, UserRole } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('rent-management-auth')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (error) {
        console.error('Error restoring auth:', error)
      }
    }
    setIsLoading(false)
  }, [])

 const login = (user: User) => {
  setUser(user);
  localStorage.setItem("rent-management-auth", JSON.stringify(user));
};

  const logout = () => {
    setUser(null)
    localStorage.removeItem('rent-management-auth')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
