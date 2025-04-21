
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Tag, Trash2 } from 'lucide-react';
import { Them } from '@/types';

interface ThemCardProps {
  theme: Them;
  onEdit: (theme: Them) => void;
  onDelete: (id: string) => void;
}

const ThemCard = ({ theme, onEdit, onDelete }: ThemCardProps) => {
  // Usar id, com fallback para _id se existir
  const themeId = theme.id || (theme._id as string);
  
  const calcROI = (them: Them) => {
    const receitaTotal = them.vezes_alugado * (them.kits?.reduce((sum, kit) => sum + (kit.preco || 0), 0) / (them.kits?.length || 1));
    const roi = them.valorGasto > 0 ? ((receitaTotal / them.valorGasto) - 1) * 100 : 0;
    return roi.toFixed(2);
  };
  
  return (
    <Card key={themeId}>
      <CardHeader className="relative">
        {theme.imagens && theme.imagens.length > 0 && theme.imagens[0] !== '' && (
          <div className="absolute inset-0 rounded-t-lg overflow-hidden">
            <img 
              src={theme.imagens[0]} 
              alt={theme.nome || 'Tema sem nome'}
              className="w-full h-24 object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          </div>
        )}
        <CardTitle className="relative z-10">{theme.nome}</CardTitle>
        <CardDescription className="relative z-10">
          Investimento: R$ {(theme.valorGasto || 0).toLocaleString('pt-BR')}
        </CardDescription>
        <div className="absolute right-4 top-4 flex space-x-2 z-10">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onEdit(theme)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onDelete(themeId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{theme.descricao}</p>
        <div className="mb-3">
          <h4 className="text-sm font-medium mb-2">Kits disponíveis:</h4>
          <div className="flex flex-wrap gap-2">
            {theme.kits && theme.kits.length > 0 ? theme.kits.map(kit => (
              <div key={kit.id || (kit._id as string)} className="bg-muted rounded-full px-3 py-1 text-xs">
                {kit.nome || 'Kit sem nome'}
              </div>
            )) : (
              <div className="text-xs text-muted-foreground">Nenhum kit disponível</div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-muted rounded p-2">
            <div className="font-medium">Alugado</div>
            <div>{theme.vezes_alugado || 0} {(theme.vezes_alugado || 0) === 1 ? 'vez' : 'vezes'}</div>
          </div>
          <div className="bg-muted rounded p-2">
            <div className="font-medium">ROI</div>
            <div className={Number(calcROI(theme)) > 0 ? "text-green-600" : "text-red-600"}>
              {calcROI(theme)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemCard;
