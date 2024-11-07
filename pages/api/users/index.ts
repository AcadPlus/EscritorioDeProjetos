import dbConnect from '@/pages/database/connection/dbConnect'
import User from '@/pages/database/models/Users'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const users = await User.find({})
      if (!users) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }
      return res.status(200).json(users)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao buscar usuário', error })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Método ${req.method} não permitido`)
  }
}
