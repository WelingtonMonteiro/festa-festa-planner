
import { useState } from 'react';
import { useHandleContext } from '@/contexts/handleContext';
import { Contract } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ContractMessageSenderProps {
  clientId: string;
}

const ContractMessageSender = ({ clientId }: ContractMessageSenderProps) => {
  const { contracts, sendContractToClient } = useHandleContext();
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const availableContracts = contracts.filter(
    contract => contract.clientId === clientId && contract.status === 'draft'
  );

  const handleSendContract = () => {
    if (selectedContract) {
      sendContractToClient(selectedContract, clientId);
      setSelectedContract('');
      setIsOpen(false);
      toast.success('Contrato enviado com sucesso');
    } else {
      toast.error('Selecione um contrato para enviar');
    }
  };

  if (availableContracts.length === 0) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-1">
          <FileText className="h-4 w-4" />
          Enviar Contrato
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Enviar Contrato</SheetTitle>
          <SheetDescription>
            Selecione um contrato para enviar ao cliente.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <Select value={selectedContract} onValueChange={setSelectedContract}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um contrato" />
            </SelectTrigger>
            <SelectContent>
              {availableContracts.map((contract) => (
                <SelectItem key={contract.id} value={contract.id}>
                  {contract.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <SheetFooter>
          <Button onClick={handleSendContract}>
            Enviar Contrato
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ContractMessageSender;
