import dbConnect from '@/pages/database/connection/dbConnect'
import { NextApiRequest, NextApiResponse } from 'next'
import Processes from '@/pages/database/models/Processes'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const { email } = req.query
      if (!email) {
        return res.status(400).json({ message: 'Email é obrigatório' })
      }

      const process = await Processes.findOne({ email })
      if (!process) {
        return res.status(404).json({ message: 'Processo não encontrado' })
      }
      const { verificationCode } = process

      return res.status(200).json({ verificationCode, email })
    } catch (error) {
      console.error('Erro ao buscar processo:', error)
      return res.status(500).json({ message: 'Erro ao buscar processo', error })
    }
  } else if (req.method === 'POST') {
    try {
      const { email, verificationCode } = req.body

      if (!email || !verificationCode) {
        return res
          .status(400)
          .json({ message: 'Email e código são obrigatórios' })
      }

      const existingProcess = await Processes.findOne({ email })
      if (existingProcess) {
        existingProcess.verificationCode = verificationCode
        await existingProcess.save()
        return res
          .status(200)
          .json({ message: 'Código atualizado com sucesso' })
      }

      const newProcess = new Processes({ email, verificationCode })
      await newProcess.save()

      return res.status(201).json({ message: 'Código salvo com sucesso' })
    } catch (error) {
      console.error('Erro ao salvar o código:', error)
      return res
        .status(500)
        .json({ message: 'Erro ao salvar o código no banco de dados', error })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Método ${req.method} não permitido`)
  }
}
