
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useHandleContext } from '@/contexts/handleContext';

interface Notification {
  id: string;
  title: string;
  message: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { events, messages } = useHandleContext();

  useEffect(() => {
    const newNotifications: Notification[] = [];
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    const nextEvents = events?.filter(evento => {
      if (!evento || !evento.data) return false;
      const eventDate = new Date(evento.data);
      return eventDate >= today && eventDate <= threeDaysLater && evento.status !== 'cancelado';
    }) || [];

    nextEvents.forEach(evento => {
      const clientName = evento.cliente && evento.cliente.nome ? evento.cliente.nome : 'Cliente não definido';
      newNotifications.push({
        id: `evento-${evento.id}`,
        title: 'Evento Próximo',
        message: `${clientName} - ${format(new Date(evento.data), 'dd/MM/yyyy')}`
      });
    });

    const unreadMessages = messages?.filter(m => !m.lida && m.remetente === 'cliente') || [];
    if (unreadMessages.length > 0) {
      newNotifications.push({
        id: 'mensagens',
        title: 'Mensagens Não Lidas',
        message: `Você tem ${unreadMessages.length} mensagens não lidas`
      });
    }

    setNotifications(newNotifications);

    const storageNotifications = localStorage.getItem('notificacoes');
    let notificationsToSave = storageNotifications ? JSON.parse(storageNotifications) : [];

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

  return notifications;
};
