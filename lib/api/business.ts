import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from '../hooks/useApi'
import type {
  NegocioCreate,
  NegocioUpdate,
  NegocioResponse,
  BusinessStatus,
  BusinessesByAdminResponse,
} from '../types/businessTypes'
import { toast } from '@/hooks/use-toast'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export const useBusinessApi = () => {
  const { fetchWithToken } = useApi()
  const queryClient = useQueryClient()

  const createBusiness = async (
    businessData: NegocioCreate,
  ): Promise<NegocioResponse> => {
    const response = await fetchWithToken(`${API_BASE_URL}/business/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(businessData),
    })
    return await response.json()
  }

  const getBusinessById = async (
    businessId: string,
  ): Promise<NegocioResponse> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/business/${businessId}`,
      {
        requireAuth: false,
      },
    )
    return await response.json()
  }

  const listBusinesses = async (
    status: BusinessStatus = 'aprovado',
  ): Promise<NegocioResponse[]> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/business/?status=${status}`,
      {
        requireAuth: false,
      },
    )
    const data = await response.json()
    console.log(data)
    return data.data
  }

  const updateBusiness = async ({
    businessId,
    updateData,
  }: {
    businessId: string
    updateData: NegocioUpdate
  }): Promise<NegocioResponse> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/business/${businessId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      },
    )
    const data = await response.json()
    return data.data
  }

  const deleteBusiness = async (businessId: string): Promise<void> => {
    await fetchWithToken(`${API_BASE_URL}/business/${businessId}`, {
      method: 'DELETE',
    })
    toast({
      title: 'Negócio Removido com Sucesso',
      duration: 5000,
    })
  }

  const approveBusiness = async (
    businessId: string,
  ): Promise<NegocioResponse> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/business/${businessId}/approve`,
      {
        method: 'PUT',
      },
    )
    return await response.json()
  }

  const rejectBusiness = async (
    businessId: string,
  ): Promise<NegocioResponse> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/business/${businessId}/reject`,
      {
        method: 'PUT',
      },
    )
    return await response.json()
  }

  const getBusinessesByAdmin = async (): Promise<BusinessesByAdminResponse> => {
    const response = await fetchWithToken(`${API_BASE_URL}/business/admin`, {
      requireAuth: true,
    })
    const data = await response.json()
    return data.data
  }

  const useCreateBusiness = () =>
    useMutation({
      mutationFn: createBusiness,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['businesses'] })
      },
    })

  const useGetBusinessById = (businessId: string) =>
    useQuery({
      queryKey: ['business', businessId],
      queryFn: () => getBusinessById(businessId),
    })

  const useListBusinesses = (status: BusinessStatus = 'aprovado') =>
    useQuery({
      queryKey: ['businesses', status],
      queryFn: () => listBusinesses(status),
    })

  const useUpdateBusiness = () =>
    useMutation({
      mutationFn: updateBusiness,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['business', data.id] })
        queryClient.invalidateQueries({ queryKey: ['businesses'] })
      },
    })

  const useDeleteBusiness = () =>
    useMutation({
      mutationFn: deleteBusiness,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['businesses'] })
      },
    })

  const useApproveBusiness = () =>
    useMutation({
      mutationFn: approveBusiness,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['business', data.id] })
        queryClient.invalidateQueries({ queryKey: ['businesses'] })
      },
    })

  const useRejectBusiness = () =>
    useMutation({
      mutationFn: rejectBusiness,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['business', data.id] })
        queryClient.invalidateQueries({ queryKey: ['businesses'] })
      },
    })

  const useGetBusinessesByAdmin = () =>
    useQuery({
      queryKey: ['businesses', 'admin'],
      queryFn: () => getBusinessesByAdmin(),
    })

  return {
    useCreateBusiness,
    useGetBusinessById,
    useListBusinesses,
    useUpdateBusiness,
    useDeleteBusiness,
    useApproveBusiness,
    useRejectBusiness,
    useGetBusinessesByAdmin,
  }
}
