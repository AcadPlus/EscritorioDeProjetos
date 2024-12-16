import { z } from 'zod'
import { AbstractVitrineFactory } from './AbstractVitrineFactory'

export class StartupFactory implements AbstractVitrineFactory {
  createSchema() {
    return z.object({
      title: z.string().min(1, 'Título é obrigatório'),
      description: z.string().min(1, 'Descrição é obrigatória'),
      foundationYear: z.string().min(1, 'Data de fundação é obrigatória'),
      sector: z.string().min(1, 'Área de atuação é obrigatória'),
      location: z.string().min(1, 'Localização é obrigatória'),
      email: z.string().email('Email inválido'),
      logo: z.instanceof(File).nullable(),
      website: z.string().url('URL inválida').optional(),
      problem: z.string().min(1, 'Problema é obrigatório'),
      solution: z.string().min(1, 'Solução é obrigatória'),
      strategicArea: z.string().min(1, 'Área estratégica é obrigatória'),
      potentialImpact: z.string().min(1, 'Potencial de impacto é obrigatório'),
    })
  }

  createFields() {
    return [
      { name: 'title', label: 'Nome da Startup' },
      { name: 'description', label: 'Descrição' },
      { name: 'foundationYear', label: 'Data de Fundação' },
      { name: 'sector', label: 'Área de Atuação' },
      { name: 'location', label: 'Localização' },
      { name: 'email', label: 'Email' },
      { name: 'logo', label: 'Logo', type: 'file' },
      { name: 'website', label: 'Website', type: 'url' },
      { name: 'problem', label: 'Problema' },
      { name: 'solution', label: 'Solução' },
      { name: 'strategicArea', label: 'Área Estratégica' },
      { name: 'potentialImpact', label: 'Potencial de Impacto' },
    ]
  }

  getTitle() {
    return 'Criar Nova Startup'
  }

  getType() {
    return 'startup' as const
  }
}
