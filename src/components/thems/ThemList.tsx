
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Tag } from 'lucide-react';
import { Them } from '@/types';
import ThemCard from './ThemCard';

interface ThemListProps {
  themes: Them[];
  onAddThem: () => void;
  onEditThem: (them: Them) => void;
  onDeleteThem: (id: string) => void;
}

const ThemList = ({ themes, onAddThem, onEditThem, onDeleteThem }: ThemListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={onAddThem}
          className="bg-festa-primary hover:bg-festa-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Tema
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {themes.map(theme => (
          <ThemCard 
            key={theme.id} 
            theme={theme} 
            onEdit={onEditThem} 
            onDelete={onDeleteThem} 
          />
        ))}
        
        {themes.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">
                  Nenhum tema cadastrado. Adicione seu primeiro tema!
                </p>
                <Button 
                  variant="outline" 
                  onClick={onAddThem}
                  className="mt-4"
                >
                  Adicionar Tema
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemList;
