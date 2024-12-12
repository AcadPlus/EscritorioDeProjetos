import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import GenericForm from './generic-form'
import { AbstractVitrineFactory } from '@/app/factories/AbstractVitrineFactory'
import { StartupFactory } from '@/app/factories/StartupFactory'

export default function CreateVitrineModal({
  onItemCreated,
}: {
  onItemCreated: (item: unknown) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFactory, setSelectedFactory] =
    useState<AbstractVitrineFactory | null>(null)

  const handleSelectType = (factory: AbstractVitrineFactory) => {
    setSelectedFactory(factory)
  }

  const handleItemCreated = (item: unknown) => {
    onItemCreated(item)
    setIsOpen(false)
    setSelectedFactory(null)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setSelectedFactory(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        {!selectedFactory ? (
          <>
            <DialogHeader>
              <DialogTitle>Criar Novo Item para a Vitrine</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button
                onClick={() => handleSelectType(new StartupFactory())}
                variant="outline"
              >
                Criar Startup
              </Button>
            </div>
          </>
        ) : (
          <GenericForm
            factory={selectedFactory}
            onItemCreated={handleItemCreated}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
