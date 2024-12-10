import mongoose, { Document, Schema, model } from 'mongoose'

export interface ISolicitacoes extends Document {
  requester: string
  recipient: string
  status: string
  createdAt: Date
}

const solicitacoesSchema = new Schema<ISolicitacoes>({
  requester: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Solicitacoes ||
  model<ISolicitacoes>('Solicitacoes', solicitacoesSchema)
