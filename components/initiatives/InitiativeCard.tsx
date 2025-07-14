import {
  IniciativaBase,
  StatusIniciativa,
  StatusVinculo,
  NivelMaturidade,
} from '@/lib/types/initiativeTypes'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  Users, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Heart,
  HeartIcon,
  Globe,
  DollarSign,
  Lightbulb,
  Target,
  Award,
  Building,
  Beaker,
  Briefcase,
  GraduationCap,
  Rocket,
  UserCheck
} from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface InitiativeCardProps {
  initiative: IniciativaBase
  onClick?: () => void
  showActions?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onFavorite?: () => void
  onUnfavorite?: () => void
  isFavorited?: boolean
  currentUserId?: string
}

const statusColors = {
  [StatusIniciativa.ATIVA]: 'bg-green-100 text-green-800',
  [StatusIniciativa.PAUSADA]: 'bg-yellow-100 text-yellow-800',
  [StatusIniciativa.CONCLUIDA]: 'bg-blue-100 text-blue-800',
  [StatusIniciativa.CANCELADA]: 'bg-red-100 text-red-800',
}

const getMaturityColor = (nivel: NivelMaturidade) => {
  switch (nivel) {
    case NivelMaturidade.CONCEITO:
      return 'bg-red-100 text-red-800'
    case NivelMaturidade.PROTOTIPO:
      return 'bg-yellow-100 text-yellow-800'
    case NivelMaturidade.DEMONSTRACAO:
      return 'bg-blue-100 text-blue-800'
    case NivelMaturidade.COMERCIALIZACAO:
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function InitiativeCard({
  initiative,
  onClick,
  showActions = false,
  onEdit,
  onDelete,
  onFavorite,
  onUnfavorite,
  isFavorited = false,
  currentUserId,
}: InitiativeCardProps) {
  const getStatusColor = (
    status: StatusIniciativa,
  ): 'default' | 'destructive' | 'outline' | 'secondary' => {
    switch (status) {
      case StatusIniciativa.ATIVA:
        return 'default'
      case StatusIniciativa.PAUSADA:
        return 'secondary'
      case StatusIniciativa.CONCLUIDA:
        return 'outline'
      case StatusIniciativa.CANCELADA:
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  // Filtrar apenas participantes ativos para exibição pública
  const activeParticipants = initiative.participantes?.filter(
    (p) => p.status_vinculo === StatusVinculo.ACEITO,
  ) || []

  const handleClick = (e: React.MouseEvent) => {
    // Se clicar nos botões de ação, não navega
    if ((e.target as HTMLElement).closest('.action-buttons')) {
      e.stopPropagation()
      return
    }
    onClick?.()
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFavorited) {
      onUnfavorite?.()
    } else {
      onFavorite?.()
    }
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow relative"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Badge variant="outline" className={getMaturityColor(initiative.nivel_maturidade)}>
              {initiative.nivel_maturidade}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Botão de Favoritar */}
            {currentUserId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavorite}
                className="action-buttons"
              >
                {isFavorited ? (
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                ) : (
                  <HeartIcon className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {/* Indicadores de Colaboração */}
            <div className="flex items-center gap-1">
              {initiative.aceita_colaboradores && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <UserCheck className="h-4 w-4 text-green-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Aceita colaboradores</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {initiative.colaboracao_internacional && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Globe className="h-4 w-4 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Colaboração internacional</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {initiative.tem_propriedade_intelectual && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Award className="h-4 w-4 text-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Propriedade intelectual: {initiative.tipo_propriedade}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {showActions && (
              <div className="action-buttons">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit?.()
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete?.()
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
        
        <CardTitle className="flex justify-between items-center">
          <span className="line-clamp-2">{initiative.titulo}</span>
          <Badge variant={getStatusColor(initiative.status)}>
            {initiative.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {initiative.descricao}
        </p>

        {/* Áreas de Conhecimento */}
        {initiative.areas_conhecimento && initiative.areas_conhecimento.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-600 mb-1">Áreas de Conhecimento:</p>
            <div className="flex flex-wrap gap-1">
              {initiative.areas_conhecimento.slice(0, 3).map((area: string) => (
                <Badge key={area} variant="outline" className="text-xs">
                  {area}
                </Badge>
              ))}
              {initiative.areas_conhecimento.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{initiative.areas_conhecimento.length - 3} mais
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Tecnologias */}
        {initiative.tecnologias_utilizadas && initiative.tecnologias_utilizadas.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-600 mb-1">Tecnologias:</p>
            <div className="flex flex-wrap gap-1">
              {initiative.tecnologias_utilizadas.slice(0, 3).map((tech: string) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {initiative.tecnologias_utilizadas.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{initiative.tecnologias_utilizadas.length - 3} mais
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Palavras-chave */}
        {initiative.palavras_chave && initiative.palavras_chave.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {initiative.palavras_chave.slice(0, 4).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {initiative.palavras_chave.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{initiative.palavras_chave.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Informações Financeiras */}
        {initiative.orcamento_previsto && (
          <div className="mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: initiative.moeda || 'BRL' 
                }).format(initiative.orcamento_previsto)}
              </span>
              {initiative.fonte_financiamento && (
                <span className="text-xs text-gray-500">
                  • {initiative.fonte_financiamento}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Impacto Esperado */}
        {initiative.impacto_esperado && (
          <div className="mb-3">
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-600">Impacto Esperado:</p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {initiative.impacto_esperado}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Público-alvo */}
        {initiative.publico_alvo && (
          <div className="mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span className="text-xs">
                <strong>Público:</strong> {initiative.publico_alvo}
              </span>
            </div>
          </div>
        )}

        {/* Participantes e Estatísticas */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {activeParticipants.length} participante(s)
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="p-2">
                  <p className="font-semibold mb-1">Participantes:</p>
                  <ul className="text-sm">
                    {activeParticipants.map((p) => (
                      <li key={p.uid}>
                        {p.papel} - {p.dedicacao_horas || 0}h/semana
                      </li>
                    ))}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-xs">{initiative.favoritos?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-xs">{initiative.seguidores?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Datas */}
        <div className="text-xs text-muted-foreground mt-3 pt-3 border-t">
          <p>
            Início:{' '}
            {format(new Date(initiative.data_inicio), 'PP', { locale: ptBR })}
          </p>
          {initiative.data_fim && (
            <p>
              Fim:{' '}
              {format(new Date(initiative.data_fim), 'PP', { locale: ptBR })}
            </p>
          )}
        </div>

        {/* Seção de Recursos e Resultados (se existir) */}
        {(initiative.recursos_necessarios || initiative.resultados_esperados) && (
          <div className="mt-4 border-t pt-4">
            {initiative.recursos_necessarios && (
              <div className="mb-2">
                <p className="text-xs font-medium">Recursos Necessários:</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {initiative.recursos_necessarios}
                </p>
              </div>
            )}
            {initiative.resultados_esperados && (
              <div>
                <p className="text-xs font-medium">Resultados Esperados:</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {initiative.resultados_esperados}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
