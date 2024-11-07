import { useEffect, useState } from 'react'

const useCoursesOptions = () => {
  const [coursesOptions, setCoursesOptions] = useState<string[]>([])

  const fetchCoursesOptions = async () => {
    try {
      const response = await fetch('/api/properties/coursesOptions')
      const data = await response.json()
      setCoursesOptions(data.campusOptions)
    } catch (error) {
      console.error('Erro ao buscar opções de cursos:', error)
    }
  }

  useEffect(() => {
    fetchCoursesOptions()
  }, [])

  return coursesOptions
}

export default useCoursesOptions
