import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/pages/database/connection/dbConnect'
import Startup from '@/pages/database/models/Startup'
import Competencia from '@/pages/database/models/Competencia' // Defina este modelo de forma similar ao de Startup
import Laboratorio from '@/pages/database/models/Laboratorio' // Defina este modelo de forma similar ao de Startup

const ITEMS_PER_PAGE = 9

const getModelByType = (type: string) => {
  switch (type) {
    case 'startup':
      return Startup
    case 'competencia':
      return Competencia
    case 'laboratorio':
      return Laboratorio
    default:
      throw new Error('Tipo de vitrine inválido')
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect()

  const { type } = req.query
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || ITEMS_PER_PAGE
  const search = (req.query.search as string) || ''
  const sort = (req.query.sort as string) || 'createdAt'

  try {
    const Model = getModelByType(type as string)

    // Configurações de busca e paginação
    const query = search ? { title: { $regex: search, $options: 'i' } } : {}
    const skip = (page - 1) * limit

    // Consulta ao banco de dados
    const itemsTempo = await Model.find(query)
      .sort({ [sort]: 1 }) // Ordenação
      .skip(skip) // Paginação: pula os itens anteriores
      .limit(limit) // Limite de itens por página
      .exec()

    const items = itemsTempo.map((item) => ({
      ...item._doc,
      logo: {
        data: item.logo?.data?.toString('base64'),
        contentType: item.logo?.contentType,
      },
    }))

    const totalItems = await Model.countDocuments(query) // Total de itens para saber se há mais páginas
    const hasMore = skip + items.length < totalItems

    res.status(200).json({ items, hasMore })
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    res
      .status(500)
      .json({ error: 'Erro ao buscar dados. Tente novamente mais tarde.' })
  }
}
