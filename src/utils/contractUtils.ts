
import { Client } from '@/types';
import { TemplateVariable } from '@/types/contracts';

export const parseTemplateVariables = (variables: string | undefined): TemplateVariable[] => {
  if (!variables) return [];
  
  try {
    const parsedVariables = JSON.parse(variables);
    if (!Array.isArray(parsedVariables)) return [];
    
    return parsedVariables.filter(item => {
      return item && typeof item === 'object' && 
             typeof item.name === 'string' && 
             typeof item.description === 'string';
    }) as TemplateVariable[];
  } catch (error) {
    console.error('Erro ao analisar variáveis:', error);
    return [];
  }
};

export const groupVariablesByEntity = (variables: TemplateVariable[]) => {
  return variables.reduce((groups: Record<string, TemplateVariable[]>, variable) => {
    const entity = variable.entity || 'outros';
    if (!groups[entity]) {
      groups[entity] = [];
    }
    groups[entity].push(variable);
    return groups;
  }, {});
};

export const replaceVariables = (text: string, client: Client) => {
  if (!text) return '';

  const today = new Date();
  
  const replacements: Record<string, string> = {
    '{cliente.nome}': client.nome || '',
    '{cliente.email}': client.email || '',
    '{cliente.telefone}': client.telefone || '',
    '{cliente.endereco}': client.endereco || '',
    '{empresa.nome}': 'Festana Decorações',
    '{empresa.telefone}': '(11) 98765-4321',
    '{empresa.email}': 'contato@festanadecoracoes.com',
    '{data.hoje}': today.toLocaleDateString('pt-BR'),
    '{data.mes}': today.toLocaleDateString('pt-BR', { month: 'long' }),
    '{data.ano}': today.getFullYear().toString(),
    '{evento.nome}': 'Nome do Evento',
    '{evento.data}': today.toLocaleDateString('pt-BR'),
    '{evento.local}': 'Local do Evento',
    '{evento.valor}': 'R$ 0,00',
    '{kit.nome}': 'Kit Básico',
    '{kit.descricao}': 'Descrição do Kit',
    '{kit.valor}': 'R$ 0,00',
    '{tema.nome}': 'Tema Padrão',
    '{tema.descricao}': 'Descrição do Tema',
    '{tema.valor}': 'R$ 0,00',
  };

  let processedText = text;
  
  Object.entries(replacements).forEach(([variable, value]) => {
    processedText = processedText.replace(new RegExp(variable, 'g'), value);
  });
  
  return processedText;
};
