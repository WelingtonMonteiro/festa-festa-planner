
export interface Client {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  endereco?: string;
  historico: Event[];
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

export interface Them {
  id: string;
  nome: string;
  descricao: string;
  imagens: string[];
  valorGasto: number; // Investimento no tema
  vezes_alugado: number;
  kits: Kit[];
}

export interface Event {
  id: string;
  cliente: Client;
  tema?: Them;
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

export interface Message {
  id: string;
  remetente: 'empresa' | 'cliente';
  clienteId: string;
  conteudo: string;
  datahora: string; // ISO date string
  lida: boolean;
}

export interface Statistic {
  eventosPorMes: Record<string, number>;
  kitsPopulares: Array<{kit: string, quantidade: number}>;
  temasPorMes: Record<string, Record<string, number>>;
  temasPorAno: Record<string, number>;
  faturamentoMensal: Record<string, number>;
}

export interface User {
  nome: string;
  email: string;
  telefone: string;
}
