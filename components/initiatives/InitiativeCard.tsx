import {
  Iniciativa,
  StatusIniciativa,
  StatusVinculo,
} from '@/lib/types/initiativeTypes'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Users, MoreVertical, Edit, Trash2 } from 'lucide-react'
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
  initiative: Iniciativa
  onClick?: () => void
  showActions?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

const statusColors = {
  [StatusIniciativa.ATIVA]: 'bg-green-100 text-green-800',
  [StatusIniciativa.PAUSADA]: 'bg-yellow-100 text-yellow-800',
  [StatusIniciativa.CONCLUIDA]: 'bg-blue-100 text-blue-800',
  [StatusIniciativa.CANCELADA]: 'bg-red-100 text-red-800',
}

export function InitiativeCard({
  initiative,
  onClick,
  showActions = false,
  onEdit,
  onDelete,
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
  const activeParticipants = initiative.participantes.filter(
    (p) => p.status_vinculo === StatusVinculo.ACEITO,
  )

  const handleClick = (e: React.MouseEvent) => {
    // Se clicar nos botões de ação, não navega
    if ((e.target as HTMLElement).closest('.action-buttons')) {
      e.stopPropagation()
      return
    }
    onClick?.()
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Badge variant="outline">{initiative.tipo}</Badge>
            <Badge variant="outline">{initiative.categoria_origem}</Badge>
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
        <CardTitle className="flex justify-between items-center">
          <span>{initiative.titulo}</span>
          <Badge variant={getStatusColor(initiative.status)}>
            {initiative.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {initiative.descricao}
        </p>

        {initiative.palavras_chave.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {initiative.palavras_chave.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
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
        </div>

        <div className="text-sm text-muted-foreground">
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

        {(initiative.recursos_necessarios ||
          initiative.resultados_esperados) && (
          <div className="mt-4 border-t pt-4">
            {initiative.recursos_necessarios && (
              <div className="mb-2">
                <p className="text-sm font-medium">Recursos Necessários:</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {initiative.recursos_necessarios}
                </p>
              </div>
            )}
            {initiative.resultados_esperados && (
              <div>
                <p className="text-sm font-medium">Resultados Esperados:</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
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
