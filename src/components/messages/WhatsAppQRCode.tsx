
import { useState, useEffect } from 'react';
import { QrCode, RefreshCcw, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { whatsappApiService } from '@/services/apiServices/whatsappApiService';
import { useHandleContext } from "@/contexts/handleContext";
import { toast } from "sonner";

interface WhatsAppQRCodeProps {
  isOpen: boolean;
  onClose: () => void;
}

const WhatsAppQRCode = ({ isOpen, onClose }: WhatsAppQRCodeProps) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { apiUrl } = useHandleContext();
  
  useEffect(() => {
    if (isOpen) {
      checkStatus();
      if (!isConnected) {
        generateQRCode();
      }
    }
  }, [isOpen]);
  
  const checkStatus = async () => {
    if (!apiUrl) {
      toast.error('URL da API não configurada');
      return;
    }
    
    setIsLoading(true);
    const connected = await whatsappApiService.checkConnection(apiUrl);
    setIsConnected(connected);
    setIsLoading(false);
    
    if (connected) {
      toast.success('WhatsApp já está conectado');
    }
  };
  
  const generateQRCode = async () => {
    if (!apiUrl) {
      toast.error('URL da API não configurada');
      return;
    }
    
    setIsLoading(true);
    const qrCodeUrl = await whatsappApiService.getQRCode(apiUrl);
    setQrCode(qrCodeUrl);
    setIsLoading(false);
  };
  
  const disconnect = async () => {
    if (!apiUrl) {
      toast.error('URL da API não configurada');
      return;
    }
    
    setIsLoading(true);
    const result = await whatsappApiService.disconnect(apiUrl);
    if (result) {
      setIsConnected(false);
      setQrCode(null);
      toast.success('WhatsApp desconectado com sucesso');
    }
    setIsLoading(false);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Conectar ao WhatsApp</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
            </div>
          ) : isConnected ? (
            <div className="text-center py-6">
              <div className="bg-green-100 text-green-700 rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center mb-2">
                <QrCode />
              </div>
              <p className="font-medium">WhatsApp conectado</p>
              <p className="text-sm text-muted-foreground mb-4">
                Seu WhatsApp está conectado e pronto para receber mensagens.
              </p>
              <Button variant="destructive" onClick={disconnect}>
                Desconectar
              </Button>
            </div>
          ) : qrCode ? (
            <div className="text-center py-2">
              <p className="text-sm mb-3">
                Escaneie o código QR com seu WhatsApp para conectar:
              </p>
              <div className="bg-white p-2 border rounded-md mx-auto w-64 h-64 flex items-center justify-center mb-4">
                <img src={qrCode} alt="WhatsApp QR Code" className="max-w-full max-h-full" />
              </div>
              <div className="text-xs text-muted-foreground mb-4">
                Abra o WhatsApp no seu celular, vá em Configurações {'>'} Dispositivos Conectados {'>'} Vincular um dispositivo
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
                onClick={generateQRCode}
              >
                <RefreshCcw className="h-4 w-4 mr-1" />
                Gerar novo código
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="bg-blue-100 text-blue-700 rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center mb-2">
                <QrCode />
              </div>
              <p className="font-medium">Conectar ao WhatsApp</p>
              <p className="text-sm text-muted-foreground mb-4">
                Clique no botão abaixo para gerar um código QR que você poderá escanear com o seu WhatsApp.
              </p>
              <Button onClick={generateQRCode}>
                Gerar código QR
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppQRCode;
