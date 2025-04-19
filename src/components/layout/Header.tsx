
import { useEffect, useState } from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useHandleContext } from '@/contexts/handleContext.tsx';
import StorageToggle from '@/components/layout/StorageToggle';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import {DataSource} from "@/services/unifiedKitService.ts";
import {useStorage} from "@/contexts/storageContext.tsx";
import {useApi} from "@/contexts/apiContext.tsx";

const Header = () => {
  const { storageType } = useStorage();
  const { apiType, apiUrl } = useApi();
  const { events, messages } = useHandleContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notifications, setNotifications] = useState<{ id: string, title: string, message: string }[]>([]);
  const navigate = useNavigate();

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

    // Verificar events próximos (nos próximos 3 dias)
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    // Filtrar eventos válidos - verificando se o evento e o cliente existem antes de acessar propriedades
    const nextEvents = events?.filter(evento => {
      if (!evento || !evento.data) return false;

      const eventDate = new Date(evento.data);
      return eventDate >= today && eventDate <= threeDaysLater && evento.status !== 'cancelado';
    }) || [];

    nextEvents.forEach(evento => {
      // Verificar se o cliente existe antes de acessar a propriedade nome
      const clientName = evento.cliente && evento.cliente.nome ? evento.cliente.nome : 'Cliente não definido';

      newNotifications.push({
        id: `evento-${evento.id}`,
        title: 'Evento Próximo',
        message: `${clientName} - ${format(new Date(evento.data), 'dd/MM/yyyy')}`
      });
    });

    // Adicionar mensagens não lidas
    const unreadMessages = messages?.filter(m => !m.lida && m.remetente === 'cliente') || [];
    if (unreadMessages.length > 0) {
      newNotifications.push({
        id: 'mensagens',
        title: 'Mensagens Não Lidas',
        message: `Você tem ${unreadMessages.length} mensagens não lidas`
      });
    }

    setNotifications(newNotifications);

    // Salvar notificações no localStorage
    const storageNotifications = localStorage.getItem('notificacoes');
    let notificationsToSave = storageNotifications ? JSON.parse(storageNotifications) : [];

    // Adicionar novas notificações do sistema se não existirem já
    newNotifications.forEach(notification => {
      const existsInStorage = notificationsToSave.some((n: any) => n.id === notification.id);
      if (!existsInStorage) {
        notificationsToSave.push({
          id: notification.id,
          titulo: notification.title,
          mensagem: notification.message,
          data: new Date().toISOString(),
          lida: false,
          tipo: notification.id.startsWith('evento-') ? 'evento' : 'mensagem',
          eventoId: notification.id.startsWith('evento-') ? notification.id.replace('evento-', '') : undefined,
          mensagemId: notification.id === 'mensagens' ? undefined : undefined
        });
      }
    });

    localStorage.setItem('notificacoes', JSON.stringify(notificationsToSave));
  }, [events, messages]);

  // Redirecionar para a página de notificações
  const navigateToNotifications = () => {
    navigate('/notifications');
  };
  const getCurrentDataSource = (): DataSource => {
    if (apiType === 'rest' && apiUrl) {
      return 'apiRest';
    } else if (storageType === 'supabase') {
      return 'supabase';
    } else {
      return 'localStorage';
    }
  };
  const dataSource = getCurrentDataSource();

  const StorageModeIndicator = () => {
    let label = 'Local Storage';
    let description = apiUrl || '';

    if (dataSource === 'supabase') {
      label = 'Supabase';
    } else if (dataSource === 'apiRest') {
      label = 'API REST';
    }

    return (
        <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-md">
          {label}{description ? `: ${description}` : ''}
        </div>
    );
  };

  return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-end bg-sidebar px-6 shadow-sm text-sidebar-foreground">
        <div className="mr-auto">
          <h2 className="text-xl font-medium capitalize">{formattedDate}</h2>
          <div className="flex items-center gap-2">
            <StorageModeIndicator />
            <StorageToggle />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notificações */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={(e) => {
                    // Se clicar direto no ícone ou no badge, navega para notificações
                    // Se clicar fora (no botão em geral), abre o dropdown
                    if ((e.target as HTMLElement).tagName === 'svg' ||
                        (e.target as HTMLElement).tagName === 'path' ||
                        (e.target as HTMLElement).classList.contains('absolute')) {
                      e.preventDefault();
                      navigateToNotifications();
                    }
                  }}
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                    <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-festa-secondary" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex justify-between items-center p-2">
                <span className="font-medium">Notificações</span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToNotifications();
                    }}
                >
                  Ver todas
                </Button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <DropdownMenuItem
                            key={notification.id}
                            className="flex flex-col items-start p-3 cursor-pointer"
                            onClick={() => navigateToNotifications()}
                        >
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
              <DropdownMenuItem onClick={() => navigate('/settings?tab=conta')}>
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
  );
};

export default Header;
