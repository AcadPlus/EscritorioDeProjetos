import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String },
    profilePicture: {
      data: Buffer,
      contentType: String,
    },
    role: { type: String, required: true },
    campus: { type: String },
    course: { type: String },
    createdAt: { type: Date, default: Date.now() },
    lastLogin: { type: Date },
    connections: { type: Object, default: {} },
    favorites: { type: Object, default: {} },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true },
)

delete mongoose.models.User
export default mongoose.models.User || mongoose.model('User', userSchema)
