import dbConnect from '../../database/connection/dbConnect'
import Solicitacao from '../../database/models/Solicitacao'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect()

  if (req.method === 'GET') {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' })
    }

    try {
      const solicitacoes = await Solicitacao.find({
        $or: [{ requester: userId }, { recipient: userId }],
      })
        .populate('requester', 'displayName')
        .populate('recipient', 'displayName')

      return res.status(200).json({ solicitacoes })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar solicitações' })
    }
  } else if (req.method === 'POST') {
    const { requester, recipient } = req.body
    if (!requester || !recipient) {
      return res
        .status(400)
        .json({ error: 'Requester e recipient são obrigatórios' })
    }
    try {
      const novaSolicitacao = new Solicitacao({ requester, recipient })
      await novaSolicitacao.save()
      return res.status(201).json({ solicitacao: novaSolicitacao })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar solicitação' })
    }
  } else if (req.method === 'PATCH') {
    const { requester, recipient, action } = req.body
    let receiver = false
    if (req.body.receiver) {
      receiver = true
    }
    if (!requester || !recipient || !['accept', 'reject'].includes(action)) {
      return res
        .status(400)
        .json({ error: 'ID e ação válida são obrigatórios' })
    }
    try {
      const status = action === 'accept' ? 'accepted' : 'rejected'
      let updatedSolicitacao
      if (receiver) {
        updatedSolicitacao = await Solicitacao.findOneAndUpdate(
          { requester: recipient, recipient: requester },
          { status },
          { new: true },
        )
      } else {
        updatedSolicitacao = await Solicitacao.findOneAndUpdate(
          { requester, recipient },
          { status },
          { new: true },
        )
      }

      if (!updatedSolicitacao) {
        return res.status(404).json({ error: 'Solicitação não encontrada' })
      }

      return res.status(200).json({ message: `Solicitação ${status}` })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar solicitação' })
    }
  } else if (req.method === 'DELETE') {
    const { requesterId, recipientId } = req.body
    if (!requesterId || !recipientId) {
      return res
        .status(400)
        .json({ error: 'Requester e recipient são obrigatórios' })
    }
    try {
      const deletedSolicitacao = await Solicitacao.findOneAndDelete({
        requester: requesterId,
        recipient: recipientId,
      })

      const deletedSolicitacaoSecond = await Solicitacao.findOneAndDelete({
        requester: recipientId,
        recipient: requesterId,
      })

      if (!deletedSolicitacao && !deletedSolicitacaoSecond) {
        return res.status(404).json({ error: 'Solicitação não encontrada' })
      }

      return res
        .status(200)
        .json({ message: 'Solicitação removida com sucesso' })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover solicitação' })
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' })
  }
}
