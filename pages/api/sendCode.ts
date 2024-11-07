import { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import saveCodeToDatabase from '@/hooks/saveCodeToDatabase'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const sendVerificationEmail = async (email: string, code: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Verificação de Conta" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Seu Código de Verificação',
    text: `Seu código de verificação é: ${code}`,
  })
}

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
