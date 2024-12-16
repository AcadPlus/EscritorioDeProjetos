/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react'
import { IUser } from '@/types/network'

export default function allUsers(): IUser[] {
  const [users, setUsers] = useState<IUser[]>([])

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
