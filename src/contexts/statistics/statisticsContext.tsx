
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, Statistic } from '../../types';
import { gerarEstatisticas } from '../../data/mockData';

interface StatisticsContextType {
  statistics: Statistic;
  updateStatistic: () => void;
}

const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined);

export const StatisticsProvider: React.FC<{ 
  children: React.ReactNode,
  events: Event[]
}> = ({ children, events }) => {
  const [estatisticas, setEstatisticas] = useState<Statistic>({
    eventosPorMes: {},
    kitsPopulares: [],
    temasPorMes: {},
    temasPorAno: {},
    faturamentoMensal: {}
  });
  
  const atualizarEstatisticas = () => {
    const novasEstatisticas = gerarEstatisticas(events);
    setEstatisticas(novasEstatisticas);
  };
  
  // Gerar estatísticas quando os eventos mudam
  useEffect(() => {
    atualizarEstatisticas();
  }, [events]);
  
  return (
    <StatisticsContext.Provider value={{
      statistics: estatisticas,
      updateStatistic: atualizarEstatisticas
    }}>
      {children}
    </StatisticsContext.Provider>
  );
};

export const useStatisticsContext = () => {
  const context = useContext(StatisticsContext);
  if (context === undefined) {
    throw new Error('useStatisticsContext must be used within a StatisticsProvider');
  }
  return context;
};
