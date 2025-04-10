
export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  endereco?: string;
  historico: Evento[];
  ativo?: boolean; // Added ativo property
}

export interface Kit {
  id: string;
  nome: string;
  descricao: string;
  itens: string[];
  preco: number;
  imagens: string[];
  vezes_alugado: number;
}

export interface Tema {
  id: string;
  nome: string;
  descricao: string;
  imagens: string[];
  valorGasto: number; // Investimento no tema
  vezes_alugado: number;
  kits: Kit[];
}

export interface Evento {
  id: string;
  cliente: Cliente;
  tema?: Tema;
  kit: Kit;
  data: string; // ISO date string
  horario: string;
  local: string;
  trajeto?: string; // URL do Google Maps ou descrição
  valorTotal: number;
  valorSinal: number;
  valorRestante: number;
  status: 'inicial' | 'agendado' | 'confirmado' | 'cancelado' | 'adiado' | 'finalizado';
  observacoes?: string;
}

export interface Mensagem {
  id: string;
  remetente: 'empresa' | 'cliente';
  clienteId: string;
  conteudo: string;
  datahora: string; // ISO date string
  lida: boolean;
}

export interface Estatisticas {
  eventosPorMes: Record<string, number>;
  kitsPopulares: Array<{kit: string, quantidade: number}>;
  temasPorMes: Record<string, Record<string, number>>;
  temasPorAno: Record<string, number>;
  faturamentoMensal: Record<string, number>;
}

export interface Usuario {
  nome: string;
  email: string;
  telefone: string;
}
