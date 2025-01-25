'use client'
import type React from 'react'
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { useAuthApi, getAccessToken } from '../api/auth'
import type { UserType } from '../types/userTypes'
import { useQueryClient } from '@tanstack/react-query'

interface AuthContextType {
  isAuthenticated: boolean
  userType: UserType | null
  userId: string | null
  isLoading: boolean
  login: (
    username: string,
    password: string,
    userType: UserType,
  ) => Promise<void>
  logout: () => Promise<void>
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { useLogin, useLogout } = useAuthApi()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()
  const queryClient = useQueryClient()

  const checkAuth = useCallback(() => {
    const token = getAccessToken()
    const storedUserType = localStorage.getItem('userType') as UserType | null
    const storedUserId = localStorage.getItem('userId')
    if (token && storedUserType) {
      setIsAuthenticated(true)
      setUserType(storedUserType)
      setUserId(storedUserId)
    } else {
      setIsAuthenticated(false)
      setUserType(null)
      setUserId(null)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (
    username: string,
    password: string,
    userType: UserType,
  ) => {
    try {
      const response = await loginMutation.mutateAsync({
        username,
        password,
        userType,
      })
      setIsAuthenticated(true)
      setUserType(userType)
      setUserId(response.user_uid)
      localStorage.setItem('userType', userType)
      localStorage.setItem('userId', response.user_uid)
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync()
      setIsAuthenticated(false)
      setUserType(null)
      setUserId(null)
      localStorage.clear()
      queryClient.clear()
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  const value = {
    isAuthenticated,
    userType,
    userId,
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
