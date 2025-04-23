
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Package, Tag, Trash2 } from 'lucide-react';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/format';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  // Use product.id directly
  const productId = product.id;

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'kit':
        return <Package className="h-5 w-5" />;
      case 'theme':
        return <Tag className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  // ROI para themes (usando metadata, campos dinâmicos)
  const calcROI = (product: Product) => {
    if (product.type !== 'theme' || !product.metadata?.valorGasto) {
      return '0.00';
    }
    const kits = Array.isArray(product.metadata?.kits) ? product.metadata.kits : [];
    const averagePrice = kits.length > 0
      ? kits.reduce((sum: number, kit: any) => sum + (kit.preco || 0), 0) / kits.length
      : 0;
    const totalRevenue = (product.metadata?.rentCount || 0) * averagePrice;
    const investment = product.metadata.valorGasto;
    const roi = investment > 0 ? ((totalRevenue / investment) - 1) * 100 : 0;
    return roi.toFixed(2);
  };

  // Contador de aluguel (rentCount fica em metadata.rentCount)
  const getRentCount = (product: Product) => {
    return product.metadata?.rentCount || 0;
  };

  return (
    <Card key={productId} className={cn(
      "relative overflow-hidden transition-all",
      product.type === 'kit' && "border-l-4 border-l-blue-500",
      product.type === 'theme' && "border-l-4 border-l-green-500"
    )}>
      <CardHeader className="relative">
        {product.images && product.images.length > 0 && product.images[0] !== '' && (
          <div className="absolute inset-0 rounded-t-lg overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name || 'Produto sem nome'}
              className="w-full h-24 object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          </div>
        )}

        <div className="flex items-center space-x-2 relative z-10">
          <div className="p-1 rounded-md bg-muted">
            {getTypeIcon(product.type)}
          </div>
          <CardTitle>{product.name}</CardTitle>
        </div>

        <CardDescription className="relative z-10">
          {product.type === 'kit' && product.price && `Valor: R$ ${product.price.toLocaleString('pt-BR')}`}
          {product.type === 'theme' && product.metadata?.valorGasto &&
            `Investimento: R$ ${(product.metadata.valorGasto).toLocaleString('pt-BR')}`}
        </CardDescription>

        <div className="absolute right-4 top-4 flex space-x-2 z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(productId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-3">{product.description}</div>

        {/* Itens do kit agora ficam em metadata se existirem */}
        {product.type === 'kit' && product.metadata?.items && product.metadata.items.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-2">Itens:</h4>
            <div className="flex flex-wrap gap-2">
              {product.metadata.items.map((item: string, index: number) => (
                <div key={`item-${index}`} className="bg-muted rounded-full px-3 py-1 text-xs">
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kits relacionados (apenas para theme, como estava) */}
        {product.type === 'theme' && product.metadata?.kits && (
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-2">Kits disponíveis:</h4>
            <div className="flex flex-wrap gap-2">
              {product.metadata.kits.length > 0 ? product.metadata.kits.map((kit: any) => (
                <div key={kit.id} className="bg-muted rounded-full px-3 py-1 text-xs">
                  {kit.nome || kit.name || 'Kit sem nome'}
                </div>
              )) : (
                <div className="text-xs text-muted-foreground">Nenhum kit disponível</div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-muted rounded p-2">
            <div className="font-medium">Alugado</div>
            <div>{getRentCount(product)} {getRentCount(product) === 1 ? 'vez' : 'vezes'}</div>
          </div>

          {/* ROI só para temas */}
          {product.type === 'theme' && (
            <div className="bg-muted rounded p-2">
              <div className="font-medium">ROI</div>
              <div className={Number(calcROI(product)) > 0 ? "text-green-600" : "text-red-600"}>
                {calcROI(product)}%
              </div>
            </div>
          )}

          {product.type === 'kit' && (
            <div className="bg-muted rounded p-2">
              <div className="font-medium">Valor</div>
              <div>{formatCurrency(product.price || 0)}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
