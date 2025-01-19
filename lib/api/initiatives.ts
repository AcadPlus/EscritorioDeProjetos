import {
  IniciativaCreateAndUpdate,
  IniciativaResponse,
  InitiativeStatus,
} from '@/lib/types/initiativeTypes'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

function getAccessToken(): string | null {
  return localStorage.getItem('accessToken')
}

export async function createInitiative(
  initiativeData: IniciativaCreateAndUpdate,
): Promise<IniciativaResponse> {
  const token = getAccessToken()

  try {
    const response = await fetch(`${API_BASE_URL}/initiatives/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(initiativeData),
    })

    if (!response.ok) {
      throw new Error('Failed to create initiative')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating initiative:', error)
    throw error
  }
}

export async function getInitiativeById(
  initiativeId: string,
): Promise<IniciativaResponse> {
  const token = getAccessToken()

  try {
    const response = await fetch(
      `${API_BASE_URL}/initiatives/${initiativeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch initiative')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching initiative:', error)
    throw error
  }
}

export async function listInitiatives(
  businessId?: string,
  status: InitiativeStatus = 'aprovado',
): Promise<IniciativaResponse[]> {
  const token = getAccessToken()

  try {
    const url = new URL(`${API_BASE_URL}/initiatives/`)
    if (businessId) url.searchParams.append('negocio_id', businessId)
    url.searchParams.append('status', status)

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch initiatives')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching initiatives:', error)
    throw error
  }
}

export async function updateInitiative(
  initiativeId: string,
  updateData: IniciativaCreateAndUpdate,
): Promise<IniciativaResponse> {
  const token = getAccessToken()

  try {
    const response = await fetch(
      `${API_BASE_URL}/initiatives/${initiativeId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      },
    )

    if (!response.ok) {
      throw new Error('Failed to update initiative')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating initiative:', error)
    throw error
  }
}

export async function deleteInitiative(initiativeId: string): Promise<void> {
  const token = getAccessToken()

  try {
    const response = await fetch(
      `${API_BASE_URL}/initiatives/${initiativeId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to delete initiative')
    }
  } catch (error) {
    console.error('Error deleting initiative:', error)
    throw error
  }
}

export async function approveInitiative(
  initiativeId: string,
): Promise<IniciativaResponse> {
  const token = getAccessToken()

  try {
    const response = await fetch(
      `${API_BASE_URL}/initiatives/${initiativeId}/approve`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to approve initiative')
    }

    return await response.json()
  } catch (error) {
    console.error('Error approving initiative:', error)
    throw error
  }
}

export async function rejectInitiative(
  initiativeId: string,
): Promise<IniciativaResponse> {
  const token = getAccessToken()

  try {
    const response = await fetch(
      `${API_BASE_URL}/initiatives/${initiativeId}/reject`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to reject initiative')
    }

    return await response.json()
  } catch (error) {
    console.error('Error rejecting initiative:', error)
    throw error
  }
}
