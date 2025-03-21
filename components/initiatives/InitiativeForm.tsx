import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { InitiativeCreate, InitiativeType } from '@/lib/types/initiativeTypes';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { DatePicker } from '../ui/date-picker';

const initiativeSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  tipo: z.nativeEnum(InitiativeType),
  palavras_chave: z.array(z.string()),
  data_inicio: z.string(),
  data_fim: z.string().optional(),
  business_id: z.string().optional(),
  equipe: z.array(z.string()).optional(),
  recursos_necessarios: z.array(z.string()).optional(),
});

interface InitiativeFormProps {
  onSubmit: (data: InitiativeCreate) => void;
  isLoading?: boolean;
  defaultValues?: Partial<InitiativeCreate>;
}

export function InitiativeForm({ onSubmit, isLoading, defaultValues }: InitiativeFormProps) {
  const form = useForm<InitiativeCreate>({
    resolver: zodResolver(initiativeSchema),
    defaultValues: {
      palavras_chave: [],
      equipe: [],
      recursos_necessarios: [],
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Adicione outros campos do formulário aqui */}
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Form>
  );
} 