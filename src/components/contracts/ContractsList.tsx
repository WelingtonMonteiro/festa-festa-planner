
import { useState } from 'react';
import { useHandleContext } from '@/contexts/handleContext';
import { Contract, Client } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Plus, MoreVertical, Edit, Send, FileText, File, Eye } from 'lucide-react';
import { toast } from 'sonner';
import ContractEditor from './ContractEditor';
import ContractView from './ContractView';

const statusColors = {
  'draft': 'bg-yellow-100 text-yellow-800',
  'sent': 'bg-blue-100 text-blue-800',
  'signed': 'bg-green-100 text-green-800',
  'expired': 'bg-gray-100 text-gray-800',
  'cancelled': 'bg-red-100 text-red-800'
};

const statusLabels = {
  'draft': 'Rascunho',
  'sent': 'Enviado',
  'signed': 'Assinado',
  'expired': 'Expirado',
  'cancelled': 'Cancelado'
};

interface ContractsListProps {
  selectedContract: string | null;
  setSelectedContract: (id: string | null) => void;
}

const ContractsList = ({ selectedContract, setSelectedContract }: ContractsListProps) => {
  const { 
    contracts, 
    contractTemplates, 
    clients, 
    addContract, 
    updateContract, 
    removeContract,
    sendContractToClient 
  } = useHandleContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [contractTitle, setContractTitle] = useState<string>('');
  const [contractToView, setContractToView] = useState<Contract | null>(null);
  const [contractToEdit, setContractToEdit] = useState<Contract | null>(null);
  const [contractToSend, setContractToSend] = useState<string | null>(null);

  const handleCreateContract = () => {
    if (!selectedTemplate || !selectedClient || !contractTitle.trim()) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    const template = contractTemplates.find(t => t.id === selectedTemplate);
    if (!template) {
      toast.error('Modelo de contrato não encontrado');
      return;
    }

    const client = clients.find(c => c.id === selectedClient);
    if (!client) {
      toast.error('Cliente não encontrado');
      return;
    }

    // Replace template variables with client data
    let contractContent = template.content;
    contractContent = contractContent.replace(/\{cliente\.nome\}/g, client.nome);
    contractContent = contractContent.replace(/\{cliente\.email\}/g, client.email);
    contractContent = contractContent.replace(/\{cliente\.telefone\}/g, client.telefone);
    if (client.endereco) {
      contractContent = contractContent.replace(/\{cliente\.endereco\}/g, client.endereco);
    }

    const newContract = addContract({
      title: contractTitle.trim(),
      content: contractContent,
      clientId: selectedClient,
      status: 'draft',
      templateId: selectedTemplate
    });

    setContractTitle('');
    setSelectedTemplate('');
    setSelectedClient('');
    setIsCreateDialogOpen(false);
    
    setContractToEdit(newContract);
    setIsEditDialogOpen(true);
  };

  const handleViewContract = (contract: Contract) => {
    setContractToView(contract);
    setIsViewDialogOpen(true);
  };

  const handleEditContract = (contract: Contract) => {
    setContractToEdit(contract);
    setIsEditDialogOpen(true);
  };

  const handleSendContract = () => {
    if (contractToSend) {
      const contract = contracts.find(c => c.id === contractToSend);
      if (contract) {
        sendContractToClient(contractToSend, contract.clientId);
        setContractToSend(null);
        setIsSendDialogOpen(false);
      }
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.nome : 'Cliente desconhecido';
  };

  const filteredContracts = contracts.filter(contract => {
    const clientName = getClientName(contract.clientId);
    const searchLower = searchQuery.toLowerCase();
    
    return (
      contract.title.toLowerCase().includes(searchLower) || 
      clientName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar contratos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Novo Contrato
        </Button>
      </div>

      {filteredContracts.length === 0 ? (
        <div className="text-center p-8">
          <File className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum contrato encontrado</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Crie um novo contrato para começar.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.title}</TableCell>
                  <TableCell>{getClientName(contract.clientId)}</TableCell>
                  <TableCell>
                    {format(new Date(contract.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={statusColors[contract.status]}
                    >
                      {statusLabels[contract.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewContract(contract)}>
                          <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        {contract.status === 'draft' && (
                          <DropdownMenuItem onClick={() => handleEditContract(contract)}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                        )}
                        {contract.status === 'draft' && (
                          <DropdownMenuItem 
                            onClick={() => {
                              setContractToSend(contract.id);
                              setIsSendDialogOpen(true);
                            }}
                          >
                            <Send className="mr-2 h-4 w-4" /> Enviar para Cliente
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Contract Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Novo Contrato</DialogTitle>
            <DialogDescription>
              Crie um novo contrato para um cliente a partir de um modelo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Título do Contrato</label>
              <Input
                id="title"
                placeholder="Título do contrato"
                value={contractTitle}
                onChange={(e) => setContractTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="template" className="text-sm font-medium">Modelo de Contrato</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  {contractTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="client" className="text-sm font-medium">Cliente</label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.filter(client => client.ativo !== false).map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateContract}>Criar Contrato</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Contract Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Contrato para Cliente</DialogTitle>
            <DialogDescription>
              O contrato será enviado ao cliente via mensagem. Você tem certeza que deseja continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSendContract}>Enviar Contrato</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Contract Dialog */}
      {contractToView && (
        <ContractView
          contract={contractToView}
          client={clients.find(c => c.id === contractToView.clientId)}
          isOpen={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
        />
      )}

      {/* Edit Contract Dialog */}
      {contractToEdit && (
        <ContractEditor
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          contract={contractToEdit}
          onSave={(content) => {
            updateContract(contractToEdit.id, { content });
            setIsEditDialogOpen(false);
            setContractToEdit(null);
          }}
        />
      )}
    </>
  );
};

export default ContractsList;
