import mongoose from 'mongoose'

const laboratorioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true }, // Índice para busca eficiente
    description: { type: String, required: true },
    tags: [{ type: String, index: true }], // Índice em tags
    logo: {
      data: Buffer,
      contentType: String,
    },
    category: {
      type: String,
      enum: ['Research', 'Innovation', 'Development', 'Collaboration'], // Exemplos de categorias
    },
    detailedDescription: String,
    email: { type: String, required: true, match: /.+@.+\..+/ }, // Validação de e-mail
    campus: String,
    involvedCourses: [{ type: String }], // Cursos envolvidos no laboratório
    responsibleUser: { type: String, required: true }, // Quem gerencia o laboratório
    equipment: [String], // Equipamentos disponíveis no laboratório
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Criação automática de createdAt e updatedAt
  },
)

// Middleware para atualizar automaticamente updatedAt
laboratorioSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Laboratorio ||
  mongoose.model('Laboratorio', laboratorioSchema)
