import dbConnect from '@/database/connection/dbConnect'
import Properties from '@/database/models/Properties'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const properties = await Properties.findOne({})
      const campusOptions = properties ? properties.campus : []

      return res.status(200).json({ campusOptions })
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .json({ message: 'Erro ao buscar opções de filtros', error })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Método ${req.method} não permitido`)
  }
}
