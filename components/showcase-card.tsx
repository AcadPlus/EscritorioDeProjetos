import { Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ShowcaseItem {
  icon: string
  text: string
}

interface ShowcaseCardProps {
  title: string
  description: string
  items: ShowcaseItem[]
}

import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '600', '400', '500', '600', '700', '800', '900'],
})


export default function ShowcaseCard({
  title = 'Vitrine de Startups',
  description = 'Descubra startups inovadoras, parceiras da UFC, que estão moldando o futuro com soluções disruptivas e transformando ideias em realidade.',
  items = [
    {
      icon: '✓',
      text: 'Acesso a ideias inovadoras e tecnologias emergentes',
    },
    {
      icon: '✓',
      text: 'Oportunidades de networking com empreendedores visionários',
    },
    {
      icon: '✓',
      text: 'Parcerias estratégicas para desenvolvimento e crescimento',
    },
  ],
}: ShowcaseCardProps) {
  return (
    <Card
      className="p-4 max-w-md" // Adicionando uma largura máxima para o card
      style={{ backgroundColor: 'rgba(242, 249, 249, 0.35)' }}
    >
      <CardHeader className="space-y-4 pb-4"> {/* Reduzindo o espaço entre os elementos */}
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#DDEFF0]">
          <Mail className="h-6 w-6 text-[#325158]" />
        </div>
        <CardTitle
          style={{ fontWeight: 600, fontSize: '1.6rem', color: "#1A2C32" }} // Ajustando o tamanho da fonte
          className={inter.className}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 text-[#475467]"> {/* Reduzindo o espaço no conteúdo */}
        <p className={inter.className} style={{ maxWidth: 400 }}>
          {description}
        </p>
        <ul className="space-y-2"> {/* Reduzindo o espaço entre os itens da lista */}
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#DDEFF0]">
                <span className="text-[#325158]">{item.icon}</span>
              </div>
              <span style={{ maxWidth: 350 }} className={inter.className}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
  
}
