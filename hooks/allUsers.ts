import { useEffect, useState } from 'react'

const allUsers = () => {
  const [users, setUsers] = useState<string[]>([])

  const fetchAllUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    }
  }

  useEffect(() => {
    fetchAllUsers()
  }, [])

  return users
}

export default allUsers
