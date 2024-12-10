/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/pages/database/connection/dbConnect'
import Startup from '@/pages/database/models/Startup'
import multer from 'multer'
import { Readable } from 'stream'
import { NextApiRequestWithFiles } from '.'

const ITEMS_PER_PAGE = 9

const upload = multer()

const getModelByType = (type: string) => {
  switch (type) {
    case 'startup':
      return Startup
    default:
      throw new Error('Tipo de vitrine inválido')
  }
}

const bufferToStream = (buffer: Buffer): Readable => {
  const readable = new Readable()
  readable._read = () => {}
  readable.push(buffer)
  readable.push(null)
  return readable
}

export const config = {
  api: {
    bodyParser: false,
  },
}

async function getRawBody(req: NextApiRequest): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect()

  const { type } = req.query
  const Model = getModelByType(type as string)

  switch (req.method) {
    case 'GET':
      try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || ITEMS_PER_PAGE
        const search = (req.query.search as string) || ''
        const sort = (req.query.sort as string) || 'createdAt'
        const status = (req.query.status as string) || 'approved'
        const query = search
          ? { title: { $regex: search, $options: 'i' }, status }
          : { status }
        const skip = (page - 1) * limit

        const itemsTempo = await Model.find(query)
          .sort({ [sort]: 1 })
          .skip(skip)
          .limit(limit)
          .exec()

        const items = itemsTempo.map((item) => ({
          ...item._doc,
          logo: {
            data: item.logo?.data?.toString('base64'),
            contentType: item.logo?.contentType,
          },
        }))

        const totalItems = await Model.countDocuments(query)
        const hasMore = skip + items.length < totalItems

        res.status(200).json({ items, hasMore })
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
        res
          .status(500)
          .json({ error: 'Erro ao buscar dados. Tente novamente mais tarde.' })
      }
      break

    case 'POST':
      upload.fields([{ name: 'logo' }])(
        req as unknown as never,
        res as unknown as never,
        async (err) => {
          if (err) {
            console.error('File upload error:', err)
            return res.status(400).json({ error: 'File upload error' })
          }

          try {
            const { files, body } = req as unknown as NextApiRequestWithFiles
            const newItem = new Model({
              ...body,
              tags: JSON.parse(body.tags || '[]'),
              responsibleUser: body.responsibleUser,
              foundationYear: body.foundationYear,
              sector: body.sector,
              location: body.location,
              email: body.email,
              website: body.website || null,
              logo:
                files.logo && files.logo[0]
                  ? {
                      data: files.logo[0].buffer,
                      contentType: files.logo[0].mimetype,
                    }
                  : null,
              problem: body.problem,
              solution: body.solution,
              strategicArea: body.strategicArea,
              potentialImpact: body.potentialImpact,
              status: 'pending', // Set initial status to pending
            })

            await newItem.save()
            return res
              .status(201)
              .json({ message: 'Item successfully created', newItem })
          } catch (error) {
            console.error('Error creating item:', error)
            return res.status(500).json({ error: 'Error creating item' })
          }
        },
      )
      break

    case 'PUT':
      if (!req.body) {
        req.body = JSON.parse(await getRawBody(req))
      }
      const { id, action, responsibleUser, ...updateData } = req.body
      try {
        const item = await Model.findById(id)
        if (!item) return res.status(404).json({ error: 'Item not found' })

        if (action === 'approve' || action === 'reject') {
          if (action === 'approve') {
            item.status = 'approved'
            await item.save()
          } else {
            item.status = 'rejected'
            await item.save()
          }
          return res
            .status(200)
            .json({ message: `Item ${action}d successfully` })
        } else {
          if (item.responsibleUser !== responsibleUser) {
            return res
              .status(403)
              .json({ error: 'Permission denied to edit this item' })
          }

          const updatedItem = await Model.findByIdAndUpdate(id, updateData, {
            new: true,
          })
          return res
            .status(200)
            .json({ message: 'Item successfully updated', updatedItem })
        }
      } catch (error) {
        console.error('Error updating item:', error)
        return res.status(500).json({ error: 'Error updating item' })
      }
      break

    case 'DELETE':
      const { id: deleteId, creatorId: deleteCreatorId } = req.query

      try {
        const item = await Model.findById(deleteId)
        if (!item) return res.status(404).json({ error: 'Item not found' })

        if (item.responsibleUser !== deleteCreatorId) {
          return res
            .status(403)
            .json({ error: 'Permission denied to delete this item' })
        }

        await Model.findByIdAndDelete(deleteId)
        return res.status(204).json({ message: 'Item successfully deleted' })
      } catch (error) {
        console.error('Error deleting item:', error)
        return res.status(500).json({ error: 'Error deleting item' })
      }
      break

    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}
