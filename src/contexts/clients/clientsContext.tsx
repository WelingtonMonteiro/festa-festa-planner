import React, {createContext, useContext} from 'react';
import {Client, Event} from '@/types';
import {toast} from 'sonner';
import {useClientService} from '@/services/entityServices/clientService';
import {useCrud} from '@/hooks/useCrud';

interface ClientsContextType {
    clients: Client[];
    addClients: (client: Omit<Client, 'id' | 'historico'>) => void;
    updateClients: (id: string, client: Partial<Client>) => void;
    removeClients: (id: string) => void;
    total: number;
    page: number;
    limit: number;
    loading: boolean;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    refresh: () => void;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider: React.FC<{
    children: React.ReactNode,
    events: Event[]
}> = ({children, events}) => {
    const crud = useCrud<Client>({
        type: 'apiRest',
        config: {
            apiUrl: import.meta.env.VITE_APP_API_URL || '',
            endpoint: 'clients'
        }
    });

    const clientService = useClientService();

    const adicionarCliente = async (cliente: Omit<Client, 'id' | 'historico'>) => {
        try {
            const novoCliente = await clientService.create({
                ...cliente,
                historico: [],
                ativo: cliente.ativo !== false
            });

            if (novoCliente) {
                crud.refresh();
                toast.success(`${cliente.nome} foi adicionado com sucesso.`);
            }
        } catch (error) {
            console.error('Erro ao adicionar cliente:', error);
            toast.error('Erro ao adicionar cliente');
        }
    };

    const atualizarCliente = async (id: string, clienteAtualizado: Partial<Client>) => {
        try {
            const updated = await clientService.update(id, clienteAtualizado);
            if (updated) {
                crud.refresh();
                toast.success("As informações do cliente foram atualizadas.");
            }
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            toast.error('Erro ao atualizar cliente');
        }
    };

    const excluirCliente = async (id: string) => {
        const clienteComEventos = events.some(e => e.cliente?.id === id);
        if (clienteComEventos) {
            toast.error("Este cliente possui eventos registrados e não pode ser excluído.");
            return;
        }

        try {
            const cliente = crud.data.find(c => c.id === id);
            if (cliente) {
                await clientService.toggleClientStatus(id, false);
                crud.refresh();
                toast.success(`${cliente.nome} foi marcado como inativo com sucesso.`);
            }
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            toast.error('Erro ao excluir cliente');
        }
    };

    return (
        <ClientsContext.Provider value={{
            clients: crud.data,
            addClients: adicionarCliente,
            updateClients: atualizarCliente,
            removeClients: excluirCliente,
            total: crud.total,
            page: crud.page,
            limit: crud.limit,
            loading: crud.loading,
            setPage: (page) => crud.refresh(page, crud.limit),
            setLimit: (limit) => crud.refresh(1, limit),
            refresh: () => crud.refresh()
        }}>
            {children}
        </ClientsContext.Provider>
    );
};

export const useClientsContext = () => {
    const context = useContext(ClientsContext);
    if (context === undefined) {
        throw new Error('useClientsContext must be used within a ClientsProvider');
    }
    return context;
};
