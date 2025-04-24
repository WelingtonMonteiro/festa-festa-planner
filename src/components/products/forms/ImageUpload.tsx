
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

const ImageUpload = ({ images, onImageUpload, onRemoveImage }: ImageUploadProps) => {
  return (
    <div className="space-y-2">
      <Label>Imagens do Produto</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
        {images.map((img, index) =>
          img !== '' ? (
            <div key={`image-${index}`} className="relative rounded-md overflow-hidden border h-24">
              <img 
                src={img} 
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full"
                onClick={() => onRemoveImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : null
        )}
        
        <div className="border rounded-md flex flex-col items-center justify-center p-4 h-24 cursor-pointer hover:bg-muted/50 transition-colors">
          <Label htmlFor="product-image-upload" className="cursor-pointer flex flex-col items-center gap-1">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Upload</span>
          </Label>
          <Input
            id="product-image-upload"
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
