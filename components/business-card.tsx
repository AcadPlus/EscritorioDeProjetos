import { useState } from 'react'
import Image from 'next/image'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Facebook, Instagram, Linkedin, LinkIcon } from 'lucide-react'
import { NegocioResponse } from '@/lib/types/businessTypes'

// Define a new interface for the component's props
interface BusinessCardProps {
  business: NegocioResponse
}

export function BusinessCard({ business }: BusinessCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />
      case 'instagram':
        return <Instagram className="h-4 w-4" />
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />
      default:
        return <LinkIcon className="h-4 w-4" />
    }
  }

  const getBusinessTypeBadge = (type: NegocioResponse['tipo_negocio']) => {
    const bgColor = type === 'partec' ? 'bg-blue-500' : 'bg-green-500'
    return (
      <Badge className={`${bgColor} text-white absolute top-4 right-4 z-10`}>
        {type}
      </Badge>
    )
  }

  return (
    <>
      <Card className="w-full sm:w-[300px] overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="p-0 relative">
          {getBusinessTypeBadge(business.tipo_negocio)}
          <div className="bg-gray-100 h-[200px] relative flex items-center justify-center">
            {business.logo ? (
              <Image
                src={business.logo || '/placeholder.svg'}
                alt={`${business.nome} logo`}
                fill
                className="object-contain p-6"
              />
            ) : (
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-4xl bg-white">
                  {business.nome.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <CardTitle className="mb-4 text-xl line-clamp-1">
            {business.nome}
          </CardTitle>
          <p className="text-sm text-muted-foreground mb-6 line-clamp-3 min-h-[4.5rem]">
            {business.tipo_negocio === 'partec'
              ? business.descricao_problema
              : business.demanda}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="w-full"
          >
            Detalhes
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {business.nome}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            {getBusinessTypeBadge(business.tipo_negocio)}
            <div className="space-y-6 py-4">
              <div className="flex flex-wrap gap-2">
                {business.palavras_chave.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>

              <div className="grid gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Informações de Contato</h3>
                  <div className="grid gap-2 text-sm">
                    <p>
                      <strong>Email:</strong> {business.email}
                    </p>
                  </div>
                </div>

                {business.midias_sociais && (
                  <div>
                    <h3 className="font-semibold mb-2">Redes Sociais</h3>
                    <div className="flex gap-2">
                      {Object.entries(business.midias_sociais).map(
                        ([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                          >
                            {getSocialIcon(platform)}
                          </a>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {business.tipo_negocio === 'partec' ? (
                  <div className="grid gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Descrição do Problema</h3>
                      <p className="text-sm">{business.descricao_problema}</p>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <p>
                        <strong>Área Estratégica:</strong>{' '}
                        {business.area_estrategica}
                      </p>
                      <p>
                        <strong>Campus:</strong> {business.campus}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Sobre o Negócio</h3>
                      <p className="text-sm">{business.demanda}</p>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <p>
                        <strong>CNAE:</strong> {business.cnae}
                      </p>
                      <p>
                        <strong>Área de Atuação:</strong>{' '}
                        {business.area_de_atuacao}
                      </p>
                    </div>
                  </div>
                )}

                {business.id_iniciativas &&
                  business.id_iniciativas.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Iniciativas</h3>
                      <div className="grid gap-2">
                        {business.id_iniciativas.map((id) => (
                          <Badge key={id} variant="outline">
                            Iniciativa {id}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}

