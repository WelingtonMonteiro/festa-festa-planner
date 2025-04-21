
export type LeadStatus = 'novo' | 'contato' | 'negociando' | 'convertido' | 'perdido';

export interface Leads {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipoFesta: string;
  dataInteresse?: Date;
  status: LeadStatus;
  valorOrcamento?: number;
  observacoes?: string;
  dataCriacao: Date;
  dataUltimoContato?: Date;
}
