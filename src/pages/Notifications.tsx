import { useState, useEffect } from 'react';
import { useHandleContext } from "@/contexts";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'event' | 'message' | 'system';
  eventId?: string;
  messageId?: string;
};

const Notifications = () => {
  const { events: events, messages: messages } = useHandleContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const newNotifications: Notification[] = [];
    
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.data);
      return eventDate >= today && eventDate <= threeDaysLater && event.status !== 'cancelado';
    });
    
    upcomingEvents.forEach(event => {
      newNotifications.push({
        id: `event-${event.id}`,
        title: 'Upcoming Event',
        message: `${event.cliente.nome} - ${format(new Date(event.data), 'dd/MM/yyyy')}`,
        date: new Date().toISOString(),
        read: false,
        type: 'event',
        eventId: event.id
      });
    });
    
    const unreadMessages = messages.filter(m => !m.lida && m.remetente === 'cliente');
    unreadMessages.forEach(message => {
      newNotifications.push({
        id: `message-${message.id}`,
        title: 'Unread Message',
        message: message.conteudo,
        date: message.datahora,
        read: false,
        type: 'message',
        messageId: message.id
      });
    });
    
    const storedNotifications = localStorage.getItem('notifications');
    const existingNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
    
    const allNotifications = [...existingNotifications, ...newNotifications];
    
    const uniqueNotifications = Array.from(
      new Map(allNotifications.map(item => [item.id, item])).values()
    );
    
    uniqueNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setNotifications(uniqueNotifications);
    localStorage.setItem('notifications', JSON.stringify(uniqueNotifications));
  }, [events, messages]);
  
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'read') return notification.read;
    if (filter === 'unread') return !notification.read;
    return true;
  });
  
  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };
  
  const openDetails = (notification: Notification) => {
    markAsRead(notification.id);
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };
  
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground">
          Manage all your notifications in one place
        </p>
      </div>
      
      <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          {renderNotifications(filteredNotifications, openDetails)}
        </TabsContent>
        
        <TabsContent value="unread" className="mt-0">
          {renderNotifications(filteredNotifications, openDetails)}
        </TabsContent>
        
        <TabsContent value="read" className="mt-0">
          {renderNotifications(filteredNotifications, openDetails)}
        </TabsContent>
      </Tabs>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
            <DialogDescription>
              {selectedNotification && format(new Date(selectedNotification.date), 
                "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
              }
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 pt-0">
            <p className="text-base">{selectedNotification?.message}</p>
            
            {selectedNotification?.type === 'event' && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  This notification is related to an upcoming event.
                </p>
                <Button 
                  className="mt-2"
                  onClick={() => {
                    setIsModalOpen(false);
                    window.location.href = `/eventos?id=${selectedNotification.eventId}`;
                  }}
                >
                  View Event
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const renderNotifications = (
  notifications: Notification[], 
  openDetails: (notification: Notification) => void
) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No notifications found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`p-4 rounded-lg border cursor-pointer transition-colors
            ${notification.read 
              ? 'bg-background hover:bg-accent/50' 
              : 'bg-accent/20 hover:bg-accent/30 font-medium'
            }`}
          onClick={() => openDetails(notification)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{notification.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs text-muted-foreground">
                {format(new Date(notification.date), 'dd/MM/yyyy')}
              </span>
              {!notification.read && (
                <Badge variant="secondary" className="bg-festa-secondary text-white">New</Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
