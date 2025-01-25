import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from '../hooks/useApi'
import type {
  IniciativaCreateAndUpdate,
  IniciativaResponse,
  InitiativeStatus,
} from '../types/initiativeTypes'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export const useApiIniciativas = () => {
  const { fetchWithToken } = useApi()
  const queryClient = useQueryClient()

  const createIniciativa = async (
    iniciativaData: IniciativaCreateAndUpdate,
  ): Promise<IniciativaResponse> => {
    const response = await fetchWithToken(`${API_BASE_URL}/iniciativas/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(iniciativaData),
    })
    return await response.json()
  }

  const getIniciativaById = async (
    iniciativaId: string,
  ): Promise<IniciativaResponse> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/iniciativas/${iniciativaId}`,
      {
        requireAuth: false,
      },
    )
    return await response.json()
  }

  const listIniciativas = async (
    negocioId?: string,
    status: InitiativeStatus = 'aprovado',
  ): Promise<IniciativaResponse[]> => {
    let url = `${API_BASE_URL}/iniciativas/?status=${status}`
    if (negocioId) {
      url += `&negocio_id=${negocioId}`
    }
    const response = await fetchWithToken(url, {
      requireAuth: false,
    })
    const data = await response.json()
    return data.data
  }

  const updateIniciativa = async ({
    iniciativaId,
    updateData,
  }: {
    iniciativaId: string
    updateData: IniciativaCreateAndUpdate
  }): Promise<IniciativaResponse> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/iniciativas/${iniciativaId}`,
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

  const deleteIniciativa = async (iniciativaId: string): Promise<void> => {
    await fetchWithToken(`${API_BASE_URL}/iniciativas/${iniciativaId}`, {
      method: 'DELETE',
    })
  }

  const approveIniciativa = async (
    iniciativaId: string,
  ): Promise<IniciativaResponse> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/iniciativas/${iniciativaId}/approve`,
      {
        method: 'PUT',
      },
    )
    return await response.json()
  }

  const rejectIniciativa = async (
    iniciativaId: string,
  ): Promise<IniciativaResponse> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/iniciativas/${iniciativaId}/reject`,
      {
        method: 'PUT',
      },
    )
    return await response.json()
  }

  const useCreateIniciativa = () =>
    useMutation({
      mutationFn: createIniciativa,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['iniciativas'] })
      },
    })

  const useGetIniciativaById = (iniciativaId: string) =>
    useQuery({
      queryKey: ['iniciativa', iniciativaId],
      queryFn: () => getIniciativaById(iniciativaId),
    })

  const useListIniciativas = (
    negocioId?: string,
    status: InitiativeStatus = 'aprovado',
  ) =>
    useQuery({
      queryKey: ['iniciativas', negocioId, status],
      queryFn: () => listIniciativas(negocioId, status),
    })

  const useUpdateIniciativa = () =>
    useMutation({
      mutationFn: updateIniciativa,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['iniciativa', data.id] })
        queryClient.invalidateQueries({ queryKey: ['iniciativas'] })
      },
    })

  const useDeleteIniciativa = () =>
    useMutation({
      mutationFn: deleteIniciativa,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['iniciativas'] })
      },
    })

  const useApproveIniciativa = () =>
    useMutation({
      mutationFn: approveIniciativa,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['iniciativa', data.id] })
        queryClient.invalidateQueries({ queryKey: ['iniciativas'] })
      },
    })

  const useRejectIniciativa = () =>
    useMutation({
      mutationFn: rejectIniciativa,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['iniciativa', data.id] })
        queryClient.invalidateQueries({ queryKey: ['iniciativas'] })
      },
    })

  return {
    useCreateIniciativa,
    useGetIniciativaById,
    useListIniciativas,
    useUpdateIniciativa,
    useDeleteIniciativa,
    useApproveIniciativa,
    useRejectIniciativa,
  }
}
