import dbConnect from '@/pages/database/connection/dbConnect'
import User from '@/pages/database/models/Users'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect()

  const uid = String(req.query.uid)

  if (req.method === 'GET') {
    try {
      const user = await User.findOne({ uid })
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }
      return res.status(200).json(user)
    } catch (error) {
      console.error('Error fetching user:', error)
      return res.status(500).json({ message: 'Erro ao buscar usuário' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { displayName, role, campus, course } = req.body
      const user = await User.findOneAndUpdate(
        { uid },
        { displayName, role, campus, course },
        { new: true },
      )
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }
      return res.status(200).json(user)
    } catch (error) {
      console.error('Error updating user:', error)
      return res.status(500).json({ message: 'Erro ao atualizar usuário' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const user = await User.findOneAndDelete({ uid })
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }
      return res.status(204).end() // No Content
    } catch (error) {
      console.error('Error deleting user:', error)
      return res.status(500).json({ message: 'Erro ao deletar usuário' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Método ${req.method} não permitido`)
  }
}
