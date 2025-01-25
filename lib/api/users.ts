/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserType, UserCreateData } from '../types/userTypes'
import { useApi } from '../hooks/useApi'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export const useUserApi = () => {
  const { fetchWithToken } = useApi()
  const queryClient = useQueryClient()

  const getCurrentUser = async () => {
    const response = await fetchWithToken(`${API_BASE_URL}/users/me`)
    const data = await response.json()
    return data.data.user
  }

  const fetchUsers = async () => {
    const response = await fetchWithToken(`${API_BASE_URL}/users/all`, {
      requireAuth: false,
    })
    const data = await response.json()
    return data.data.map((item: { user: any }) => item.user)
  }

  const getUsers = async (userType: UserType) => {
    const response = await fetchWithToken(`${API_BASE_URL}/users/${userType}`, {
      requireAuth: false,
    })
    return await response.json()
  }

  const getUserById = async ({
    userType,
    userId,
  }: {
    userType: UserType
    userId: string
  }) => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/users/${userType}/${userId}`,
      { requireAuth: false },
    )
    return await response.json()
  }

  const createUser = async (userData: UserCreateData) => {
    const response = await fetchWithToken(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userData }),
      requireAuth: false,
    })
    return await response.json()
  }

  const updateUser = async ({
    userType,
    userId,
    userData,
  }: {
    userType: UserType
    userId: string
    userData: Partial<UserCreateData>
  }) => {
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
  }

  const deleteUser = async ({
    userType,
    userId,
  }: {
    userType: UserType
    userId: string
  }) => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/users/${userType}/${userId}`,
      {
        method: 'DELETE',
      },
    )
    return await response.json()
  }

  // React Query hooks
  const useGetCurrentUser = () =>
    useQuery({
      queryKey: ['currentUser'],
      queryFn: getCurrentUser,
    })

  const useFetchUsers = () =>
    useQuery({
      queryKey: ['users'],
      queryFn: fetchUsers,
    })

  const useGetUsers = (userType: UserType) =>
    useQuery({
      queryKey: ['users', userType],
      queryFn: () => getUsers(userType),
    })

  const useGetUserById = (userType: UserType, userId: string) =>
    useQuery({
      queryKey: ['user', userType, userId],
      queryFn: () => getUserById({ userType, userId }),
    })

  const useCreateUser = () =>
    useMutation({
      mutationFn: createUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
      },
    })

  const useUpdateUser = () =>
    useMutation({
      mutationFn: updateUser,
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({
          queryKey: ['user', variables.userType, variables.userId],
        })
        queryClient.invalidateQueries({ queryKey: ['users'] })
      },
    })

  const useDeleteUser = () =>
    useMutation({
      mutationFn: deleteUser,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        queryClient.removeQueries({
          queryKey: ['user', variables.userType, variables.userId],
        })
      },
    })

  return {
    useGetCurrentUser,
    useFetchUsers,
    useGetUsers,
    useGetUserById,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
  }
}
