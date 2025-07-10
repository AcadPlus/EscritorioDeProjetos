import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  uid: string
  email: string
  nome: string
  foto_url?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: Error | null
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthContextType>({
    user: null,
    loading: true,
    error: null,
  })
  const router = useRouter()

  useEffect(() => {
    // Verificar se há um usuário no localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setAuth({ user, loading: false, error: null })
      } catch (error) {
        setAuth({ user: null, loading: false, error: error as Error })
      }
    } else {
      setAuth({ user: null, loading: false, error: null })
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setAuth((prev) => ({ ...prev, loading: true }))

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Falha na autenticação')
      }

      const user = await response.json()
      localStorage.setItem('user', JSON.stringify(user))
      setAuth({ user, loading: false, error: null })
      router.push('/linka/dashboard')
    } catch (error) {
      setAuth({ user: null, loading: false, error: error as Error })
    }
  }

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return {
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    login,
    logout,
    isAuthenticated: !!auth.user,
  }
}
