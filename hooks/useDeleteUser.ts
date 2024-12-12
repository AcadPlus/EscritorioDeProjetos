import { useState } from 'react'

const useDeleteUser = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteUser = async (uid: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/users/${uid}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar usuário')
      }

      return true // User deleted successfully
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Erro desconhecido') // Handle non-Error objects
      }
      return false // Deletion failed
    } finally {
      setLoading(false)
    }
  }

  return { deleteUser, loading, error }
}

export default useDeleteUser
