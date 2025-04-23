
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch"; 
import { toast } from "@/components/ui/use-toast";
import { useHandleContext } from "@/contexts/handleContext.tsx";

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
  ativo: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface NewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editClient?: {
    id: string;
    nome: string;
    telefone: string;
    email: string;
    endereco?: string;
    ativo?: boolean;
  };
}

const NewClientDialog = ({
  open, 
  onOpenChange, 
  editClient
}: NewClientDialogProps) => {
  const { addClients, updateClients } = useHandleContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      email: "",
      endereco: "",
      ativo: true,
    },
  });
  
  // Atualizar os valores do formulário quando o clienteParaEditar mudar
  useEffect(() => {
    if (editClient) {
      form.reset({
        nome: editClient.nome,
        telefone: editClient.telefone,
        email: editClient.email || "",
        endereco: editClient.endereco || "",
        ativo: editClient.ativo !== false, // Se for undefined, considera como true
      });
    } else {
      form.reset({
        nome: "",
        telefone: "",
        email: "",
        endereco: "",
        ativo: true,
      });
    }
  }, [editClient, form]);
  
  function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    try {
      if (editClient) {
        // Editar cliente existente
        updateClients(editClient.id, values);
        toast({
          title: "Cliente atualizado",
          description: `As informações de ${values.nome} foram atualizadas com sucesso.`,
        });
      } else {
        // Adicionar novo cliente - Ensure all required fields are present
        addClients({
          nome: values.nome,
          telefone: values.telefone,
          email: values.email || "",
          endereco: values.endereco,
          ativo: values.ativo,
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
            {editClient ? "Editar Cliente" : "Novo Cliente"}
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
            
            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Status do Cliente
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value ? "Cliente ativo" : "Cliente inativo"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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

export default NewClientDialog;
