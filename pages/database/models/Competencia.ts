import mongoose from 'mongoose'

const competenciaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true }, // Índice para melhorar a busca por título
    description: { type: String, required: true },
    tags: [{ type: String, index: true }], // Índice em tags
    logo: {
      data: Buffer,
      contentType: String,
    },
    category: {
      type: String,
      enum: ['Pesquisa', 'Consultoria', 'Lecionamento', 'Mentoria', 'Inovação'], // Exemplos de categorias
    },
    detailedDescription: String,
    email: { type: String, required: true, match: /.+\@.+\..+/ }, // Validação de e-mail
    campus: String,
    involvedCourses: [{ type: String }], // Cursos envolvidos, caso haja múltiplos
    expertiseArea: String, // Nova área de conhecimento
    responsibleUser: { type: String, required: true }, // Quem cadastrou a competência
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Adiciona automaticamente createdAt e updatedAt
  },
)

// Middleware para atualizar automaticamente updatedAt
competenciaSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.models.Competencia ||
  mongoose.model('Competencia', competenciaSchema)
