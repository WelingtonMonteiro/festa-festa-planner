import { useState, useCallback, useEffect } from 'react';
import { useHandleContext } from '@/contexts/handleContext';
import { Contract, ContractTemplate, Client } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, MoreVertical, Eye, Edit, Copy, FileText, Trash, FileCheck } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import ContractEditor from './ContractEditor';
import ContractView from './ContractView';

interface ContractsListProps {
  selectedContract: string | null;
  setSelectedContract: (id: string | null) => void;
}

const statusLabels = {
  'draft': 'Rascunho',
  'sent': 'Enviado',
  'signed': 'Assinado',
  'expired': 'Expirado',
  'cancelled': 'Cancelado'
};

const statusColors = {
  'draft': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  'sent': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  'signed': 'bg-green-100 text-green-800 hover:bg-green-200',
  'expired': 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  'cancelled': 'bg-red-100 text-red-800 hover:bg-red-200'
};

const ContractsList = ({ selectedContract, setSelectedContract }: ContractsListProps) => {
  const { contracts, clients, contractTemplates, addContract, updateContract, removeContract } = useHandleContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newContractTitle, setNewContractTitle] = useState('');
  const [newContractClient, setNewContractClient] = useState('');
  const [newContractTemplate, setNewContractTemplate] = useState('');
  const [contractToEdit, setContractToEdit] = useState<Contract | null>(null);
  const [contractToView, setContractToView] = useState<Contract | null>(null);
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  // Filter contracts whenever contracts array, search query, or status filter changes
  useEffect(() => {
    if (contracts) {
      console.log('ContractsList: Filtrando contratos', contracts.length);
      const filtered = contracts.filter(contract => {
        const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
      setFilteredContracts(filtered);
    }
  }, [contracts, searchQuery, statusFilter]);

  const handleCreateContract = useCallback(async () => {
    if (!newContractTitle.trim()) {
      toast.error('O título do contrato não pode estar vazio');
      return;
    }

    if (!newContractClient) {
      toast.error('Selecione um cliente para o contrato');
      return;
    }

    let content = '<p>Conteúdo do contrato...</p>';
    if (newContractTemplate && newContractTemplate !== 'none') {
      const template = contractTemplates.find(t => t.id === newContractTemplate);
      if (template) {
        content = template.content;
      }
    }

    const contractData = {
      title: newContractTitle.trim(),
      content: content,
      clientId: newContractClient,
      status: 'draft' as const,
      templateId: newContractTemplate !== 'none' ? newContractTemplate : undefined
    };

    try {
      const newContract = await addContract(contractData);
      
      setNewContractTitle('');
      setNewContractClient('');
      setNewContractTemplate('');
      setIsCreateDialogOpen(false);
      
      if (newContract) {
        setSelectedContract(newContract.id);
        setContractToEdit(newContract);
        setIsEditDialogOpen(true);
        setShouldRefresh(true); // Marcar para atualizar após edição
      }
    } catch (error) {
      console.error('Erro ao criar contrato:', error);
      toast.error('Ocorreu um erro ao criar o contrato');
    }
  }, [newContractTitle, newContractClient, newContractTemplate, contractTemplates, addContract, setSelectedContract]);

  const handleViewContract = useCallback((contract: Contract) => {
    setContractToView(contract);
    setSelectedContract(contract.id);
    setIsViewDialogOpen(true);
  }, [setSelectedContract]);

  const handleEditContract = useCallback((contract: Contract) => {
    setContractToEdit(contract);
    setSelectedContract(contract.id);
    setIsEditDialogOpen(true);
  }, [setSelectedContract]);

  const handleDeleteContract = useCallback(async () => {
    if (contractToDelete) {
      try {
        await removeContract(contractToDelete);
        setContractToDelete(null);
        setIsDeleteDialogOpen(false);

        if (selectedContract === contractToDelete) {
          setSelectedContract(null);
        }
      } catch (error) {
        console.error('Erro ao excluir contrato:', error);
        toast.error('Ocorreu um erro ao excluir o contrato');
      }
    }
  }, [contractToDelete, removeContract, selectedContract, setSelectedContract]);

  const handleCopyContract = useCallback(async (contract: Contract) => {
    const copyData = {
      title: `${contract.title} (Cópia)`,
      content: contract.content,
      clientId: contract.clientId,
      status: 'draft' as const
    };

    try {
      await addContract(copyData);
      toast.success(`Contrato "${contract.title}" copiado com sucesso`);
      setShouldRefresh(true); // Marcar para atualizar após cópia
    } catch (error) {
      console.error('Erro ao copiar contrato:', error);
      toast.error('Ocorreu um erro ao copiar o contrato');
    }
  }, [addContract]);

  const handleSaveContract = useCallback(async (content: string) => {
    if (contractToEdit) {
      try {
        await updateContract(contractToEdit.id, { content });
        setIsEditDialogOpen(false);
        setContractToEdit(null);
        toast.success('Contrato salvo com sucesso');
        setShouldRefresh(true); // Marcar para atualizar após salvar
      } catch (error) {
        console.error('Erro ao salvar contrato:', error);
        toast.error('Ocorreu um erro ao salvar o contrato');
      }
    }
  }, [contractToEdit, updateContract]);

  const getClientById = (id: string): Client | undefined => {
    return clients.find(client => client.id === id);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar contratos..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="sent">Enviado</SelectItem>
              <SelectItem value="signed">Assinado</SelectItem>
              <SelectItem value="expired">Expirado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Novo Contrato
        </Button>
      </div>

      {filteredContracts.length === 0 ? (
        <div className="text-center p-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum contrato encontrado</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Crie um novo contrato para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => {
            const client = getClientById(contract.clientId);
            return (
              <Card key={contract.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="w-3/4">
                    <CardTitle className="text-md font-medium truncate">{contract.title}</CardTitle>
                    <CardDescription className="truncate">
                      Cliente: {client?.nome || 'Cliente não encontrado'}
                    </CardDescription>
                  </div>
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
                      <DropdownMenuItem onClick={() => handleCopyContract(contract)}>
                        <Copy className="mr-2 h-4 w-4" /> Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => {
                          setContractToDelete(contract.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="pb-2">
                  <Badge 
                    variant="outline" 
                    className={`${statusColors[contract.status]} cursor-default`}
                  >
                    {statusLabels[contract.status]}
                  </Badge>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    Criado em: {format(new Date(contract.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => handleViewContract(contract)}>
                    <Eye className="mr-2 h-3 w-3" /> Visualizar
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Contrato</DialogTitle>
            <DialogDescription>
              Crie um novo contrato para um cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título do Contrato</Label>
              <Input
                id="title"
                placeholder="Ex: Contrato de Prestação de Serviços"
                value={newContractTitle}
                onChange={(e) => setNewContractTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client">Cliente</Label>
              <Select value={newContractClient} onValueChange={setNewContractClient}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template">Modelo de Contrato (opcional)</Label>
              <Select value={newContractTemplate} onValueChange={setNewContractTemplate}>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem modelo</SelectItem>
                  {contractTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Contrato</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteContract}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {contractToEdit && (
        <ContractEditor
          isOpen={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setContractToEdit(null);
          }}
          contract={contractToEdit}
          onSave={handleSaveContract}
        />
      )}

      {contractToView && (
        <ContractView
          contract={contractToView}
          client={getClientById(contractToView.clientId)}
          isOpen={isViewDialogOpen}
          onOpenChange={(open) => {
            setIsViewDialogOpen(open);
            if (!open) setContractToView(null);
          }}
        />
      )}
    </>
  );
};

export default ContractsList;
