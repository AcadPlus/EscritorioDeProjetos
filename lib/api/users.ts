/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserType, UserCreateData } from '../types/userTypes'
import { useApi } from '../hooks/useApi'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export const useUserApi = () => {
  const { fetchWithToken, isLoading, error } = useApi()

  const getCurrentUser = async () => {
    try {
      const response = await fetchWithToken(`${API_BASE_URL}/users/me`)
      const data = await response.json()
      return data.data.user
    } catch (error) {
      console.error('Error fetching current user:', error)
      throw error
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetchWithToken(`${API_BASE_URL}/users/all`, {
        requireAuth: false,
      })
      const data = await response.json()
      return data.data.map((item: { user: any }) => item.user)
    } catch (error) {
      console.error('Error fetching all users:', error)
      throw error
    }
  }

  const getUsers = async (userType: UserType) => {
    try {
      const response = await fetchWithToken(
        `${API_BASE_URL}/users/${userType}`,
        { requireAuth: false },
      )
      return await response.json()
    } catch (error) {
      console.error(`Error fetching ${userType} users:`, error)
      throw error
    }
  }

  const getUserById = async (userType: UserType, userId: string) => {
    try {
      const response = await fetchWithToken(
        `${API_BASE_URL}/users/${userType}/${userId}`,
        { requireAuth: false },
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  }

  const createUser = async (userData: UserCreateData) => {
    try {
      const response = await fetchWithToken(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userData }),
        requireAuth: false,
      })
      return await response.json()
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  const updateUser = async (
    userType: UserType,
    userId: string,
    userData: Partial<UserCreateData>,
  ) => {
    try {
      const response = await fetchWithToken(
        `${API_BASE_URL}/users/${userType}/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: userData }),
        },
      )
      return await response.json()
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  const deleteUser = async (userType: UserType, userId: string) => {
    try {
      const response = await fetchWithToken(
        `${API_BASE_URL}/users/${userType}/${userId}`,
        {
          method: 'DELETE',
        },
      )
      return await response.json()
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  return {
    getCurrentUser,
    fetchUsers,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    isLoading,
    error,
  }
}
