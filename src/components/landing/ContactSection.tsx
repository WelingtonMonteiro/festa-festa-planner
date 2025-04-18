
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export const ContactSection = () => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de envio do formulário
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Entre em Contato</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tem alguma dúvida ou quer saber mais sobre como a Festana pode ajudar seu negócio?
            Entre em contato conosco!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome
                  </label>
                  <Input
                    id="name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-medium">
                    E-mail
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Mensagem
                </label>
                <Textarea
                  id="message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Como podemos ajudar?"
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Enviar Mensagem</Button>
            </form>
          </div>
          <div className="space-y-10">
            <div>
              <h3 className="text-xl font-medium mb-4">Informações de Contato</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:contato@festana.com.br" className="text-muted-foreground hover:text-primary transition-colors">
                      contato@festana.com.br
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <a href="tel:+551199998888" className="text-muted-foreground hover:text-primary transition-colors">
                      (11) 9999-8888
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Endereço</p>
                    <address className="not-italic text-muted-foreground">
                      Av. Paulista, 1000<br />
                      São Paulo, SP<br />
                      CEP: 01311-000
                    </address>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Horário de Atendimento</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span>Segunda - Sexta:</span> 
                  <span className="text-muted-foreground">9h às 18h</span>
                </p>
                <p className="flex justify-between">
                  <span>Sábado:</span> 
                  <span className="text-muted-foreground">9h às 13h</span>
                </p>
                <p className="flex justify-between">
                  <span>Domingo:</span> 
                  <span className="text-muted-foreground">Fechado</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
