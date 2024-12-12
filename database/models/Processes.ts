import mongoose from 'mongoose'

const processSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    verificationCode: { type: String, required: true, unique: true },
  },
  { timestamps: true },
)

delete mongoose.models.Processes
export default mongoose.models.Processes ||
  mongoose.model('Processes', processSchema)
