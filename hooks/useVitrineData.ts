import { useState, useEffect } from 'react'
import axios from 'axios'
import { JwtPayload } from 'jsonwebtoken'
import { VitrineItem, VitrineType, SortType } from '@/types/vitrine-items'

export interface DecodedToken extends JwtPayload {
  uid: string
}

export interface UserDisplayName {
  uid: string
  displayName: string
}

export interface VitrineDataResponse {
  data: VitrineItem[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
}

export function useVitrineData(
  type: VitrineType,
  page: number,
  searchQuery: string,
  sortBy: SortType,
): VitrineDataResponse {
  const [data, setData] = useState<VitrineItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await axios.get<{ items: VitrineItem[] }>(
          `/api/vitrines/${type}`,
          {
            params: {
              page,
              limit: 9, // ITEMS_PER_PAGE
              search: searchQuery,
              sort: sortBy,
            },
          },
        )
        const newData: VitrineItem[] = response.data.items
        setData((prevData) =>
          page === 1 ? newData : [...prevData, ...newData],
        )
        setHasMore(newData.length === 9) // Check if there are more items to load
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
