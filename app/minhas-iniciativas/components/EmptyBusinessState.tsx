import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const EmptyBusinessState = () => {
  const router = useRouter()
  
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <h2 className="text-2xl font-semibold">
        Você ainda não tem nenhum negócio cadastrado
      </h2>
      <p className="text-muted-foreground text-center">
        Para criar uma iniciativa, primeiro você precisa cadastrar um
        negócio.
        <br />
        Cadastre seu primeiro negócio para começar!
      </p>
      <Button
        onClick={() => router.push('/linka/meus-negocios')}
        className="bg-black text-white hover:bg-black/70"
      >
        <Plus className="mr-2 h-4 w-4" />
        Criar Negócio
      </Button>
    </div>
  )
} 