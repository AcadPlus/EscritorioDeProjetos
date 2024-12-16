import mongoose from 'mongoose'

const startupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    foundationYear: { type: String, required: true },
    sector: { type: String, required: true },
    location: { type: String, required: true },
    website: String,
    logo: {
      data: Buffer,
      contentType: String,
    },
    email: { type: String, required: true },
    responsibleUser: { type: String, required: true },
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    strategicArea: { type: String, required: true },
    potentialImpact: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
)

startupSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Startup ||
  mongoose.model('Startup', startupSchema)
