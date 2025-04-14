
import { toast } from "sonner";

export const whatsappApiService = {
  async getQRCode(apiUrl: string): Promise<string | null> {
    try {
      const response = await fetch(`${apiUrl}/whatsapp/qrcode`);
      
      if (!response.ok) {
        throw new Error(`Erro ao gerar QR code: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.qrCodeUrl;
    } catch (error) {
      console.error('Falha ao gerar QR code do WhatsApp:', error);
      toast.error('Falha ao gerar QR code do WhatsApp');
      return null;
    }
  },
  
  async checkConnection(apiUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${apiUrl}/whatsapp/status`);
      
      if (!response.ok) {
        throw new Error(`Erro ao verificar status do WhatsApp: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.connected;
    } catch (error) {
      console.error('Falha ao verificar status de conexão do WhatsApp:', error);
      toast.error('Falha ao verificar conexão com WhatsApp');
      return false;
    }
  },
  
  async disconnect(apiUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${apiUrl}/whatsapp/disconnect`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao desconectar WhatsApp: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Falha ao desconectar WhatsApp:', error);
      toast.error('Falha ao desconectar WhatsApp');
      return false;
    }
  },
  
  async sendMessage(apiUrl: string, to: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(`${apiUrl}/whatsapp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, message }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao enviar mensagem: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Falha ao enviar mensagem pelo WhatsApp:', error);
      toast.error('Falha ao enviar mensagem pelo WhatsApp');
      return false;
    }
  }
};
