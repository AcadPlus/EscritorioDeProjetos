import { useEffect, useState } from 'react'

const useCampusOptions = () => {
  const [campusOptions, setCampusOptions] = useState<string[]>([])

  const fetchCampusOptions = async () => {
    try {
      const response = await fetch('/api/properties/campusOptions')
      const data = await response.json()
      setCampusOptions(data.campusOptions)
    } catch (error) {
      console.error('Erro ao buscar opções de campus:', error)
    }
  }

  useEffect(() => {
    fetchCampusOptions()
  }, [])

  return campusOptions
}

export default useCampusOptions
