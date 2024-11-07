import { NextApiRequest, NextApiResponse } from 'next'
import checkCodeInDatabase from '@/hooks/checkCodeInDatabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { email, code } = req.body

    const isValid = await checkCodeInDatabase(email, code)
    if (isValid) {
      res.status(200).json({ message: 'Código verificado com sucesso!' })
    } else {
      res.status(400).json({ message: 'Código inválido ou expirado.' })
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' })
  }
}
