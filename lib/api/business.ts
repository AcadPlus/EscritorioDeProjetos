import { useApi } from '../hooks/useApi'
import {
  NegocioCreate,
  NegocioUpdate,
  NegocioResponse,
  BusinessStatus,
} from '../types/businessTypes'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export const useBusinessApi = () => {
  const { fetchWithToken, isLoading, error } = useApi()

  const createBusiness = async (
    businessData: NegocioCreate,
  ): Promise<NegocioResponse> => {
    try {
      const response = await fetchWithToken(`${API_BASE_URL}/business/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      })
      return await response.json()
    } catch (error) {
      console.error('Error creating business:', error)
      throw error
    }
  }

  const getBusinessById = async (
    businessId: string,
  ): Promise<NegocioResponse> => {
    try {
      const response = await fetchWithToken(
        `${API_BASE_URL}/business/${businessId}`,
        {
          requireAuth: false,
        },
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching business:', error)
      throw error
    }
  }

  const listBusinesses = async (
    status: BusinessStatus = 'aprovado',
  ): Promise<NegocioResponse[]> => {
    try {
      const response = await fetchWithToken(
        `${API_BASE_URL}/business/?status=${status}`,
        {
          requireAuth: false,
        },
      )
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching businesses:', error)
      throw error
    }
  }

  const updateBusiness = async (
    businessId: string,
    updateData: NegocioUpdate,
  ): Promise<NegocioResponse> => {
    try {
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
    } catch (error) {
      console.error('Error updating business:', error)
      throw error
    }
  }

  const deleteBusiness = async (businessId: string): Promise<void> => {
    try {
      await fetchWithToken(`${API_BASE_URL}/business/${businessId}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Error deleting business:', error)
      throw error
    }
  }

  const approveBusiness = async (
    businessId: string,
  ): Promise<NegocioResponse> => {
    try {
      const response = await fetchWithToken(
        `${API_BASE_URL}/business/${businessId}/approve`,
        {
          method: 'PUT',
        },
      )
      return await response.json()
    } catch (error) {
      console.error('Error approving business:', error)
      throw error
    }
  }

  const rejectBusiness = async (
    businessId: string,
  ): Promise<NegocioResponse> => {
    try {
      const response = await fetchWithToken(
        `${API_BASE_URL}/business/${businessId}/reject`,
        {
          method: 'PUT',
        },
      )
      return await response.json()
    } catch (error) {
      console.error('Error rejecting business:', error)
      throw error
    }
  }

  return {
    createBusiness,
    getBusinessById,
    listBusinesses,
    updateBusiness,
    deleteBusiness,
    approveBusiness,
    rejectBusiness,
    isLoading,
    error,
  }
}
