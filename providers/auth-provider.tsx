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

// Mock users for demo - use these credentials to login
const MOCK_USERS: Record<string, { user: User; password: string }> = {
  'admin@rentmanagement.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@rentmanagement.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  'manager@rentmanagement.com': {
    password: 'manager123',
    user: {
      id: '2',
      email: 'manager@rentmanagement.com',
      name: 'John Property Manager',
      role: UserRole.PROPERTY_MANAGER,
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  'tenant@rentmanagement.com': {
    password: 'tenant123',
    user: {
      id: '3',
      email: 'tenant@rentmanagement.com',
      name: 'Sarah Tenant',
      role: UserRole.TENANT,
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
}

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

  const login = (email: string, password: string) => {
    const credentials = MOCK_USERS[email]
    if (credentials && credentials.password === password) {
      setUser(credentials.user)
      localStorage.setItem('rent-management-auth', JSON.stringify(credentials.user))
      return true
    }
    return false
  }

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
