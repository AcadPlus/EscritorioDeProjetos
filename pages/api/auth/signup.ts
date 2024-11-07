import dbConnect from '@/pages/database/connection/dbConnect'
import User from '@/pages/database/models/Users'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

interface SignupRequestBody {
  name: string
  email: string
  password: string
  userType: string
  role?: string
  campus?: string
  ufcId?: string
  company?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect() // Connect to MongoDB

  if (req.method === 'POST') {
    let {
      name,
      email,
      password,
      userType,
      role,
      campus,
      ufcId,
      company,
    }: SignupRequestBody = req.body

    if (userType === 'ufc') userType = 'interno'

    // Input validation (simple example)
    if (!name || !email || !password || !userType) {
      return res
        .status(400)
        .json({ message: 'Por favor, preencha todos os campos obrigatórios.' })
    }

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(409).json({ message: 'Este email já está em uso' })
      }

      // Validate UFC email
      if (
        userType === 'ufc' &&
        !email.endsWith('@ufc.br') &&
        !email.endsWith('@alu.ufc.br')
      ) {
        return res
          .status(400)
          .json({ message: 'Email inválido para usuário UFC' })
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Create a new user
      const newUser = new User({
        uid: userType === 'ufc' ? ufcId : company || `user_${Date.now()}`,
        email,
        displayName: name,
        photoURL: '',
        role: userType,
        campus,
        course: '',
        createdAt: new Date(),
        lastLogin: new Date(),
        connections: [],
        favorites: [],
        password: hashedPassword,
      })

      await newUser.save()

      // Generate a JWT token
      const token = jwt.sign(
        { uid: newUser._id, email: newUser.email },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' },
      )

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
          _id: newUser._id,
          name: newUser.displayName,
          email: newUser.email,
          userType: newUser.role,
          role: newUser.role,
          campus: newUser.campus,
        },
        token,
      })
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      return res.status(500).json({ message: 'Erro ao criar usuário' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Método ${req.method} não permitido`)
  }
}
