import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/lib/hooks/useApi'
import type {
  NegocioCreate,
  NegocioUpdate,
  NegocioResponse,
  BusinessesByAdminResponse,
  PapelNegocio,
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
    const data = await response.json()
    return data.data
  }

  const listBusinesses = async (
    status: string = 'aprovado',
  ): Promise<NegocioResponse[]> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/business/?status=${status}`,
      {
        requireAuth: false,
      },
    )
    const data = await response.json()
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
      title: 'Negócio removido',
      description: 'O negócio foi removido com sucesso do sistema.',
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

  const rejectBusiness = async ({
    businessId,
    motivo,
  }: {
    businessId: string
    motivo: { motivo_rejeicao: string }
  }): Promise<NegocioResponse> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/business/${businessId}/reject`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(motivo),
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

  const getUserBusinesses = async (): Promise<NegocioResponse[]> => {
    const response = await fetchWithToken(`${API_BASE_URL}/business/me`, {
      requireAuth: true,
    })
    const data = await response.json()
    return data.data
  }

  const addBusinessMember = async ({
    businessId,
    userId,
    papel,
  }: {
    businessId: string
    userId: string
    papel: PapelNegocio
  }): Promise<NegocioResponse> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/business/${businessId}/members/invite`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userId,
          papel,
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Erro ao adicionar membro')
    }

    const data = await response.json()
    return data.data
  }

  const acceptBusinessInvite = async ({
    businessId,
  }: {
    businessId: string
  }): Promise<NegocioResponse> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/business/${businessId}/members/accept`,
      {
        method: 'POST',
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Erro ao aceitar convite')
    }

    const data = await response.json()
    return data.data
  }

  const rejectBusinessInvite = async ({
    businessId,
  }: {
    businessId: string
  }): Promise<NegocioResponse> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/business/${businessId}/members/reject`,
      {
        method: 'POST',
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Erro ao recusar convite')
    }

    const data = await response.json()
    return data.data
  }

  const removeBusinessMember = async ({
    businessId,
    userId,
  }: {
    businessId: string
    userId: string
  }): Promise<NegocioResponse> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/business/${businessId}/members/${userId}`,
      {
        method: 'DELETE',
      },
    )
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

  const useListBusinesses = (status: string = 'aprovado') =>
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

  const useGetUserBusinesses = () =>
    useQuery({
      queryKey: ['user-businesses'],
      queryFn: getUserBusinesses,
    })

  const useGetBusiness = (businessId: string) =>
    useQuery({
      queryKey: ['business', businessId],
      queryFn: () => getBusinessById(businessId),
      retry: false,
      enabled: !!businessId,
    })

  const updateBusinessPhotos = async ({
    businessId,
    fotoPerfil,
    fotoCapa,
  }: {
    businessId: string
    fotoPerfil?: File
    fotoCapa?: File
  }): Promise<NegocioResponse> => {
    const formData = new FormData()

    if (fotoPerfil) {
      formData.append('foto_perfil', fotoPerfil)
    }
    if (fotoCapa) {
      formData.append('foto_capa', fotoCapa)
    }

    const response = await fetchWithToken(
      `${API_BASE_URL}/business/${businessId}/fotos`,
      {
        method: 'PUT',
        body: formData,
      },
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Erro ao atualizar fotos')
    }

    return getBusinessById(businessId)
  }

  const useUpdateBusinessPhotos = () =>
    useMutation({
      mutationFn: updateBusinessPhotos,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['business', data.id] })
        toast({
          title: 'Fotos atualizadas',
          description: 'As fotos do negócio foram atualizadas com sucesso.',
        })
      },
      onError: (error: Error) => {
        toast({
          title: 'Erro ao atualizar fotos',
          description:
            error.message ||
            'Não foi possível atualizar as fotos do negócio. Por favor, tente novamente.',
          variant: 'destructive',
        })
      },
    })

  const useAddBusinessMember = () =>
    useMutation({
      mutationFn: addBusinessMember,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['business', data.id] })
        toast({
          title: 'Convite enviado',
          description: 'O convite foi enviado com sucesso.',
        })
      },
      onError: (error: Error) => {
        toast({
          title: 'Erro ao enviar convite',
          description:
            error.message ||
            'Não foi possível enviar o convite. Tente novamente.',
          variant: 'destructive',
        })
      },
    })

  const useAcceptBusinessInvite = () =>
    useMutation({
      mutationFn: acceptBusinessInvite,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['business', data.id] })
        queryClient.invalidateQueries({ queryKey: ['user-businesses'] })
        toast({
          title: 'Convite aceito',
          description: 'Você agora é membro deste negócio.',
        })
      },
      onError: (error: Error) => {
        toast({
          title: 'Erro ao aceitar convite',
          description:
            error.message ||
            'Não foi possível aceitar o convite. Tente novamente.',
          variant: 'destructive',
        })
      },
    })

  const useRejectBusinessInvite = () =>
    useMutation({
      mutationFn: rejectBusinessInvite,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['business', data.id] })
        toast({
          title: 'Convite recusado',
          description: 'O convite foi recusado com sucesso.',
        })
      },
      onError: (error: Error) => {
        toast({
          title: 'Erro ao recusar convite',
          description:
            error.message ||
            'Não foi possível recusar o convite. Tente novamente.',
          variant: 'destructive',
        })
      },
    })

  const useRemoveBusinessMember = () =>
    useMutation({
      mutationFn: removeBusinessMember,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['business', data.id] })
        queryClient.invalidateQueries({ queryKey: ['user-businesses'] })
        toast({
          title: 'Membro removido',
          description: 'O membro foi removido com sucesso do negócio.',
        })
      },
      onError: (error: Error) => {
        toast({
          title: 'Erro ao remover membro',
          description:
            error.message ||
            'Não foi possível remover o membro. Tente novamente.',
          variant: 'destructive',
        })
      },
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
    useGetUserBusinesses,
    useGetBusiness,
    useUpdateBusinessPhotos,
    useAddBusinessMember,
    useAcceptBusinessInvite,
    useRejectBusinessInvite,
    useRemoveBusinessMember,
  }
}
