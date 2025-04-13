
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHandleContext } from '@/contexts/handleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import EventsManagement from '@/components/events/EventsManagement.tsx';

const Eventos = () => {
  const navigate = useNavigate();
  
  const handleCadastrarEvento = () => {
    navigate('/calendar', { state: { showNovoEventoDialog: true } });
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Eventos</h2>
          <p className="text-muted-foreground">
            Gerencie os eventos da sua empresa, atualize status e navegue pelo calendário
          </p>
        </div>
        
        <Button 
          onClick={handleCadastrarEvento} 
          className="bg-festa-primary hover:bg-festa-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Cadastrar Evento
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Todos os Eventos</CardTitle>
          <CardDescription>Visualize e gerencie todos os eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <EventsManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default Eventos;
