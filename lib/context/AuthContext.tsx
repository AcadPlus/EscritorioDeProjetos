'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  login as apiLogin,
  logout as apiLogout,
  getAccessToken,
} from '../api/auth'
import { UserType } from '../types/userTypes'

interface AuthContextType {
  isAuthenticated: boolean
  userType: UserType | null
  isLoading: boolean
  login: (username: string, password: string, userType: UserType) => Promise<void>
  logout: () => Promise<void>
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken()
      if (token) {
        setIsAuthenticated(true)
        setUserType(localStorage.getItem('userType') as UserType)
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (
    username: string,
    password: string,
    userType: UserType,
  ) => {
    try {
      await apiLogin(username, password, userType)
      setIsAuthenticated(true)
      setUserType(userType)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiLogout()
      setIsAuthenticated(false)
      setUserType(null)
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  const value = {
    isAuthenticated,
    userType,
    isLoading,
    login,
    logout,
    getAccessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
