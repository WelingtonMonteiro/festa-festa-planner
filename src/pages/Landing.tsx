import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, Layout, MessageSquare, Settings, Smartphone, Users, Mail, Phone, MapPin } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import LoginHeader from '@/components/landing/LoginHeader';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { planService } from '@/services/planService';
import { formatCurrency } from '@/utils/format';
import Switch from '@/components/ui/switch';

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would validate credentials
    // For now, we'll just navigate to the dashboard
    navigate('/dashboard');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de envio do formulário
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  const handlePlanSelection = (planName: string) => {
    setSelectedPlan(planName);
    setLoginModalOpen(true);
  };

  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Gestão de Eventos",
      description: "Agende e gerencie todos os seus eventos em um só lugar com nosso calendário intuitivo."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Gestão de Clientes",
      description: "Acompanhe todos os seus clientes, suas preferências e histórico."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Mensagens",
      description: "Comunique-se com os clientes diretamente através do nosso sistema integrado de mensagens."
    },
    {
      icon: <Layout className="h-10 w-10 text-primary" />,
      title: "Temas Personalizados",
      description: "Escolha entre uma variedade de temas e kits para os seus eventos."
    },
    {
      icon: <Settings className="h-10 w-10 text-primary" />,
      title: "Relatórios e Análises",
      description: "Obtenha insights detalhados sobre o desempenho do seu negócio."
    },
    {
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      title: "Acesso Mobile",
      description: "Acesse seu planejador de eventos em qualquer dispositivo, a qualquer hora, em qualquer lugar."
    }
  ];

  const testimonials = [
    {
      quote: "Este sistema de planejamento de eventos transformou a maneira como gerencio meu negócio. Agora posso lidar com o dobro de eventos com metade do estresse.",
      author: "Sarah Johnson, Planejadora de Eventos"
    },
    {
      quote: "Os recursos de gerenciamento de clientes por si só já valem o investimento. Meus clientes adoram como os eventos deles estão organizados agora.",
      author: "Miguel Rodriguez, Coordenador de Festas"
    },
    {
      quote: "Eu costumava gastar horas em tarefas administrativas. Agora posso me concentrar no que importa - criar eventos incríveis para meus clientes.",
      author: "Ana Chen, Planejadora de Casamentos"
    }
  ];

  const teamMembers = [
    {
      name: "Maria Silva",
      role: "CEO e Fundadora",
      bio: "Com mais de 15 anos de experiência em planejamento de eventos, Maria fundou a Festana para ajudar outros profissionais a escalar seus negócios.",
      photo: "/placeholder.svg"
    },
    {
      name: "João Pereira",
      role: "CTO",
      bio: "Especialista em tecnologia com paixão por criar soluções que simplificam a vida de organizadores de eventos.",
      photo: "/placeholder.svg"
    },
    {
      name: "Ana Oliveira",
      role: "Head de Sucesso do Cliente",
      bio: "Dedicada a garantir que todos os clientes da Festana maximizem o potencial da plataforma.",
      photo: "/placeholder.svg"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "R$29,90",
      period: "/mês",
      description: "Perfeito para profissionais individuais",
      features: [
        "Até 15 eventos por mês",
        "Até 50 clientes",
        "Gerenciamento de Temas e Kits",
        "Gerenciamento de calendário",
        "Suporte por email"
      ]
    },
    {
      name: "Básico",
      price: "R$99",
      period: "/mês",
      description: "Perfeito para profissionais individuais",
      features: [        
        "Até 30 eventos por mês",
        "Gerenciamento de Clientes",
        "Gerenciamento de Temas e Kits",
        "Financeiro",
        "Gerenciamento de calendário",
        "Suporte por email"
      ]
    },
    {
      name: "Profissional",
      price: "R$199",
      period: "/mês",
      description: "Ideal para empresas em crescimento",
      features: [
        "Eventos ilimitados",
        "Clientes ilimitados",
        "Gerenciamento de equipe",
        "Suporte prioritário",
        "Relatórios avançados"
      ],
      highlighted: true
    },
    {
      name: "Empresarial",
      price: "R$399",
      period: "/mês",
      description: "Para grandes operações",
      features: [
        "Tudo do plano Profissional",
        "API personalizada",
        "Gerenciador de conta dedicado",
        "Treinamento personalizado",
        "Integrações avançadas"
      ]
    }
  ];

  const { data: plans = [] } = useQuery({
    queryKey: ['active-plans'],
    queryFn: planService.getActivePlans
  });

  const pricingSection = (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos Simples e Transparentes</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Escolha o plano que melhor se adapta ao tamanho do seu negócio e necessidades
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${billingInterval === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Mensal
            </span>
            <Switch
              checked={billingInterval === 'yearly'}
              onCheckedChange={(checked) => setBillingInterval(checked ? 'yearly' : 'monthly')}
              className="data-[state=checked]:bg-primary"
            />
            <span className="inline-flex items-center gap-1">
              <span className={`text-sm font-medium ${billingInterval === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Anual
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                17% OFF
              </span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={plan.id} className={`border ${index === 1 ? 'border-primary shadow-lg' : 'shadow-md'}`}>
              <CardHeader className={`pb-8 ${index === 1 ? 'bg-primary/10' : ''}`}>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription className="mt-2">
                  <span className="text-3xl font-bold">
                    {formatCurrency(billingInterval === 'yearly' ? plan.price_yearly : plan.price_monthly)}
                  </span>
                  <span className="text-muted-foreground">/{billingInterval === 'yearly' ? 'ano' : 'mês'}</span>
                  <p className="mt-2">{plan.description}</p>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${index === 1 ? '' : 'bg-muted-foreground hover:bg-muted-foreground/80'}`}
                  onClick={() => handlePlanSelection(plan.name)}
                >
                  {index === 1 ? 'Começar Agora' : 'Escolher Plano'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header com opção de login */}
      <LoginHeader onLoginClick={() => setLoginModalOpen(true)} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-festa-primary/10 via-background to-festa-secondary/10 py-20">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Simplifique seu <span className="bg-gradient-to-r from-festa-primary via-festa-secondary to-festa-accent text-transparent bg-clip-text">Negócio de Eventos</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              A plataforma completa para organizadores de eventos gerenciarem clientes, eventos, inventário e finanças em um só lugar.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => setLoginModalOpen(true)}
              >
                Começar Agora
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Saiba Mais
              </Button>
            </div>
          </div>
          <div className="flex-1 relative min-h-[400px] w-full rounded-lg overflow-hidden shadow-xl border">
            <img 
              src="/placeholder.svg" 
              alt="Prévia do Dashboard" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
              <div className="p-4 text-white">
                <p className="text-sm font-medium">Visão Geral do Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo o que Você Precisa para Gerenciar seu Negócio
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nossa plataforma fornece todas as ferramentas necessárias para gerenciar eventos com eficiência e expandir seu negócio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Carousel */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Veja Nossa Plataforma em Ação</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Confira algumas das principais características e interfaces do nosso sistema de planejamento de eventos.
            </p>
          </div>
          
          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              <CarouselItem>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl border shadow-lg">
                    <img src="/placeholder.svg" alt="Visualização de Calendário" className="w-full aspect-video object-cover" />
                    <div className="p-4 bg-card">
                      <h3 className="font-medium text-lg">Gerenciamento de Calendário</h3>
                      <p className="text-muted-foreground">Visualize e gerencie todos os seus eventos em uma interface intuitiva de calendário.</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl border shadow-lg">
                    <img src="/placeholder.svg" alt="Dashboard de Clientes" className="w-full aspect-video object-cover" />
                    <div className="p-4 bg-card">
                      <h3 className="font-medium text-lg">Dashboard de Clientes</h3>
                      <p className="text-muted-foreground">Acompanhe todas as informações dos clientes, preferências e histórico.</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl border shadow-lg">
                    <img src="/placeholder.svg" alt="Seleç��o de Temas" className="w-full aspect-video object-cover" />
                    <div className="p-4 bg-card">
                      <h3 className="font-medium text-lg">Seleção de Temas</h3>
                      <p className="text-muted-foreground">Navegue e selecione entre múltiplos temas e kits para festas.</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious className="relative -left-0 top-0 translate-y-0" />
              <CarouselNext className="relative -right-0 top-0 translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por Que Escolher Nossa Plataforma?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Veja por que organizadores de eventos confiam em nosso sistema para gerenciar seus negócios.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Economia de Tempo</h3>
                <p className="text-muted-foreground">Economize até 15 horas por semana em tarefas administrativas e coordenação de eventos.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Aumento de Receita</h3>
                <p className="text-muted-foreground">Em média, nossos usuários relatam um aumento de 30% na capacidade de negócios e receita.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Satisfação do Cliente</h3>
                <p className="text-muted-foreground">Melhor organização leva a clientes mais satisfeitos e mais indicações.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Solução Completa</h3>
                <p className="text-muted-foreground">Todas as suas ferramentas em um só lugar, em vez de lidar com vários sistemas de software.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Segurança de Dados</h3>
                <p className="text-muted-foreground">Seus dados de negócios e de clientes são armazenados e backupeados de forma segura.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Sempre Disponível</h3>
                <p className="text-muted-foreground">Acesse seu sistema de gerenciamento de eventos 24/7 de qualquer dispositivo, em qualquer lugar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {pricingSection}

      {/* About Us Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sobre a Festana</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Conheça nossa história e a equipe por trás da plataforma que está transformando o mercado de eventos
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h3 className="text-2xl font-bold mb-4">Nossa História</h3>
              <p className="mb-6 text-muted-foreground">
                A Festana nasceu da paixão por eventos e da frustração com a falta de ferramentas adequadas para gerenciá-los. 
                Nossa fundadora, Maria Silva, enfrentava diariamente o desafio de coordenar múltiplos eventos enquanto 
                mantinha a qualidade e a atenção aos detalhes que seus clientes mereciam.
              </p>
              <p className="mb-6 text-muted-foreground">
                Em 2020, decidimos criar uma plataforma que pudesse resolver não apenas os nossos desafios, mas 
                os de todos os organizadores de eventos pelo Brasil. Depois de dois anos de desenvolvimento e testes 
                com profissionais reais, lançamos a Festana para o mercado.
              </p>
              <p className="text-muted-foreground">
                Hoje, estamos orgulhosos de ajudar centenas de profissionais a transformar seus negócios, 
                economizar tempo e encantar seus clientes com eventos perfeitamente organizados.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl border">
              <img 
                src="/placeholder.svg" 
                alt="Equipe Festana" 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </div>
          </div>
          
          <div id="team" className="pt-10">
            <h3 className="text-2xl font-bold mb-10 text-center">Nosso Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="overflow-hidden border-none shadow-md">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={member.photo} 
                      alt={`${member.name} - ${member.role}`} 
                      className="w-full h-full object-cover transition-transform hover:scale-105" 
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Nossos Usuários Dizem</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Não acredite apenas em nossa palavra. Veja o que organizadores de eventos profissionais dizem sobre nossa plataforma.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <svg width="45" height="36" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary/20">
                      <path d="M13.5 18H9C9.33333 12 12.4 9 18.2 9V13.5C15.6 13.5 13.6667 15 13.5 18ZM31.5 18H27C27.3333 12 30.4 9 36.2 9V13.5C33.6 13.5 31.6667 15 31.5 18Z" fill="currentColor"/>
                      <path d="M13.5 18H9V27H18V18H13.5ZM31.5 18H27V27H36V18H31.5Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <p className="mb-4 italic">{testimonial.quote}</p>
                  <p className="text-sm font-medium">{testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
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

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Respostas para as perguntas mais comuns sobre nossa plataforma
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Como a Festana pode me ajudar a organizar eventos?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A Festana oferece um sistema completo para gerenciar todos os aspectos dos seus eventos, 
                  desde o agendamento inicial até o acompanhamento pós-evento. Você pode gerenciar clientes, 
                  fornecedores, orçamentos, pagamentos e comunicações em um só lugar, economizando tempo e 
                  reduzindo a chance de erros.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Preciso ter conhecimentos técnicos para usar a plataforma?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Não! A Festana foi projetada pensando em organizadores de eventos, não em especialistas em tecnologia. 
                  Nossa interface é intuitiva e fácil de usar, e oferecemos treinamento gratuito para novos usuários. 
                  Além disso, nossa equipe de suporte está sempre disponível para ajudar com qualquer dúvida.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Posso experimentar antes de assinar?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sim! Oferecemos um período de teste gratuito de 14 dias para todos os planos, sem necessidade 
                  de cartão de crédito. Você terá acesso a todas as funcionalidades do plano escolhido para 
                  avaliar se atende às suas necessidades.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Meus dados estão seguros na plataforma?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutamente! A segurança dos dados dos nossos clientes é nossa prioridade. Utilizamos criptografia 
                  de ponta a ponta, armazenamento seguro em servidores redundantes e fazemos backups regulares. 
                  Além disso, estamos em conformidade com a LGPD e outras regulamentações de proteção de dados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">Festana</h3>
              <p className="text-muted-foreground mt-2">A solução completa para gerenciamento de eventos</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div>
                <h4 className="font-medium mb-3">Produto</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Recursos</a></li>
                  <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Preços</a></li>
                  <li><a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Empresa</h4>
                <ul className="space-y-2">
                  <li><a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">Sobre</a></li>
                  <li><a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contato</a></li>
                  <li><a href="#team" className="text-muted-foreground hover:text-foreground transition-colors">Nosso Time</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 mt-8">
            <p className="text-center text-muted-foreground">
              &copy; {new Date().getFullYear()} Festana. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedPlan ? `Começar com o plano ${selectedPlan}` : 'Entrar na sua conta'}
            </DialogTitle>
            <DialogDescription>
              Digite suas credenciais para acessar o sistema de planejamento de eventos
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="nome@exemplo.com"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <Button type="button" variant="link" className="p-0 h-auto text-xs">
                  Esqueceu a senha?
                </Button>
              </div>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">Entrar</Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Button variant="link" className="p-0 h-auto">
                  Entre em contato
                </Button>
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;
