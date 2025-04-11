
import { Info, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface AboutSystemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutSystemDialog({ open, onOpenChange }: AboutSystemDialogProps) {
  // Sistema Info
  const sistemaInfo = {
    versao: "1.0.0",
    ultimaAtualizacao: "2025-04-11",
    desenvolvedor: "Festa App",
    contato: "suporte@festaapp.com"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Informações do Sistema
          </DialogTitle>
          <DialogDescription>
            Detalhes sobre a versão e configurações do sistema
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium">Versão:</span>
              <span className="text-sm text-muted-foreground">{sistemaInfo.versao}</span>
            </div>
            <Separator />
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium">Última Atualização:</span>
              <span className="text-sm text-muted-foreground">{sistemaInfo.ultimaAtualizacao}</span>
            </div>
            <Separator />
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium">Desenvolvedor:</span>
              <span className="text-sm text-muted-foreground">{sistemaInfo.desenvolvedor}</span>
            </div>
            <Separator />
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium">Contato:</span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> {sistemaInfo.contato}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
