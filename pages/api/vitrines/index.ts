import dbConnect from '@/pages/database/connection/dbConnect'
import Vitrines from '@/pages/database/models/Vitrines'
import Startup from '@/pages/database/models/Startup'
import Competencia from '@/pages/database/models/Competencia'
import Laboratorio from '@/pages/database/models/Laboratorio'
import multer from 'multer'
import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'

const upload = multer()

// Utility function to convert buffer to stream
const bufferToStream = (buffer: Buffer): Readable => {
  const readable = new Readable()
  readable._read = () => {}
  readable.push(buffer)
  readable.push(null)
  return readable
}

// Config to disable default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
}

async function getRawBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString()
}

// API handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect()

  switch (req.method) {
    case 'GET':
      try {
        let vitrines = await Vitrines.find({})
        // Convert binary data to base64 for JSON compatibility
        vitrines = vitrines.map((item) => ({
          ...item._doc,
          logo: {
            data: item.logo?.data?.toString('base64'),
            contentType: item.logo?.contentType,
          },
        }))
        return res.status(200).json({ vitrines })
      } catch (error) {
        console.error('Error fetching vitrines:', error)
        return res.status(500).json({ error: 'Error fetching vitrines' })
      }

    case 'POST':
      upload.fields([{ name: 'logo' }, { name: 'image' }])(
        req,
        res,
        async (err) => {
          if (err) {
            console.error('File upload error:', err)
            return res.status(400).json({ error: 'File upload error' })
          }

          try {
            const { files, body } = req as any
            const newItem = new Vitrines({
              ...body,
              tags: JSON.parse(body.tags || '[]'),
              involvedCourses: JSON.parse(body.involvedCourses || '[]'),
              status: 'pending', // Add status field
            })

            if (files.logo && files.logo[0]) {
              newItem.logo = {
                data: files.logo[0].buffer,
                contentType: files.logo[0].mimetype,
              }
            }

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
      console.log(req.body)
      const { id, action, responsibleUser, ...updateData } = req.body
      try {
        const item = await Vitrines.findById(id)
        if (!item) return res.status(404).json({ error: 'Item not found' })

        if (action === 'approve' || action === 'reject') {
          // Handle approval/rejection
          if (action === 'approve') {
            item.status = 'approved'
            let newItem
            switch (item.type) {
              case 'startup':
                newItem = new Startup(item.toObject())
                break
              case 'competencia':
                newItem = new Competencia(item.toObject())
                break
              case 'laboratorio':
                newItem = new Laboratorio(item.toObject())
                break
            }
            await newItem.save()
            await Vitrines.findByIdAndDelete(id)
          } else {
            item.status = 'rejected'
            await item.save()
          }
          return res.status(200).json({ message: `Item ${action}d successfully` })
        } else {
          // Handle regular update
          if (item.responsibleUser !== responsibleUser) {
            return res
              .status(403)
              .json({ error: 'Permission denied to edit this item' })
          }

          const updatedItem = await Vitrines.findByIdAndUpdate(id, updateData, {
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
        const item = await Vitrines.findById(deleteId)
        if (!item) return res.status(404).json({ error: 'Item not found' })

        if (item.responsibleUser !== deleteCreatorId) {
          return res
            .status(403)
            .json({ error: 'Permission denied to delete this item' })
        }

        await Vitrines.findByIdAndDelete(deleteId)
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