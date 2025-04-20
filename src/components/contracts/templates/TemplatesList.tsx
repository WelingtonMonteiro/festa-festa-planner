
import { ContractTemplate } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Copy, Trash, MoreVertical, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TemplatesListProps {
  templates: ContractTemplate[];
  onEdit: (template: ContractTemplate) => void;
  onCopy: (template: ContractTemplate) => void;
  onDelete: (templateId: string) => void;
}

const TemplatesList = ({ templates, onEdit, onCopy, onDelete }: TemplatesListProps) => {
  if (templates.length === 0) {
    return (
      <div className="text-center p-8">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-semibold">Nenhum modelo encontrado</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Crie um novo modelo de contrato para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
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
                <DropdownMenuItem onClick={() => onEdit(template)}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopy(template)}>
                  <Copy className="mr-2 h-4 w-4" /> Duplicar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(template.id)}
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
            <Button variant="outline" size="sm" onClick={() => onEdit(template)}>
              <Edit className="mr-2 h-3 w-3" /> Editar
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TemplatesList;
