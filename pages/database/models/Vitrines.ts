// models/Vitrine.js
import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
    default: new mongoose.Types.ObjectId(),
  },
  type: {
    type: String,
    enum: ['startup', 'competencia', 'laboratorio'], // Tipo de item
    required: true,
  },
  title: String,
  description: String,
  tags: [String],
  logo: {
    data: Buffer, // Armazenar o conteúdo da imagem
    contentType: String, // Tipo do conteúdo, como 'image/png' ou 'image/jpeg'
  },
  category: String,
  detailedDescription: String,
  email: String,
  portfolioLink: String,
  campus: String,
  involvedCourses: [String],
  responsibleUser: String,
  createdAt: { type: Date, default: Date.now(), required: false },
  updatedAt: { type: Date, default: Date.now() },
})

delete mongoose.models.Vitrine
export default mongoose.models.Vitrine || mongoose.model('Vitrine', itemSchema)
