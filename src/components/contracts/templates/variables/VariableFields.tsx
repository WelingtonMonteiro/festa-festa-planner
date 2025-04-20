
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { entityFields, EntityType } from '@/utils/contractEntityFields';
import { TemplateVariable } from '@/types/contracts';

const variableSchema = z.object({
  name: z.string().min(1, "Nome da variável é obrigatório"),
  description: z.string().min(1, "Descrição da variável é obrigatória"),
  defaultValue: z.string().optional(),
  entity: z.string().optional(),
  entityField: z.string().optional()
});

export type VariableFormData = z.infer<typeof variableSchema>;

interface VariableFieldsProps {
  onSubmit: (data: VariableFormData) => void;
  onCancel: () => void;
  editingVariable?: TemplateVariable;
}

const VariableFields = ({ onSubmit, onCancel, editingVariable }: VariableFieldsProps) => {
  const form = useForm<VariableFormData>({
    resolver: zodResolver(variableSchema),
    defaultValues: editingVariable || {
      name: '',
      description: '',
      defaultValue: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="entity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entidade</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma entidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Cliente</SelectItem>
                    <SelectItem value="kit">Kit</SelectItem>
                    <SelectItem value="theme">Tema</SelectItem>
                    <SelectItem value="event">Evento</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("entity") && (
          <FormField
            control={form.control}
            name="entityField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campo da Entidade</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const entity = form.getValues("entity") as EntityType;
                      const selectedField = entityFields[entity].find(f => f.key === value);
                      if (selectedField) {
                        form.setValue("name", `${entity}_${value}`);
                        form.setValue("description", `Campo ${selectedField.label.toLowerCase()} da entidade ${entity}`);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um campo" />
                    </SelectTrigger>
                    <SelectContent>
                      {form.watch("entity") && entityFields[form.watch("entity") as EntityType].map((field) => (
                        <SelectItem key={field.key} value={field.key}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Variável</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  disabled={!!form.watch("entityField")}
                  placeholder="Ex: cliente_nome" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  disabled={!!form.watch("entityField")}
                  placeholder="Ex: Nome completo do cliente" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="defaultValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Padrão (opcional)</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  disabled={!!form.watch("entityField")}
                  placeholder="Ex: João da Silva" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {editingVariable ? 'Atualizar' : 'Adicionar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VariableFields;
