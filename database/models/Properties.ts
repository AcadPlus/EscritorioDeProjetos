import mongoose, { Document, Schema } from 'mongoose'

interface ResearchCenter {
  name: string
  focusArea: string
  location: string
}

interface NotableProgram {
  programName: string
  level: string
  campus: string
}

export interface IProperties extends Document {
  campus: string[]
  courses: string[]
  researchCenters: ResearchCenter[]
  notablePrograms: NotableProgram[]
  tiposVitrines: string[]
}

const propertiesSchema = new Schema<IProperties>({
  campus: {
    type: [String],
    required: true,
  },
  courses: {
    type: [String],
    required: true,
  },
  researchCenters: [
    {
      name: { type: String, required: true },
      focusArea: { type: String, required: true },
      location: { type: String, required: true },
    },
  ],
  notablePrograms: [
    {
      programName: { type: String, required: true },
      level: { type: String, required: true },
      campus: { type: String, required: true },
    },
  ],
  tiposVitrines: {
    type: [String],
    required: false,
  },
})

export default mongoose.models.Properties ||
  mongoose.model<IProperties>('Properties', propertiesSchema)
