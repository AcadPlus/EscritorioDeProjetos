const checkCodeInDatabase = async (emailUser: string, codeUser: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/processes/databaseVerificationCode?email=${emailUser}`,
    )
    const process = await response.json()
    const { verificationCode } = process

    if (verificationCode === codeUser) return true
    return false
  } catch (error) {
    console.error('Erro ao buscar código no banco de dados:', error)
    return false
  }
}

export default checkCodeInDatabase
