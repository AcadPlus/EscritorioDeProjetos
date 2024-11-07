import { useState, useEffect } from 'react'
import axios from 'axios'

// Defina a tipagem dos dados da vitrine conforme necessário
interface VitrineItem {
  title: string
  description: string
  tags: string[]
  logo: {
    data: string
    contentType: string
  }
  category: string
  detailedDescription: string
  email: string
  portfolioLink?: string
  responsibleUser: string
  createdAt: string
  updatedAt: string
}

export function useVitrineData(
  type: 'startup' | 'competencia' | 'laboratorio',
  page: number,
  searchQuery: string,
  sortBy: string,
) {
  const [data, setData] = useState<VitrineItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await axios.get(`/api/vitrines/${type}`, {
          params: {
            page,
            limit: 9, // ITEMS_PER_PAGE
            search: searchQuery,
            sort: sortBy,
          },
        })
        const newData: VitrineItem[] = response.data.items
        setData((prevData) =>
          page === 1 ? newData : [...prevData, ...newData],
        )
        setHasMore(newData.length === 9) // Confere se há mais itens para carregamento
      } catch (error) {
        setError(
          'Não foi possível carregar os itens. Por favor, tente novamente mais tarde.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [type, page, searchQuery, sortBy])

  return { data, isLoading, error, hasMore }
}
