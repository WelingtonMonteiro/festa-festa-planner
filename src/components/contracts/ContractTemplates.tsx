
import { useState, useCallback, useEffect } from 'react';
import { useHandleContext } from '@/contexts/handleContext';
import { ContractTemplate } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, MoreVertical, Edit, Copy, Trash, FileText, Variable } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import ContractEditor from './ContractEditor';
import { Badge } from '../ui/badge';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { entityFields, EntityType } from '@/utils/contractEntityFields';

interface ContractTemplatesProps {
  selectedTemplate: string | null;
  setSelectedTemplate: (id: string | null) => void;
  isActive?: boolean;
}

export interface TemplateVariable {
  name: string;
  description: string;
  entity?: string;
  entityField?: string;
  defaultValue?: string;
}

const variableSchema = z.object({
  name: z.string().min(1, "Nome da variável é obrigatório"),
  description: z.string().min(1, "Descrição da variável é obrigatória"),
  defaultValue: z.string().optional(),
  entity: z.string().optional(),
  entityField: z.string().optional()
});

type VariableForm = z.infer<typeof variableSchema>;

const ContractTemplates = ({ selectedTemplate, setSelectedTemplate, isActive = false }: ContractTemplatesProps) => {
  const { contractTemplates, clients, addContractTemplate, updateContractTemplate, removeContractTemplate } = useHandleContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [templateToEdit, setTemplateToEdit] = useState<ContractTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [previewClientId, setPreviewClientId] = useState<string>('');
  const [templatesRequested, setTemplatesRequested] = useState(false);
  const [isVariableDialogOpen, setIsVariableDialogOpen] = useState(false);
  const [currentVariables, setCurrentVariables] = useState<TemplateVariable[]>([]);
  const [editingVariableIndex, setEditingVariableIndex] = useState<number | null>(null);

  const form = useForm<VariableForm>({
    resolver: zodResolver(variableSchema),
    defaultValues: {
      name: '',
      description: '',
      defaultValue: '',
    },
  });

  const handleAddVariable = (data: VariableForm) => {
    if (editingVariableIndex !== null) {
      const newVariables = [...currentVariables];
      newVariables[editingVariableIndex] = data as TemplateVariable;
      setCurrentVariables(newVariables);
      if (templateToEdit) {
        updateContractTemplate(templateToEdit.id, {
          variables: JSON.stringify(newVariables)
        });
      }
    } else {
      const newVariables = [...currentVariables, data as TemplateVariable];
      setCurrentVariables(newVariables);
      if (templateToEdit) {
        updateContractTemplate(templateToEdit.id, {
          variables: JSON.stringify(newVariables)
        });
      }
    }
    setIsVariableDialogOpen(false);
    form.reset();
    setEditingVariableIndex(null);
    toast.success(editingVariableIndex !== null ? 'Variável atualizada' : 'Variável adicionada');
  };

  const handleEditVariable = (index: number) => {
    const variable = currentVariables[index];
    form.reset(variable);
    setEditingVariableIndex(index);
    setIsVariableDialogOpen(true);
  };

  const handleDeleteVariable = (indexToDelete: number) => {
    const newVariables = currentVariables.filter((_, i) => i !== indexToDelete);
    setCurrentVariables(newVariables);
    if (templateToEdit) {
      updateContractTemplate(templateToEdit.id, {
        variables: JSON.stringify(newVariables)
      });
    }
    toast.success('Variável removida');
  };

  useEffect(() => {
    if (templateToEdit) {
      try {
        const variables = parseTemplateVariables(templateToEdit.variables);
        setCurrentVariables(variables);
      } catch (error) {
        console.error('Erro ao carregar variáveis:', error);
        setCurrentVariables([]);
      }
    }
  }, [templateToEdit]);

  const safeContractTemplates = contractTemplates || [];
  const filteredTemplates = safeContractTemplates.filter(template => 
    template && template.name && 
    template.name.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const previewClient = previewClientId ? clients.find(c => c.id === previewClientId) : undefined;

  const handleCreateTemplate = useCallback(() => {
    if (!newTemplateName.trim()) {
      toast.error('O nome do modelo não pode estar vazio');
      return;
    }

    const templateData = {
      name: newTemplateName.trim(),
      content: `<h1>${newTemplateName}</h1><p>Insira aqui o conteúdo do contrato.</p>`
    };
    
    addContractTemplate(templateData);
    
    setNewTemplateName('');
    setIsCreateDialogOpen(false);
    
    setTimeout(() => {
      const newTemplate = contractTemplates.find(t => t.name === templateData.name);
      if (newTemplate) {
        setSelectedTemplate(newTemplate.id);
        setTemplateToEdit(newTemplate);
        setIsEditDialogOpen(true);
      }
    }, 100);
  }, [newTemplateName, addContractTemplate, setSelectedTemplate, contractTemplates]);

  const handleEditTemplate = useCallback((template: ContractTemplate) => {
    setTemplateToEdit(template);
    setSelectedTemplate(template.id);
    setIsEditDialogOpen(true);
  }, [setSelectedTemplate]);

  const handleDeleteTemplate = useCallback(() => {
    if (templateToDelete) {
      removeContractTemplate(templateToDelete);
      setTemplateToDelete(null);
      setIsDeleteDialogOpen(false);

      if (selectedTemplate === templateToDelete) {
        setSelectedTemplate(null);
      }
    }
  }, [templateToDelete, removeContractTemplate, selectedTemplate, setSelectedTemplate]);

  const handleCopyTemplate = useCallback((template: ContractTemplate) => {
    const copyData = {
      name: `${template.name} (Cópia)`,
      content: template.content
    };
    
    addContractTemplate(copyData);
    toast.success(`Modelo "${template.name}" copiado com sucesso`);
  }, [addContractTemplate]);

  const handleSaveTemplate = useCallback((content: string) => {
    if (templateToEdit) {
      updateContractTemplate(templateToEdit.id, { content });
      setTemplateToEdit(null);
      setIsEditDialogOpen(false);
      toast.success('Modelo salvo com sucesso');
    }
  }, [templateToEdit, updateContractTemplate]);

  const handleOpenVariablesDialog = () => {
    setIsVariableDialogOpen(true);
  };

  // Helper function to parse JSON safely and ensure all required fields exist
  const parseTemplateVariables = (jsonString: string | undefined): TemplateVariable[] => {
    if (!jsonString) return [];
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) return [];
      
      // Garantir que cada item tem as propriedades obrigatórias
      return parsed.filter(item => {
        // Filtramos itens que não tenham as propriedades obrigatórias
        return item && typeof item === 'object' && 
               typeof item.name === 'string' && 
               typeof item.description === 'string';
      }) as TemplateVariable[];
    } catch (e) {
      console.error('Erro ao analisar JSON de variáveis:', e);
      return [];
    }
  };

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
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar modelos de contrato..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Novo Modelo
        </Button>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center p-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum modelo encontrado</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Crie um novo modelo de contrato para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-medium truncate">{template.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopyTemplate(template)}>
                      <Copy className="mr-2 h-4 w-4" /> Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        setTemplateToDelete(template.id);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 h-12" 
                  dangerouslySetInnerHTML={{ 
                    __html: template.content ? 
                      template.content.replace(/<[^>]*>?/gm, ' ').substring(0, 100) + '...' :
                      'Sem conteúdo'
                  }} 
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-xs text-muted-foreground">
                  Criado em: {template.createdAt ? 
                    format(new Date(template.createdAt), 'dd/MM/yyyy', { locale: ptBR }) : 
                    'Data desconhecida'
                  }
                </span>
                <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                  <Edit className="mr-2 h-3 w-3" /> Editar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Modelo de Contrato</DialogTitle>
            <DialogDescription>
              Crie um novo modelo de contrato para usar com seus clientes.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Nome do modelo de contrato"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateTemplate}>Criar Modelo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Modelo de Contrato</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este modelo de contrato? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {templateToEdit && (
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setTemplateToEdit(null);
            setCurrentVariables([]);
          }
        }}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Editar Modelo: {templateToEdit.name}</DialogTitle>
              <DialogDescription>
                Edite o conteúdo do modelo de contrato e gerencie suas variáveis.
              </DialogDescription>
            </DialogHeader>
            
            <ContractEditor
              isOpen={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              template={templateToEdit}
              onSave={handleSaveTemplate}
              previewClient={previewClient}
              onEditVariables={handleOpenVariablesDialog}
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isVariableDialogOpen} onOpenChange={setIsVariableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVariableIndex !== null ? 'Editar Variável' : 'Nova Variável'}</DialogTitle>
            <DialogDescription>
              {editingVariableIndex !== null 
                ? 'Edite os detalhes da variável para o modelo de contrato' 
                : 'Adicione uma nova variável ao modelo de contrato'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddVariable)} className="space-y-4">
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
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => {
                  setIsVariableDialogOpen(false);
                  form.reset();
                  setEditingVariableIndex(null);
                }}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingVariableIndex !== null ? 'Atualizar' : 'Adicionar'}
                </Button>
              </DialogFooter>
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
                                onClick={() => handleEditVariable(globalIndex)}
                                title="Editar variável"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteVariable(globalIndex)}
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContractTemplates;
