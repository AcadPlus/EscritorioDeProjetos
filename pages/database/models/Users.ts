import mongoose, { Schema, Document } from 'mongoose'

interface IUser extends Document {
  uid: string
  email: string
  displayName: string
  role: string
  campus: string
  password: string
  emailDomain: string
  siape?: string
  matricula?: string
  verified: boolean
  verificationCode: string
  privileges: string
}

const userSchema = new Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    role: { type: String, required: true },
    campus: { type: String, required: true },
    password: { type: String, required: true },
    emailDomain: { type: String, required: true },
    siape: { type: String },
    matricula: { type: String },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, required: true },
    privileges: {
      type: String,
      required: true,
      enum: ['standard', 'admin', 'developer'],
      default: 'standard',
    },
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema)
