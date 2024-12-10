import { NextApiRequest, NextApiResponse } from 'next'
import saveCodeToDatabase from '@/hooks/saveCodeToDatabase'
import User from '@/database/models/Users'
import dbConnect from '../../database/connection/dbConnect'
import { sendVerificationEmail, generateCode } from '@/utils/email'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { email } = req.body
    if (!email) {
      return res
        .status(400)
        .json({ message: 'O campo de e-mail é obrigatório' })
    }
    await dbConnect()

    const existingUser = await User.findOne({ email })
    if (existingUser && existingUser.verified) {
      return res.status(409).json({ message: 'Este email já está em uso' })
    }

    const code = generateCode()

    try {
      const saveResult = await saveCodeToDatabase(email, code)
      if (!saveResult) {
        return res
          .status(500)
          .json({ message: 'Erro ao salvar o código no banco de dados' })
      }

      await sendVerificationEmail(email, code)
      return res.status(200).json({ message: 'Código enviado!' })
    } catch (error) {
      console.error('Erro ao enviar código:', error)
      return res.status(500).json({
        message: 'Erro ao enviar e-mail ou salvar no banco de dados',
        error,
      })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ message: 'Método não permitido' })
  }
}
