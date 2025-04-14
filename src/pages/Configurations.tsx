import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, MessageSquare, User } from "lucide-react";
import IntegrationSettings from '@/components/settings/IntegrationSettings';

const Configurations = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema
        </p>
      </div>
      
      <Tabs 
        defaultValue="general" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Geral
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Integrações
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Usuário
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-medium mb-4">Configurações Gerais</h2>
            {/* Conteúdo das configurações gerais */}
            <p>Configurações gerais do sistema estarão disponíveis em breve.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="integrations">
          <IntegrationSettings />
        </TabsContent>
        
        <TabsContent value="user">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-medium mb-4">Configurações de Usuário</h2>
            {/* Conteúdo das configurações de usuário */}
            <p>Configurações de usuário estarão disponíveis em breve.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configurations;
