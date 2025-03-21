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
import type {
  UserType,
  UserWithType,
  SelectableUserType,
} from '../types/userTypes'
import { useQueryClient } from '@tanstack/react-query'

interface AuthContextType {
  isAuthenticated: boolean
  userType: UserType | null
  userId: string | null
  user: UserWithType | null
  isLoading: boolean
  login: (
    username: string,
    password: string,
    userType: SelectableUserType,
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
  const [user, setUser] = useState<UserWithType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { useLogin, useLogout } = useAuthApi()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()
  const queryClient = useQueryClient()

  const checkAuth = useCallback(() => {
    const token = getAccessToken()
    const storedUserType = localStorage.getItem('userType') as UserType | null
    const storedUserId = localStorage.getItem('userId')
    const storedUser = localStorage.getItem('user')

    if (token && storedUserType) {
      setIsAuthenticated(true)
      setUserType(storedUserType)
      setUserId(storedUserId)
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } else {
      setIsAuthenticated(false)
      setUserType(null)
      setUserId(null)
      setUser(null)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (
    username: string,
    password: string,
    userType: SelectableUserType,
  ) => {
    try {
      const response = await loginMutation.mutateAsync({
        username,
        password,
        userType,
      })

      // Mapear a resposta para o formato UserWithType
      const userWithType: UserWithType = {
        tipo_usuario: response.user_type,
        ...response,
      }

      setIsAuthenticated(true)
      setUserType(userType as UserType)
      setUserId(response.user_uid)
      setUser(userWithType)
      localStorage.setItem('accessToken', response.access_token)
      localStorage.setItem('refreshToken', response.refresh_token)
      localStorage.setItem('userType', response.user_type)
      localStorage.setItem('userId', response.user_uid)
      localStorage.setItem('userIsAdmin', response.is_admin)
      localStorage.setItem('user', JSON.stringify(response))
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync()
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userType')
      localStorage.removeItem('userId')
      setIsAuthenticated(false)
      setUserType(null)
      setUserId(null)
      setUser(null)
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
    user,
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
