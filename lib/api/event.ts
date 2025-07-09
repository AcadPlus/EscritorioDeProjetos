import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from '../hooks/useApi'
import {
  EventCreate,
  EventUpdate,
  EventResponse,
  EventStatus,
  ParticipanteStatus,
} from '../types/eventTypes'
import { toast } from '@/hooks/use-toast'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export function useEventApi() {
  const { fetchWithToken } = useApi()
  const queryClient = useQueryClient()

  const createEvent = async (
    eventData: EventCreate,
  ): Promise<EventResponse> => {
    const response = await fetchWithToken(`${API_BASE_URL}/events/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
    const data = await response.json()
    return data.data
  }

  const getEventById = async (eventId: string): Promise<EventResponse> => {
    const response = await fetchWithToken(`${API_BASE_URL}/events/${eventId}`, {
      requireAuth: false,
    })
    const data = await response.json()
    return data.data
  }

  const listEvents = async (status?: EventStatus): Promise<EventResponse[]> => {
    const params = new URLSearchParams()
    if (status) params.append('status', status)

    const response = await fetchWithToken(
      `${API_BASE_URL}/events/?${params.toString()}`,
      {
        requireAuth: false,
      },
    )
    const data = await response.json()
    return data.data
  }

  const getUserEvents = async (): Promise<EventResponse[]> => {
    const response = await fetchWithToken(`${API_BASE_URL}/events/me`, {
      requireAuth: true,
    })
    const data = await response.json()
    return data.data
  }

  const updateEvent = async ({
    eventId,
    updateData,
  }: {
    eventId: string
    updateData: EventUpdate
  }): Promise<EventResponse> => {
    const response = await fetchWithToken(`${API_BASE_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })
    const data = await response.json()
    return data.data
  }

  const deleteEvent = async (eventId: string): Promise<void> => {
    await fetchWithToken(`${API_BASE_URL}/events/${eventId}`, {
      method: 'DELETE',
    })
    toast({
      title: 'Evento Removido com Sucesso',
      duration: 5000,
    })
  }

  const updateEventStatus = async ({
    eventId,
    status,
  }: {
    eventId: string
    status: EventStatus
  }): Promise<EventResponse> => {
    const response = await fetchWithToken(
      `${API_BASE_URL}/events/${eventId}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      },
    )
    const data = await response.json()
    return data.data
  }

  const participarEvento = async (eventId: string): Promise<void> => {
    try {
      const response = await fetchWithToken(
        `${API_BASE_URL}/events/${eventId}/participar`,
        {
          method: 'POST',
        },
      )
      toast.success('Inscrição realizada com sucesso')
    } catch (error) {
      toast.error('Erro ao se inscrever no evento')
      throw error
    }
  }

  const validarPresenca = async (
    eventId: string,
    usuarioId: string,
    status: ParticipanteStatus,
  ): Promise<void> => {
    try {
      const response = await fetchWithToken(
        `${API_BASE_URL}/events/${eventId}/validar-presenca`,
        {
          method: 'POST',
          body: JSON.stringify({ uid_usuario: usuarioId, status }),
        },
      )
      toast.success('Presença validada com sucesso')
    } catch (error) {
      toast.error('Erro ao validar presença')
      throw error
    }
  }

  const getCertificado = async (eventId: string): Promise<void> => {
    try {
      const response = await fetchWithToken(
        `${API_BASE_URL}/events/${eventId}/certificado`,
      )
    } catch (error) {
      toast.error('Erro ao obter certificado')
      throw error
    }
  }

  const useCreateEvent = () =>
    useMutation({
      mutationFn: createEvent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['events'] })
        toast({
          title: 'Sucesso!',
          description: 'Evento criado com sucesso',
        })
      },
      onError: (error: Error) => {
        toast({
          title: 'Erro ao criar evento',
          description: error.message || 'Tente novamente mais tarde',
          variant: 'destructive',
        })
      },
    })

  const useGetEventById = (eventId: string) =>
    useQuery({
      queryKey: ['event', eventId],
      queryFn: () => getEventById(eventId),
      retry: false,
    })

  const useListEvents = (status?: EventStatus, enabled: boolean = true) =>
    useQuery({
      queryKey: ['events', status],
      queryFn: () => listEvents(status),
      enabled,
      retry: false,
    })

  const useGetUserEvents = (enabled: boolean = true) =>
    useQuery({
      queryKey: ['userEvents'],
      queryFn: getUserEvents,
      enabled,
      retry: false,
    })

  const useUpdateEvent = () =>
    useMutation({
      mutationFn: updateEvent,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['event', data.uid] })
        queryClient.invalidateQueries({ queryKey: ['events'] })
        queryClient.invalidateQueries({ queryKey: ['userEvents'] })
        toast({
          title: 'Sucesso!',
          description: 'Evento atualizado com sucesso',
        })
      },
      onError: (error: Error) => {
        toast({
          title: 'Erro ao atualizar evento',
          description: error.message || 'Tente novamente mais tarde',
          variant: 'destructive',
        })
      },
    })

  const useDeleteEvent = () =>
    useMutation({
      mutationFn: deleteEvent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['events'] })
        queryClient.invalidateQueries({ queryKey: ['userEvents'] })
      },
      onError: (error: Error) => {
        toast({
          title: 'Erro ao deletar evento',
          description: error.message || 'Tente novamente mais tarde',
          variant: 'destructive',
        })
      },
    })

  const useUpdateEventStatus = () =>
    useMutation({
      mutationFn: updateEventStatus,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['event', data.uid] })
        queryClient.invalidateQueries({ queryKey: ['events'] })
        queryClient.invalidateQueries({ queryKey: ['userEvents'] })
        toast({
          title: 'Sucesso!',
          description: 'Status do evento atualizado com sucesso',
        })
      },
      onError: (error: Error) => {
        toast({
          title: 'Erro ao atualizar status do evento',
          description: error.message || 'Tente novamente mais tarde',
          variant: 'destructive',
        })
      },
    })

  return {
    useCreateEvent,
    useGetEventById,
    useListEvents,
    useGetUserEvents,
    useUpdateEvent,
    useDeleteEvent,
    useUpdateEventStatus,
    participarEvento,
    validarPresenca,
    getCertificado,
  }
}
