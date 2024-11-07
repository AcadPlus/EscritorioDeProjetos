import { useState, useEffect } from 'react'
import axios from 'axios'
import jwt from 'jsonwebtoken'

interface Request {
  [userId: string]: [string, string, string] // [status, recipient, requester]
}

export function useRequests() {
  const [requests, setRequests] = useState<Request>({})
  const [decodedToken, setDecodedToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwt.decode(token) as { uid: string } | null
      setDecodedToken(decoded?.uid || null)
    }
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const decoded = jwt.decode(token) as { uid: string } | null
      const requesterId = decoded?.uid
      if (!requesterId) return

      const response = await axios.get(`/api/solicitacoes`, {
        params: { userId: requesterId },
        headers: { Authorization: `Bearer ${token}` },
      })

      const requestsData = Array.isArray(response.data.solicitacoes)
        ? response.data.solicitacoes.reduce((acc, req) => {
            const otherUserId =
              req.requester === requesterId ? req.recipient : req.requester
            acc[otherUserId] = [req.status, req.recipient, req.requester]
            return acc
          }, {} as Request)
        : {}

      setRequests(requestsData)
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestAction = async (action: 'send' | 'accept' | 'reject', recipientId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token || !decodedToken) return

      const method = action === 'send' ? axios.post : axios.patch
      const url = '/api/solicitacoes'

      await method(
        url,
        {
          requester: decodedToken,
          recipient: recipientId,
          action,
          receiver: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      console.log(`Solicitação ${action} com sucesso`)
      fetchRequests()
    } catch (error) {
      console.error(`Erro ao ${action} solicitação:`, error)
    }
  }

  const handleRemoveRequest = async (recipientId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token || !decodedToken) return

      await axios.delete(`/api/solicitacoes`, {
        data: { requesterId: decodedToken, recipientId },
        headers: { Authorization: `Bearer ${token}` },
      })

      setRequests((prev) => {
        const newRequests = { ...prev }
        delete newRequests[recipientId]
        return newRequests
      })
    } catch (error) {
      console.error('Erro ao remover solicitação:', error)
    }
  }

  return {
    requests,
    handleRequestAction,
    handleRemoveRequest,
    decodedToken,
    isLoading,
  }
}