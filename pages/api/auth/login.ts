import dbConnect from '@/pages/database/connection/dbConnect'
import User from '@/pages/database/models/Users'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect() // Connect to MongoDB

  if (req.method === 'POST') {
    const { email, password } = req.body

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' })
    }

    try {
      // Check if the user exists
      const user = await User.findOne({ email }).select('+password')
      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' })
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(403).json({ message: 'Senha incorreta' })
      }

      // Generate a JWT token
      const token = jwt.sign(
        { uid: user.uid, email: user.email },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' },
      )

      return res.status(200).json({
        message: 'Login bem-sucedido',
        user: {
          _id: user._id,
          name: user.displayName,
          email: user.email,
          userType: user.role,
          campus: user.campus,
        },
        token,
      })
    } catch (error) {
      console.error('Erro ao realizar login:', error) // Use console.error for logging errors
      return res.status(500).json({ message: 'Erro ao realizar login' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Método ${req.method} não permitido`)
  }
}
