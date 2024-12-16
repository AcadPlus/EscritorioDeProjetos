const getProfileUserData = async (uid: string) => {
  try {
    const response = await fetch(`/api/users/${uid}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return null
  }
}

export default getProfileUserData
