import { UserType } from '../types/userTypes'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export async function login(
  username: string,
  password: string,
  userType: UserType,
) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      username,
      password,
      user_type: userType,
    }),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        'Credenciais inválidas. Por favor, verifique seu email, senha e tipo de usuário.',
      )
    }
    throw new Error('Login failed')
  }

  const data = await response.json()

  localStorage.setItem('accessToken', data.data.access_token)
  localStorage.setItem('refreshToken', data.data.refresh_token)
  localStorage.setItem('userType', data.data.user_type)
  localStorage.setItem('userUid', data.data.user_uid)

  console.log(localStorage.getItem('userType'))

  return data
}

export async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken')
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

  return data
}

// Function to handle user logout
export async function logout() {
  const accessToken = localStorage.getItem('accessToken')
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

  return response.json()
}

// Helper function to get the stored access token
export function getAccessToken() {
  return localStorage.getItem('accessToken')
}

// Helper function to get the stored refresh token
export function getRefreshToken() {
  return localStorage.getItem('refreshToken')
}
