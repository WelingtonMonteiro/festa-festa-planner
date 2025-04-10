
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useFestaContext } from "@/contexts/FestaContext";

// Schema de validação
const formSchema = z.object({
  nome: z.string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(50, { message: "O nome não pode ter mais de 50 caracteres" }),
  telefone: z.string()
    .min(8, { message: "O telefone deve ter pelo menos 8 caracteres" }),
  email: z.string()
    .email({ message: "O email deve ser válido" })
    .or(z.literal("")),
  endereco: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface NovoClienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteParaEditar?: {
    id: string;
    nome: string;
    telefone: string;
    email: string;
    endereco?: string;
  };
}

const NovoClienteDialog = ({ 
  open, 
  onOpenChange, 
  clienteParaEditar 
}: NovoClienteDialogProps) => {
  const { adicionarCliente, atualizarCliente } = useFestaContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: clienteParaEditar ? {
      nome: clienteParaEditar.nome,
      telefone: clienteParaEditar.telefone,
      email: clienteParaEditar.email || "",
      endereco: clienteParaEditar.endereco || "",
    } : {
      nome: "",
      telefone: "",
      email: "",
      endereco: "",
    },
  });
  
  function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    try {
      if (clienteParaEditar) {
        // Editar cliente existente
        atualizarCliente(clienteParaEditar.id, values);
        toast({
          title: "Cliente atualizado",
          description: `As informações de ${values.nome} foram atualizadas com sucesso.`,
        });
      } else {
        // Adicionar novo cliente - Ensure all required fields are present
        adicionarCliente({
          nome: values.nome,
          telefone: values.telefone,
          email: values.email || "",
          endereco: values.endereco
        });
        toast({
          title: "Cliente adicionado",
          description: `${values.nome} foi adicionado com sucesso.`,
        });
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o cliente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {clienteParaEditar ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endereco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número, bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-festa-primary hover:bg-festa-primary/90"
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoClienteDialog;
