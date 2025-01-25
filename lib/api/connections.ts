import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from '../hooks/useApi'
import type {
  ConnectionRequest,
  RequestType,
  ConnectionStatus,
} from '../types/connectionTypes'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export function useConnectionRequests() {
  const queryClient = useQueryClient()
  const { fetchWithToken } = useApi()

  const getRequests = async (
    requestType: RequestType,
    status?: ConnectionStatus,
  ): Promise<ConnectionRequest[]> => {
    let url = `${API_BASE_URL}/connections/requests/${requestType}`
    if (status) {
      url += `?status=${status}`
    }
    const response = await fetchWithToken(url)
    const data = await response.json()
    return data.data
  }

  const createRequest = async (
    targetId: string,
  ): Promise<ConnectionRequest> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/connections/request`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ target_id: targetId }),
      },
    )
    return await response.json()
  }

  const updateRequest = async ({
    userId,
    status,
  }: {
    userId: string
    status: ConnectionStatus
  }): Promise<ConnectionRequest> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/connections/request/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      },
    )
    return await response.json()
  }

  const cancelRequest = async (userId: string): Promise<void> => {
    await fetchWithToken(`${API_BASE_URL}/connections/request/${userId}`, {
      method: 'DELETE',
    })
  }

  const getUserConnections = async (): Promise<string[]> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/connections/connections`,
    )
    const data = await response.json()
    return data.data.connections
  }

  const removeConnection = async ({
    userId,
    userType,
  }: {
    userId: string
    userType: string
  }): Promise<void> => {
    await fetchWithToken(`${API_BASE_URL}/connections/${userType}/${userId}`, {
      method: 'DELETE',
    })
  }

  const useGetRequests = (
    requestType: RequestType,
    status?: ConnectionStatus,
  ) =>
    useQuery({
      queryKey: ['connectionRequests', requestType, status],
      queryFn: () => getRequests(requestType, status),
    })

  const useCreateRequest = () =>
    useMutation({
      mutationFn: createRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connectionRequests'] })
      },
    })

  const useUpdateRequest = () =>
    useMutation({
      mutationFn: updateRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connectionRequests'] })
      },
    })

  const useCancelRequest = () =>
    useMutation({
      mutationFn: cancelRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connectionRequests'] })
      },
    })

  const useGetUserConnections = () =>
    useQuery({
      queryKey: ['userConnections'],
      queryFn: getUserConnections,
    })

  const useRemoveConnection = () =>
    useMutation({
      mutationFn: removeConnection,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connectionRequests'] })
      },
    })

  return {
    useGetRequests,
    useCreateRequest,
    useUpdateRequest,
    useCancelRequest,
    useGetUserConnections,
    useRemoveConnection,
  }
}
