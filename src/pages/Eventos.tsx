
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFestaContext } from '@/contexts/FestaContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EventosManagement from '@/components/eventos/EventosManagement';

const Eventos = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Eventos</h2>
        <p className="text-muted-foreground">
          Gerencie os eventos da sua empresa, atualize status e navegue pelo calendário
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Todos os Eventos</CardTitle>
          <CardDescription>Visualize e gerencie todos os eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <EventosManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default Eventos;
