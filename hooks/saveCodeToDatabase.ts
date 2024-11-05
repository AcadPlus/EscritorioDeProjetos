const saveCodeToDatabase = async (email: string, verificationCode: string) => {
  try {
    const response = await fetch(
      `http:localhost:3000/api/processes/databaseVerificationCode`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro ao salvar o código no banco de dados: ${errorText}`)
    }

    const result = await response.json()
    console.log('Código salvo com sucesso:', result)
    return result
  } catch (error) {
    console.error('Erro ao salvar o código:', error)
    return null
  }
}

export default saveCodeToDatabase
