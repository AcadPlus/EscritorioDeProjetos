import { useState } from 'react'

const useUpdateUser = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateUser = async (uid: string, userData: Partial<IUser>) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/users/${uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar usuário')
      }

      const updatedUser = await response.json()
      return updatedUser // Retorna os dados do usuário atualizado
    } catch (err) {
      setError(err.message)
      return null // Atualização falhou
    } finally {
      setLoading(false)
    }
  }

  return { updateUser, loading, error }
}

export default useUpdateUser
