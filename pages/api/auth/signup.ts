import dbConnect from '@/pages/database/connection/dbConnect'
import User from '@/pages/database/models/Users'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { sendVerificationEmail, generateCode } from '@/utils/email'

interface SignupRequestBody {
  name: string
  email: string
  password: string
  emailDomain: string
  role: string
  campus: string
  siape?: string
  matricula?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect()

  if (req.method === 'POST') {
    const {
      name,
      email,
      password,
      emailDomain,
      role,
      campus,
      siape,
      matricula,
    }: SignupRequestBody = req.body

    // Validação de campos obrigatórios
    if (!name || !email || !password || !emailDomain || !role || !campus) {
      const missingFields = []
      if (!name) missingFields.push('name')
      if (!email) missingFields.push('email')
      if (!password) missingFields.push('password')
      if (!emailDomain) missingFields.push('emailDomain')
      if (!role) missingFields.push('role')
      if (!campus) missingFields.push('campus')

      return res.status(400).json({
        message: `Por favor, preencha os seguintes campos: ${missingFields.join(', ')}`,
      })
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email + emailDomain)) {
      return res.status(412).json({ message: 'Email inválido' })
    }

    try {
      // Verifica se o usuário já existe
      const existingUser = await User.findOne({ email: email + emailDomain })

      if (existingUser) {
        if (existingUser.verified) {
          return res.status(409).json({ message: 'Este email já está em uso' })
        } else {
          // Usuário existe mas não está verificado, permitir reenvio de código
          await sendVerificationEmail(
            existingUser.email,
            existingUser.verificationCode,
          )
          return res
            .status(200)
            .json({ message: 'Código de verificação reenviado.' })
        }
      }

      // Criptografa a senha
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Gera o código de verificação
      const verificationCode = generateCode()

      // Cria o novo usuário
      const newUser = new User({
        uid: `user_${Date.now()}`,
        email: email + emailDomain,
        displayName: name,
        role,
        campus,
        password: hashedPassword,
        emailDomain,
        siape: emailDomain === '@ufc.br' ? siape : undefined,
        matricula: emailDomain === '@alu.ufc.br' ? matricula : undefined,
        verified: false, // Marca o usuário como não verificado
        verificationCode, // Salva o código de verificação no banco de dados
        privilege: 'standard',
      })

      await newUser.save()

      // Envia o código de verificação
      await sendVerificationEmail(newUser.email, verificationCode)

      // Gera o token JWT para autenticação
      const token = jwt.sign(
        {
          uid: newUser._id,
          email: newUser.email,
          privilege: newUser.privilege,
        },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' },
      )

      return res.status(200).json({
        message:
          'Usuário criado com sucesso. Verifique seu email para confirmar.',
        user: {
          _id: newUser._id,
          name: newUser.displayName,
          email: newUser.email,
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
    return res.status(405).end(`Método ${req.method} não permitido`)
  }
}
