import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface BusinessCreationProps {
  onRequestCreate: () => void
}

export function BusinessCreation({ onRequestCreate }: BusinessCreationProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Adicionar Negócio</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onRequestCreate}
          className="bg-slate-700 w-full hover:bg-black text-white"
        >
          <Plus className="mr-2 h-4 w-4 text-white" /> Clique aqui!
        </Button>
      </CardContent>
    </Card>
  )
}

