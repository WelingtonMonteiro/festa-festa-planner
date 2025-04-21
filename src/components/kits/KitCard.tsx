
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Package, Trash2 } from 'lucide-react';
import { Kit } from '@/types';

interface KitCardProps {
  kit: Kit;
  onEdit: (kit: Kit) => void;
  onDelete: (id: string) => void;
}

const KitCard = ({ kit, onEdit, onDelete }: KitCardProps) => {
  // Use id ou _id (para compatibilidade com MongoDB)
  const kitId = kit.id || kit._id;
  
  return (
    <Card key={kitId}>
      <CardHeader className="relative">
        {kit.imagens && kit.imagens.length > 0 && kit.imagens[0] !== '' && (
          <div className="absolute inset-0 rounded-t-lg overflow-hidden">
            <img 
              src={kit.imagens[0]} 
              alt={kit.nome}
              className="w-full h-24 object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          </div>
        )}
        <CardTitle className="relative z-10">{kit.nome}</CardTitle>
        <CardDescription className="relative z-10">
          R$ {kit.preco.toLocaleString('pt-BR')}
        </CardDescription>
        <div className="absolute right-4 top-4 flex space-x-2 z-10">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onEdit(kit)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onDelete(kitId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{kit.descricao}</p>
        <div>
          <h4 className="text-sm font-medium mb-2">Itens inclusos:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {kit.itens && kit.itens.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Alugado {kit.vezes_alugado} {kit.vezes_alugado === 1 ? 'vez' : 'vezes'}
        </div>
      </CardFooter>
    </Card>
  );
};

export default KitCard;
