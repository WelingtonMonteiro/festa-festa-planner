
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Tag } from 'lucide-react';

interface TabsHeaderProps {
  defaultValue?: string;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

const TabsHeader = ({ 
  defaultValue = "kits", 
  activeTab, 
  onTabChange 
}: TabsHeaderProps) => {
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  const currentTab = activeTab || defaultValue;

  return (
    <TabsList className="grid w-full grid-cols-2 mb-4">
      <TabsTrigger 
        value="kits" 
        className="flex items-center"
        onClick={() => handleTabChange("kits")}
        data-state={currentTab === "kits" ? "active" : "inactive"}
      >
        <Package className="mr-2 h-4 w-4" /> Kits
      </TabsTrigger>
      <TabsTrigger 
        value="temas" 
        className="flex items-center"
        onClick={() => handleTabChange("temas")}
        data-state={currentTab === "temas" ? "active" : "inactive"}
      >
        <Tag className="mr-2 h-4 w-4" /> Temas
      </TabsTrigger>
    </TabsList>
  );
};

export default TabsHeader;
