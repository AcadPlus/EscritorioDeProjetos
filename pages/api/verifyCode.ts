import { NextApiRequest, NextApiResponse } from 'next'
import checkCodeInDatabase from '@/hooks/checkCodeInDatabase'
import User from '@/pages/database/models/Users'
import dbConnect from '../database/connection/dbConnect'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { email, code } = req.body

    const isValid = await checkCodeInDatabase(email, code)
    if (isValid) {
      await dbConnect()
      const user = await User.findOne({ email })
      if (user) {
        user.verified = true
        await user.save()
      }
      return res.status(200).json({ message: 'Código verificado com sucesso!' })
    } else {
      return res.status(400).json({ message: 'Código inválido ou expirado.' })
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' })
  }
}
