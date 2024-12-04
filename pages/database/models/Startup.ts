import mongoose from 'mongoose'

const startupSchema = new mongoose.Schema({
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
  responsibleUser: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Startup ||
  mongoose.model('Startup', startupSchema)
