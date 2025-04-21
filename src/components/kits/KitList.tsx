
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, PlusCircle } from 'lucide-react';
import { Kit } from '@/types';
import KitCard from './KitCard';
import { Skeleton } from "@/components/ui/skeleton";

interface KitListProps {
  kits: Kit[];
  onAddKit: () => void;
  onEditKit: (kit: Kit) => void;
  onDeleteKit: (id: string) => void;
  isLoading?: boolean;
}

const KitList = ({ kits, onAddKit, onEditKit, onDeleteKit, isLoading = false }: KitListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={onAddKit}
          className="bg-festa-primary hover:bg-festa-primary/90"
          disabled={isLoading}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Kit
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
        ) : kits && kits.length > 0 ? (
          kits.map(kit => (
            <KitCard 
              key={kit.id || (kit._id as string)} 
              kit={kit} 
              onEdit={onEditKit} 
              onDelete={onDeleteKit} 
            />
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">
                  Nenhum kit cadastrado. Adicione seu primeiro kit!
                </p>
                <Button 
                  variant="outline" 
                  onClick={onAddKit} 
                  className="mt-4"
                >
                  Adicionar Kit
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitList;
