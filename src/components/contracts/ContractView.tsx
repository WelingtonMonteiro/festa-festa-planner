
import { useState } from 'react';
import { Contract, Client } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useHandleContext } from '@/contexts/handleContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { FileSignature, Download, Send } from 'lucide-react';

interface ContractViewProps {
  contract: Contract;
  client?: Client;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusLabels = {
  'draft': 'Rascunho',
  'sent': 'Enviado',
  'signed': 'Assinado',
  'expired': 'Expirado',
  'cancelled': 'Cancelado'
};

const statusColors = {
  'draft': 'bg-yellow-100 text-yellow-800',
  'sent': 'bg-blue-100 text-blue-800',
  'signed': 'bg-green-100 text-green-800',
  'expired': 'bg-gray-100 text-gray-800',
  'cancelled': 'bg-red-100 text-red-800'
};

const ContractView = ({ contract, client, isOpen, onOpenChange }: ContractViewProps) => {
  const { signContract, sendContractToClient } = useHandleContext();
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  
  const handleSign = () => {
    // In a real implementation, this would involve a digital signature process
    // For this example, we'll simulate a signature with a timestamp
    const signatureUrl = `Assinado digitalmente por ${client?.nome} em ${format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}`;
    
    signContract(contract.id, signatureUrl);
    setIsSignDialogOpen(false);
    toast.success('Contrato assinado com sucesso!');
  };
  
  const handleSendToClient = () => {
    if (client) {
      sendContractToClient(contract.id, client.id);
    }
  };
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${contract.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              .header { margin-bottom: 30px; }
              .signature { margin-top: 50px; border-top: 1px solid #ccc; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${contract.title}</h1>
              <p>${client ? `Cliente: ${client.nome}` : ''}</p>
              <p>Data: ${format(new Date(contract.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</p>
            </div>
            ${contract.content}
            ${contract.signatureUrl ? `<div class="signature">${contract.signatureUrl}</div>` : ''}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">{contract.title}</DialogTitle>
              <Badge 
                variant="outline" 
                className={statusColors[contract.status]}
              >
                {statusLabels[contract.status]}
              </Badge>
            </div>
            {client && (
              <p className="text-sm text-muted-foreground mt-2">
                Cliente: {client.nome} | 
                Criado em: {format(new Date(contract.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            )}
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto my-4 border p-6 bg-white rounded-md">
            <div 
              className="contract-content prose prose-sm max-w-none" 
              dangerouslySetInnerHTML={{ __html: contract.content }} 
            />
            
            {contract.signatureUrl && (
              <div className="mt-8 pt-4 border-t">
                <h4 className="font-medium">Assinatura:</h4>
                <p className="text-sm text-muted-foreground">{contract.signatureUrl}</p>
                {contract.signedAt && (
                  <p className="text-xs text-muted-foreground">
                    Assinado em: {format(new Date(contract.signedAt), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                  </p>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-between gap-2 flex-wrap">
            <div className="flex gap-2">
              {contract.status === 'draft' && (
                <Button variant="outline" onClick={handleSendToClient}>
                  <Send className="h-4 w-4 mr-2" /> Enviar para Cliente
                </Button>
              )}
              {contract.status === 'sent' && client && (
                <Button onClick={() => setIsSignDialogOpen(true)}>
                  <FileSignature className="h-4 w-4 mr-2" /> Assinar Contrato
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Download className="h-4 w-4 mr-2" /> Imprimir / Baixar
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Sign Contract Dialog */}
      {client && (
        <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assinar Contrato</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Confirma a assinatura digital deste contrato como {client.nome}?</p>
              <p className="text-sm text-muted-foreground mt-2">
                Ao clicar em "Assinar", você confirma que leu e concorda com os termos do contrato.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSignDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSign}>Assinar Contrato</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ContractView;
