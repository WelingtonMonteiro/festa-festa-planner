
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { entityFields, EntityType } from '@/utils/contractEntityFields';
import { TemplateVariable } from '../ContractTemplates';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash } from 'lucide-react';

const variableSchema = z.object({
  name: z.string().min(1, "Nome da variável é obrigatório"),
  description: z.string().min(1, "Descrição da variável é obrigatória"),
  defaultValue: z.string().optional(),
  entity: z.string().optional(),
  entityField: z.string().optional()
});

type VariableForm = z.infer<typeof variableSchema>;

interface VariableFormProps {
  onSubmit: (data: VariableForm) => void;
  onCancel: () => void;
  currentVariables: TemplateVariable[];
  editingVariable?: TemplateVariable;
  onEditVariable: (index: number) => void;
  onDeleteVariable: (index: number) => void;
}

const VariableForm = ({ 
  onSubmit, 
  onCancel, 
  currentVariables, 
  editingVariable,
  onEditVariable,
  onDeleteVariable
}: VariableFormProps) => {
  const form = useForm<VariableForm>({
    resolver: zodResolver(variableSchema),
    defaultValues: editingVariable || {
      name: '',
      description: '',
      defaultValue: '',
    },
  });

  const groupVariables = (variables: TemplateVariable[]): Record<string, TemplateVariable[]> => {
    return variables.reduce((acc: Record<string, TemplateVariable[]>, variable) => {
      const entity = variable.entity || 'outros';
      if (!acc[entity]) {
        acc[entity] = [];
      }
      acc[entity].push(variable);
      return acc;
    }, {});
  };

  const groupedVariables = groupVariables(currentVariables);

  return (
    <div className="space-y-6">
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

      {currentVariables.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Variáveis Existentes</h4>
          {Object.entries(groupedVariables).map(([entity, variables]) => (
            variables.length > 0 && (
              <div key={entity} className="mb-4">
                <h5 className="text-sm font-medium mb-2 capitalize">{entity}</h5>
                <div className="space-y-2">
                  {variables.map((variable: TemplateVariable, index: number) => {
                    const globalIndex = currentVariables.findIndex(v => v === variable);
                    return (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <Badge variant="secondary" className="mb-1">
                            {`{${variable.name}}`}
                          </Badge>
                          <p className="text-sm text-muted-foreground">{variable.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onEditVariable(globalIndex)}
                            title="Editar variável"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onDeleteVariable(globalIndex)}
                            title="Remover variável"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default VariableForm;
