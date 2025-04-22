
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Tag } from 'lucide-react';

const TabsHeader = () => {
  return (
    <TabsList className="grid w-full grid-cols-2 mb-4">
      <TabsTrigger value="kits" className="flex items-center">
        <Package className="mr-2 h-4 w-4" /> Kits
      </TabsTrigger>
      <TabsTrigger value="temas" className="flex items-center">
        <Tag className="mr-2 h-4 w-4" /> Temas
      </TabsTrigger>
    </TabsList>
  );
};

export default TabsHeader;
