import React from 'react';
import { Message } from '../types';
import { ClientsProvider, useClientsContext } from './clients/clientsContext';
import { KitsProvider, useKitsContext } from './kits/kitsContext';
import { ThemesProvider, useThemesContext } from './themes/themesContext';
import { EventsProvider, useEventsContext } from './events/eventsContext';
import { MessagesProvider, useMessagesContext } from './messages/messagesContext';
import { StatisticsProvider, useStatisticsContext } from './statistics/statisticsContext';
import { ContractsProvider, useContractsContext } from './contracts/contractsContext';
import { SettingsProvider, useSettingsContext } from './settings/settingsContext';
import { useStorage } from '../contexts/storageContext';

export const FestaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { storageType, isInitialized } = useStorage();

  return (
    <SettingsProvider>
      <EventsProvider>
        {(eventsContext) => (
          <KitsProvider 
            events={eventsContext.events} 
            storageType={storageType}
          >
            {(kitsContext) => (
              <ThemesProvider 
                events={eventsContext.events} 
                kits={kitsContext.kits}
                storageType={storageType}
              >
                <ClientsProvider 
                  events={eventsContext.events}
                  onUpdateClientHistory={(clientId, events) => {
                    // Callback para atualizar histórico de clientes
                  }}
                >
                  <MessagesProvider>
                    {(messagesContext) => (
                      <ContractsProvider 
                        onAddMessage={messagesContext.addMessage}
                      >
                        <StatisticsProvider events={eventsContext.events}>
                          {children}
                        </StatisticsProvider>
                      </ContractsProvider>
                    )}
                  </MessagesProvider>
                </ClientsProvider>
              </ThemesProvider>
            )}
          </KitsProvider>
        )}
      </EventsProvider>
    </SettingsProvider>
  );
};

export const useHandleContext = () => {
  const clients = useClientsContext();
  const kits = useKitsContext();
  const thems = useThemesContext();
  const events = useEventsContext();
  const messages = useMessagesContext();
  const statistics = useStatisticsContext();
  const contracts = useContractsContext();
  const settings = useSettingsContext();

  return {
    clients: clients.clients,
    kits: kits.kits,
    thems: thems.thems,
    events: events.events,
    messages: messages.messages,
    statistics: statistics.statistics,
    users: settings.users,
    contracts: contracts.contracts,
    contractTemplates: contracts.contractTemplates,
    apiUrl: settings.apiUrl,

    addClients: clients.addClients,
    updateClients: clients.updateClients,
    removeClients: clients.removeClients,

    addKit: kits.addKit,
    updateKit: kits.updateKit,
    removeKit: kits.removeKit,

    addThems: thems.addThems,
    updateThems: thems.updateThems,
    removeThems: thems.removeThems,

    addEvent: events.addEvent,
    updateEvent: events.updateEvent,
    removeEvent: events.removeEvent,

    addMessage: messages.addMessage,
    markMessageAsRead: messages.markMessageAsRead,

    updateStatistic: statistics.updateStatistic,

    addContractTemplate: contracts.addContractTemplate,
    updateContractTemplate: contracts.updateContractTemplate,
    removeContractTemplate: contracts.removeContractTemplate,

    addContract: contracts.addContract,
    updateContract: contracts.updateContract,
    removeContract: contracts.removeContract,
    sendContractToClient: contracts.sendContractToClient,
    signContract: contracts.signContract
  };
};
