
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
}

interface NotificationsMenuProps {
  notifications: Notification[];
}

const NotificationsMenu = ({ notifications }: NotificationsMenuProps) => {
  const navigate = useNavigate();

  const navigateToNotifications = () => {
    navigate('/notifications');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={(e) => {
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
  );
};

export default NotificationsMenu;
