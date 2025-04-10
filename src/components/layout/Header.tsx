
import { useEffect, useState } from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useFestaContext } from '@/contexts/FestaContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Header = () => {
  const { eventos, mensagens } = useFestaContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notifications, setNotifications] = useState<{ id: string, title: string, message: string }[]>([]);
  
  // Formatar data atual
  const formattedDate = format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  // Atualizar data a cada minuto
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  // Gerar notificações
  useEffect(() => {
    const newNotifications = [];
    
    // Verificar eventos próximos (nos próximos 3 dias)
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    
    const eventosProximos = eventos.filter(evento => {
      const dataEvento = new Date(evento.data);
      return dataEvento >= today && dataEvento <= threeDaysLater && evento.status !== 'cancelado';
    });
    
    eventosProximos.forEach(evento => {
      newNotifications.push({
        id: `evento-${evento.id}`,
        title: 'Evento Próximo',
        message: `${evento.cliente.nome} - ${format(new Date(evento.data), 'dd/MM/yyyy')}`
      });
    });
    
    // Adicionar mensagens não lidas
    const mensagensNaoLidas = mensagens.filter(m => !m.lida && m.remetente === 'cliente');
    if (mensagensNaoLidas.length > 0) {
      newNotifications.push({
        id: 'mensagens',
        title: 'Mensagens Não Lidas',
        message: `Você tem ${mensagensNaoLidas.length} mensagens não lidas`
      });
    }
    
    setNotifications(newNotifications);
  }, [eventos, mensagens]);
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end bg-white px-6 shadow-sm">
      <div className="mr-auto">
        <h2 className="text-xl font-medium capitalize">{formattedDate}</h2>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-festa-secondary" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 font-medium">Notificações</div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-muted-foreground">{notification.message}</div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-3 text-center text-muted-foreground">
                  Nenhuma notificação
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Perfil do usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Meu Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
