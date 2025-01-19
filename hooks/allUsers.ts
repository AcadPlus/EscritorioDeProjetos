import { useState, useEffect } from 'react'
import { UserBaseCreate } from '@/lib/types/userTypes'
import { useUserApi } from '@/lib/api/users'

export function useAllUsers(): {
  users: UserBaseCreate[]
  isLoading: boolean
  error: Error | null
} {
  const [users, setUsers] = useState<UserBaseCreate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { fetchUsers } = useUserApi()

  useEffect(() => {
    async function loadUsers() {
      try {
        const fetchedUsers = await fetchUsers()
        console.log(fetchedUsers)
        setUsers(fetchedUsers)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  return { users, isLoading, error }
}
