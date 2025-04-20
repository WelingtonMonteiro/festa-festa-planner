
import { Client, Kit, Them, Event } from '@/types';

export type EntityType = 'client' | 'kit' | 'theme' | 'event';

export interface EntityField {
  key: string;
  label: string;
}

export const entityFields: Record<EntityType, EntityField[]> = {
  client: [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'telefone', label: 'Telefone' },
    { key: 'endereco', label: 'Endereço' }
  ],
  kit: [
    { key: 'nome', label: 'Nome' },
    { key: 'descricao', label: 'Descrição' },
    { key: 'preco', label: 'Valor' }
  ],
  theme: [
    { key: 'nome', label: 'Nome' },
    { key: 'descricao', label: 'Descrição' },
    { key: 'valorGasto', label: 'Valor Investido' }
  ],
  event: [
    { key: 'data', label: 'Data' },
    { key: 'horario', label: 'Horário' },
    { key: 'local', label: 'Local' },
    { key: 'valorTotal', label: 'Valor Total' }
  ]
};
