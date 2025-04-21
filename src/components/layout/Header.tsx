
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useStorage } from "@/contexts/storageContext";
import { useApi } from "@/contexts/apiContext";
import { useAuth } from '@/contexts/authContext';
import { DataSource } from "@/services/unifiedKitService";
import StorageToggle from '@/components/layout/StorageToggle';
import NotificationsMenu from './header/NotificationsMenu';
import UserMenu from './header/UserMenu';
import StorageModeIndicator from './header/StorageModeIndicator';
import { useNotifications } from '@/hooks/useNotifications';

const Header = () => {
  const { storageType } = useStorage();
  const { apiType, apiUrl } = useApi();
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  const { logout } = useAuth();
  const notifications = useNotifications();

  const formattedDate = format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end bg-sidebar px-6 shadow-sm text-sidebar-foreground">
      <div className="mr-auto">
        <h2 className="text-xl font-medium capitalize">{formattedDate}</h2>
        <div className="flex items-center gap-2">
          <StorageModeIndicator dataSource={dataSource} apiUrl={apiUrl} />
          <StorageToggle />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationsMenu notifications={notifications} />
        <UserMenu onLogout={handleLogout} />
      </div>
    </header>
  );
};

export default Header;
