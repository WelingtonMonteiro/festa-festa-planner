
import { Cliente, Kit, Tema, Evento, Mensagem } from '../types';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Dados de exemplo para o sistema
export const clientesMock: Cliente[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    telefone: '(11) 98765-4321',
    email: 'maria@email.com',
    endereco: 'Rua das Flores, 123',
    historico: []
  },
  {
    id: '2',
    nome: 'João Santos',
    telefone: '(11) 91234-5678',
    email: 'joao@email.com',
    historico: []
  },
  {
    id: '3',
    nome: 'Ana Oliveira',
    telefone: '(11) 99876-5432',
    email: 'ana@email.com',
    endereco: 'Av. Principal, 456',
    historico: []
  }
];

export const kitsMock: Kit[] = [
  {
    id: 'k1',
    nome: 'Kit Básico',
    descricao: 'Mesa principal, 2 mesas de apoio, painel de fundo.',
    itens: ['Mesa principal', 'Painel decorativo', '2 mesas de apoio'],
    preco: 250,
    imagens: ['/kit-basico.jpg'],
    vezes_alugado: 15
  },
  {
    id: 'k2',
    nome: 'Kit Completo',
    descricao: 'Mesa principal, 2 mesas de apoio, painel de fundo, 30 lembrancinhas.',
    itens: ['Mesa principal', 'Painel decorativo', '2 mesas de apoio', '30 lembrancinhas'],
    preco: 450,
    imagens: ['/kit-completo.jpg'],
    vezes_alugado: 8
  },
  {
    id: 'k3',
    nome: 'Kit Premium',
    descricao: 'Mesa principal, 3 mesas de apoio, painel de fundo, 50 lembrancinhas, decoração completa do salão.',
    itens: ['Mesa principal', 'Painel decorativo', '3 mesas de apoio', '50 lembrancinhas', 'Decoração do salão'],
    preco: 850,
    imagens: ['/kit-premium.jpg'],
    vezes_alugado: 5
  }
];

export const temasMock: Tema[] = [
  {
    id: 't1',
    nome: 'Super-Heróis',
    descricao: 'Decoração completa com tema de super-heróis',
    imagens: ['/tema-herois.jpg'],
    valorGasto: 1200,
    vezes_alugado: 12,
    kits: [kitsMock[0], kitsMock[1], kitsMock[2]]
  },
  {
    id: 't2',
    nome: 'Princesas',
    descricao: 'Decoração delicada com tema de princesas',
    imagens: ['/tema-princesas.jpg'],
    valorGasto: 1500,
    vezes_alugado: 10,
    kits: [kitsMock[0], kitsMock[1], kitsMock[2]]
  },
  {
    id: 't3',
    nome: 'Fazendinha',
    descricao: 'Decoração com tema rural e animais da fazenda',
    imagens: ['/tema-fazendinha.jpg'],
    valorGasto: 950,
    vezes_alugado: 7,
    kits: [kitsMock[0], kitsMock[1]]
  },
  {
    id: 't4',
    nome: 'Circo',
    descricao: 'Decoração colorida e divertida com tema de circo',
    imagens: ['/tema-circo.jpg'],
    valorGasto: 1100,
    vezes_alugado: 5,
    kits: [kitsMock[0], kitsMock[1], kitsMock[2]]
  }
];

const today = new Date();
const formattedToday = format(today, 'yyyy-MM-dd');
const nextWeek = format(addDays(today, 7), 'yyyy-MM-dd');
const lastWeek = format(subDays(today, 7), 'yyyy-MM-dd');
const twoWeeksFromNow = format(addDays(today, 14), 'yyyy-MM-dd');

