
import { useState } from 'react';
import { useFestaContext } from "@/contexts/FestaContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Mensagens = () => {
  const { mensagens, eventos, clientes } = useFestaContext();
  const [filtro, setFiltro] = useState<'todas' | 'nao-lidas' | 'lidas'>('todas');
  
  const mensagensFiltradas = mensagens.filter(mensagem => {
    if (filtro === 'todas') return true;
    if (filtro === 'nao-lidas') return !mensagem.lida;
    if (filtro === 'lidas') return mensagem.lida;
    return true;
  });
  
  // Função para obter nome do cliente com base no ID do cliente
  const obterNomeCliente = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente';
  };
  
  // Função auxiliar para formatar data
  const formatarData = (data: string) => {
    return format(new Date(data), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };
  
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mensagens</h1>
        <p className="text-muted-foreground">
          Gerencie suas mensagens com clientes e fornecedores
        </p>
      </div>
      
      <Tabs defaultValue="todas" onValueChange={(value) => setFiltro(value as any)}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="nao-lidas">Não lidas</TabsTrigger>
            <TabsTrigger value="lidas">Lidas</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="todas" className="mt-0">
          {renderMensagens(mensagensFiltradas, obterNomeCliente, formatarData)}
        </TabsContent>
        
        <TabsContent value="nao-lidas" className="mt-0">
          {renderMensagens(mensagensFiltradas, obterNomeCliente, formatarData)}
        </TabsContent>
        
        <TabsContent value="lidas" className="mt-0">
          {renderMensagens(mensagensFiltradas, obterNomeCliente, formatarData)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Função auxiliar para renderizar a lista de mensagens
const renderMensagens = (
  mensagens: any[], 
  obterNomeCliente: (clienteId: string) => string,
  formatarData: (data: string) => string
) => {
  if (mensagens.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma mensagem encontrada</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {mensagens.map(mensagem => (
        <div 
          key={mensagem.id} 
          className={`p-4 rounded-lg border 
            ${mensagem.lida 
              ? 'bg-background' 
              : 'bg-accent/20 font-medium'
            }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {mensagem.remetente === 'cliente' 
                  ? obterNomeCliente(mensagem.clienteId)
                  : 'Você'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {formatarData(mensagem.datahora)}
              </p>
            </div>
          </div>
          <p className="mt-2">{mensagem.conteudo}</p>
        </div>
      ))}
    </div>
  );
};

export default Mensagens;
