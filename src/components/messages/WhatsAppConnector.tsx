
import { useState } from 'react';
import { QrCode, Phone, RefreshCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { whatsappApiService } from '@/services/apiServices/whatsappApiService';
import { useHandleContext } from "@/contexts/handleContext";
import { toast } from "sonner";

interface WhatsAppConnectorProps {
  isConnected: boolean;
  onConnectionChange: (connected: boolean) => void;
}

const WhatsAppConnector = ({ isConnected, onConnectionChange }: WhatsAppConnectorProps) => {
  const { apiUrl } = useHandleContext();

  const handleConnect = () => {
    if (!apiUrl) {
      toast.error('URL da API não configurada');
      return;
    }
    
    // Abrir modal para escanear QR code
    const qrCodeModalOpen = true;
    // Esta parte será implementada no componente Messages.tsx
  };
  
  const handleDisconnect = async () => {
    if (!apiUrl) {
      toast.error('URL da API não configurada');
      return;
    }
    
    const result = await whatsappApiService.disconnect(apiUrl);
    if (result) {
      onConnectionChange(false);
      toast.success('WhatsApp desconectado com sucesso');
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={isConnected ? handleDisconnect : handleConnect}
      className="flex items-center gap-2"
    >
      {isConnected ? (
        <>
          <Phone className="h-4 w-4" />
          WhatsApp Conectado
        </>
      ) : (
        <>
          <QrCode className="h-4 w-4" />
          Conectar WhatsApp
        </>
      )}
    </Button>
  );
};

export default WhatsAppConnector;
