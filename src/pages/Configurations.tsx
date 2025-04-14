
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, MessageSquare, User } from "lucide-react";
import IntegrationSettings from '@/components/settings/IntegrationSettings';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettingsContext } from '@/contexts/settings/settingsContext';
import { FormField, FormControl, FormLabel, Form, FormItem } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const Configurations = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { users, setApiUrl } = useSettingsContext();

  const form = useForm({
    defaultValues: {
      darkMode: false,
      notifications: true,
      marketingEmails: false
    }
  });

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
            <Form {...form}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Modo Escuro</Label>
                    <div className="text-sm text-muted-foreground">
                      Ativar tema escuro para a interface
                    </div>
                  </div>
                  <Switch id="dark-mode" checked={form.watch('darkMode')} onCheckedChange={(checked) => form.setValue('darkMode', checked)} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notificações</Label>
                    <div className="text-sm text-muted-foreground">
                      Receber notificações do sistema
                    </div>
                  </div>
                  <Switch id="notifications" checked={form.watch('notifications')} onCheckedChange={(checked) => form.setValue('notifications', checked)} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing">E-mails de Marketing</Label>
                    <div className="text-sm text-muted-foreground">
                      Receber atualizações e promoções
                    </div>
                  </div>
                  <Switch id="marketing" checked={form.watch('marketingEmails')} onCheckedChange={(checked) => form.setValue('marketingEmails', checked)} />
                </div>
              </div>
            </Form>
          </div>
        </TabsContent>
        
        <TabsContent value="integrations">
          <IntegrationSettings />
        </TabsContent>
        
        <TabsContent value="user">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-medium mb-4">Configurações de Usuário</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <div className="text-sm py-2 border px-3 rounded-md bg-muted/50">
                    {users.nome || 'Não configurado'}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <div className="text-sm py-2 border px-3 rounded-md bg-muted/50">
                    {users.email || 'Não configurado'}
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="text-sm py-2 border px-3 rounded-md bg-muted/50">
                    {users.telefone || 'Não configurado'}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t mt-6">
                <h3 className="font-medium mb-4">Preferências de Privacidade</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Compartilhar dados de uso</p>
                      <p className="text-sm text-muted-foreground">
                        Ajude-nos a melhorar o sistema compartilhando dados anônimos de uso
                      </p>
                    </div>
                    <Switch id="share-usage" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cookies de análise</p>
                      <p className="text-sm text-muted-foreground">
                        Permitir cookies para análise de comportamento no site
                      </p>
                    </div>
                    <Switch id="analytics-cookies" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configurations;
