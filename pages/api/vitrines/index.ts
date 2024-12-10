/* eslint-disable @typescript-eslint/no-unused-vars */
import dbConnect from '@/database/connection/dbConnect'
import Startup from '@/database/models/Startup'
import multer from 'multer'
import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'

// Extend NextApiRequest to be compatible with Multer
export interface NextApiRequestWithFiles extends NextApiRequest {
  files: {
    [fieldname: string]: Express.Multer.File[]
  }
}

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

async function getRawBody(req: NextApiRequest): Promise<string> {
  const chunks: Buffer[] = []
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
        const { status } = req.query
        let startups
        if (status === 'pending') {
          startups = await Startup.find({ status: 'pending' })
        } else {
          startups = await Startup.find({ status: 'approved' })
        }
        // Convert binary data to base64 for JSON compatibility
        const startupsWithBase64Logos = startups.map((startup) => ({
          ...startup.toObject(),
          logo: {
            data: startup.logo?.data?.toString('base64'),
            contentType: startup.logo?.contentType,
          },
        }))
        return res.status(200).json({ startups: startupsWithBase64Logos })
      } catch (error) {
        console.error('Error fetching startups:', error)
        return res.status(500).json({ error: 'Error fetching startups' })
      }

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
            const { files, body } = req as NextApiRequestWithFiles
            const newItem = new Startup({
              title: body.title,
              description: body.description,
              foundationYear: body.foundationYear,
              sector: body.sector,
              location: body.location,
              website: body.website || null,
              logo:
                files.logo && files.logo[0]
                  ? {
                      data: files.logo[0].buffer,
                      contentType: files.logo[0].mimetype,
                    }
                  : null,
              email: body.email,
              responsibleUser: body.responsibleUser,
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

    case 'PUT': {
      if (!req.body) {
        req.body = JSON.parse(await getRawBody(req))
      }
      const { id, action, responsibleUser, ...updateData } = req.body
      try {
        const item = await Startup.findById(id)
        if (!item) return res.status(404).json({ error: 'Item not found' })

        if (action === 'approve' || action === 'reject') {
          // Handle approval/rejection
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
          // Handle regular update
          if (item.responsibleUser !== responsibleUser) {
            return res
              .status(403)
              .json({ error: 'Permission denied to edit this item' })
          }

          const updatedItem = await Startup.findByIdAndUpdate(id, updateData, {
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
    }

    case 'DELETE': {
      const { id: deleteId, creatorId: deleteCreatorId } = req.query

      try {
        const item = await Startup.findById(deleteId)
        if (!item) return res.status(404).json({ error: 'Item not found' })

        if (item.responsibleUser !== deleteCreatorId) {
          return res
            .status(403)
            .json({ error: 'Permission denied to delete this item' })
        }

        await Startup.findByIdAndDelete(deleteId)
        return res.status(204).json({ message: 'Item successfully deleted' })
      } catch (error) {
        console.error('Error deleting item:', error)
        return res.status(500).json({ error: 'Error deleting item' })
      }
    }

    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}