export const eventosMock: Evento[] = [
  {
    id: 'e1',
    cliente: clientesMock[0],
    tema: temasMock[0],
    kit: kitsMock[2],
    data: formattedToday,
    horario: '14:00',
    local: 'Salão de Festas Primavera, São Paulo',
    trajeto: 'https://maps.app.goo.gl/sample1',
    valorTotal: 1250,
    valorSinal: 500,
    valorRestante: 750,
    status: 'confirmado'
  },
  {
    id: 'e2',
    cliente: clientesMock[1],
    tema: temasMock[1],
    kit: kitsMock[1],
    data: nextWeek,
    horario: '16:00',
    local: 'Buffet Encantado, Guarulhos',
    trajeto: 'https://maps.app.goo.gl/sample2',
    valorTotal: 900,
    valorSinal: 450,
    valorRestante: 450,
    status: 'agendado'
  },
  {
    id: 'e3',
    cliente: clientesMock[2],
    tema: temasMock[3],
    kit: kitsMock[0],
    data: twoWeeksFromNow,
    horario: '15:00',
    local: 'Espaço Alegria, São Paulo',
    valorTotal: 600,
    valorSinal: 200,
    valorRestante: 400,
    status: 'agendado'
  },
  {
    id: 'e4',
    cliente: clientesMock[0],
    tema: temasMock[2],
    kit: kitsMock[1],
    data: lastWeek,
    horario: '10:00',
    local: 'Residência do cliente',
    trajeto: 'https://maps.app.goo.gl/sample3',
    valorTotal: 750,
    valorSinal: 750,
    valorRestante: 0,
    status: 'finalizado'
  }
];

// Atualizar o histórico dos clientes com seus eventos
clientesMock[0].historico = [eventosMock[0], eventosMock[3]];
clientesMock[1].historico = [eventosMock[1]];
clientesMock[2].historico = [eventosMock[2]];

export const mensagensMock: Mensagem[] = [
  {
    id: 'm1',
    remetente: 'cliente',
    clienteId: '1',
    conteudo: 'Bom dia! Gostaria de informações sobre o kit de super-heróis.',
    datahora: '2025-04-09T09:30:00',
    lida: true
  },
  {
    id: 'm2',
    remetente: 'empresa',
    clienteId: '1',
    conteudo: 'Olá Maria! Temos disponível o Kit Básico por R$250, Kit Completo por R$450 e Kit Premium por R$850. Qual seria seu interesse?',
    datahora: '2025-04-09T10:15:00',
    lida: true
  },
  {
    id: 'm3',
    remetente: 'cliente',
    clienteId: '1',
    conteudo: 'Gostaria de saber mais sobre o Kit Premium. O que está incluso?',
    datahora: '2025-04-09T10:30:00',
    lida: true
  },
  {
    id: 'm4',
    remetente: 'cliente',
    clienteId: '2',
    conteudo: 'Boa tarde! Vocês têm disponibilidade para o próximo sábado?',
    datahora: '2025-04-08T15:45:00',
    lida: false
  }
];

// Função para gerar estatísticas com base nos eventos
export const gerarEstatisticas = (eventos: Evento[]): Estatisticas => {
  const eventosPorMes: Record<string, number> = {};
  const kitsContagem: Record<string, number> = {};
  const temasPorMes: Record<string, Record<string, number>> = {};
  const temasPorAno: Record<string, number> = {};
  const faturamentoMensal: Record<string, number> = {};
  
  eventos.forEach(evento => {
    if (!evento.data) return;
    
    // Extrair ano e mês
    const data = new Date(evento.data);
    const ano = data.getFullYear().toString();
    const mes = format(data, 'yyyy-MM', { locale: ptBR });
    const mesNome = format(data, 'MMM', { locale: ptBR });
    
    // Contar eventos por mês
    eventosPorMes[mesNome] = (eventosPorMes[mesNome] || 0) + 1;
    
    // Contar kits utilizados
    const kitNome = evento.kit.nome;
    kitsContagem[kitNome] = (kitsContagem[kitNome] || 0) + 1;
    
    // Contar temas por mês
    if (evento.tema) {
      if (!temasPorMes[mesNome]) {
        temasPorMes[mesNome] = {};
      }
      const temaNome = evento.tema.nome;
      temasPorMes[mesNome][temaNome] = (temasPorMes[mesNome][temaNome] || 0) + 1;
      
      // Contar temas por ano
      temasPorAno[temaNome] = (temasPorAno[temaNome] || 0) + 1;
    }
    
    // Calcular faturamento mensal
    faturamentoMensal[mesNome] = (faturamentoMensal[mesNome] || 0) + evento.valorTotal;
  });
  
  // Transformar kitsContagem em um array ordenado
  const kitsPopulares = Object.entries(kitsContagem)
    .map(([kit, quantidade]) => ({ kit, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);
  
  return {
    eventosPorMes,
    kitsPopulares,
    temasPorMes,
    temasPorAno,
    faturamentoMensal
  };
};
