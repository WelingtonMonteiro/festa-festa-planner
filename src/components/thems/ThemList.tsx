
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Tag } from 'lucide-react';
import { Them } from '@/types';
import ThemCard from './ThemCard';
import { Skeleton } from "@/components/ui/skeleton";

interface ThemListProps {
  themes: Them[];
  onAddThem: () => void;
  onEditThem: (them: Them) => void;
  onDeleteThem: (id: string) => void;
  isLoading?: boolean;
}

const ThemList = ({ themes, onAddThem, onEditThem, onDeleteThem, isLoading = false }: ThemListProps) => {
  // Ensure themes is an array and not null or undefined
  const safeThemes = Array.isArray(themes) ? themes : [];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={onAddThem}
          className="bg-festa-primary hover:bg-festa-primary/90"
          disabled={isLoading}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Tema
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Mostrar skeletons durante carregamento
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={`skeleton-${index}`}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-20 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : safeThemes.length > 0 ? (
          safeThemes.map(theme => (
            <ThemCard 
              key={theme.id || (theme._id as string)} 
              theme={theme} 
              onEdit={onEditThem} 
              onDelete={onDeleteThem} 
            />
          ))
        ) : (
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
