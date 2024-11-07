import mongoose from 'mongoose'

const vitrineSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['startup', 'competencia', 'laboratorio'],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  logo: {
    data: Buffer,
    contentType: String,
  },
  category: String,
  detailedDescription: String,
  email: { type: String, required: true },
  portfolioLink: String,
  campus: String,
  involvedCourses: [String],
  responsibleUser: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Vitrine || mongoose.model('Vitrine', vitrineSchema)