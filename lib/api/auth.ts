import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UserType } from '../types/userTypes'
import { toast } from '@/hooks/use-toast'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

interface LoginResponse {
  is_admin: string
  access_token: string
  refresh_token: string
  user_type: UserType
  user_uid: string
}

interface LoginParams {
  username: string
  password: string
  userType: UserType
}

export const getAccessToken = () => localStorage.getItem('accessToken')
export const getRefreshToken = () => localStorage.getItem('refreshToken')

export const useAuthApi = () => {
  const queryClient = useQueryClient()

  const login = async ({
    username,
    password,
    userType,
  }: LoginParams): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username,
        password,
        scope: userType,
      }),
    })

    if (!response.ok) {
      if (response.status === 401) {
        toast({
          title: 'Erro',
          description:
            'Credenciais inválidas. Por favor, verifique seu email, senha e tipo de usuário.',
          variant: 'destructive',
        })
      }
      throw new Error('Login failed')
    }

    const data = await response.json()

    localStorage.setItem('accessToken', data.data.access_token)
    localStorage.setItem('refreshToken', data.data.refresh_token)
    localStorage.setItem('userType', data.data.user_type)
    localStorage.setItem('userUid', data.data.user_uid)
    localStorage.setItem('userIsAdmin', data.data.is_admin)
    // Compatibilidade: manter chave legada
    localStorage.setItem('token', data.data.access_token)
    
    return data.data
  }

  const refreshToken = async (): Promise<LoginResponse> => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid refresh token')
      }
      throw new Error('Failed to refresh token')
    }

    const data = await response.json()
    localStorage.setItem('accessToken', data.data.access_token)
    localStorage.setItem('refreshToken', data.data.refresh_token)
    localStorage.setItem('userType', data.data.user_type)
    localStorage.setItem('userUid', data.data.user_uid)
    // Compatibilidade: manter chave legada
    localStorage.setItem('token', data.data.access_token)

    return data.data
  }

  const logout = async (): Promise<void> => {
    const accessToken = getAccessToken()
    if (!accessToken) {
      throw new Error('No access token available')
    }

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expired')
      }
      throw new Error('Invalid token')
    }

    localStorage.clear()
  }

  const useLogin = () =>
    useMutation({
      mutationFn: login,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      },
    })

  const useRefreshToken = () =>
    useMutation({
      mutationFn: refreshToken,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      },
    })

  const useLogout = () =>
    useMutation({
      mutationFn: logout,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        queryClient.clear()
      },
    })

  return {
    useLogin,
    useRefreshToken,
    useLogout,
  }
}
