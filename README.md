
## Project info

**URL**: https://lovable.dev/projects/da7f8e72-7d14-435f-a645-eb97f262294e

## Estrutura de Arquivos do Projeto

```
src/
├── components/
│   ├── admin/
│   │   └── plans/ - Componentes para gerenciamento de planos
│   ├── auth/ - Componentes relacionados à autenticação
│   ├── clients/ - Componentes para gerenciamento de clientes
│   ├── common/ - Componentes comuns reutilizáveis
│   │   └── DataPagination.tsx - Componente de paginação
│   ├── contracts/ - Componentes para gerenciamento de contratos
│   │   ├── editor/ - Editor de contratos
│   │   └── templates/ - Templates de contratos
│   ├── events/ - Componentes de eventos
│   ├── kits/ - Componentes para gerenciamento de kits
│   │   ├── KitCard.tsx - Card para exibição de kit
│   │   ├── KitForm.tsx - Formulário para criação/edição de kit
│   │   └── KitList.tsx - Lista de kits
│   ├── kits-thems/ - Componentes compartilhados para kits e temas
│   │   ├── dialogs/ - Diálogos para kits e temas
│   │   │   ├── KitDialog.tsx - Diálogo para criação/edição de kit
│   │   │   └── ThemDialog.tsx - Diálogo para criação/edição de tema
│   │   ├── tabs/ - Tabs para kits e temas
│   │   │   ├── KitsTab.tsx - Aba de kits
│   │   │   ├── TabsHeader.tsx - Cabeçalho das abas
│   │   │   └── ThemsTab.tsx - Aba de temas
│   │   ├── DeleteConfirmDialog.tsx - Diálogo de confirmação de exclusão
│   │   ├── KitsThemsContent.tsx - Conteúdo da página de kits e temas
│   │   └── KitsThemsDialogs.tsx - Diálogos para kits e temas
│   ├── landing/ - Componentes da página inicial
│   ├── layout/ - Componentes de layout
│   │   ├── header/ - Componentes do cabeçalho
│   │   │   ├── NotificationsMenu.tsx - Menu de notificações
│   │   │   ├── StorageModeIndicator.tsx - Indicador do modo de armazenamento
│   │   │   └── UserMenu.tsx - Menu do usuário
│   │   ├── Header.tsx - Cabeçalho
│   │   ├── MainLayout.tsx - Layout principal
│   │   ├── Sidebar.tsx - Barra lateral
│   │   └── StorageToggle.tsx - Alternador de armazenamento
│   ├── leads/ - Componentes para gerenciamento de leads
│   ├── management/ - Componentes para gerenciamento de clientes
│   │   ├── ActiveClients.tsx - Clientes ativos
│   │   ├── CanceledClients.tsx - Clientes cancelados
│   │   ├── InactiveClients.tsx - Clientes inativos
│   │   ├── LastedAccessClients.tsx - Clientes com último acesso
│   │   └── LatePaymentsClients.tsx - Clientes com pagamentos atrasados
│   ├── messages/ - Componentes de mensagens
│   ├── reports/ - Componentes de relatórios
│   ├── settings/ - Componentes de configurações
│   ├── system/ - Componentes do sistema
│   ├── thems/ - Componentes para gerenciamento de temas
│   │   ├── ThemCard.tsx - Card para exibição de tema
│   │   ├── ThemForm.tsx - Formulário para criação/edição de tema
│   │   └── ThemList.tsx - Lista de temas
│   └── ui/ - Componentes de UI (shadcn)
├── contexts/ - Contextos React
│   ├── clients/ - Contexto de clientes
│   ├── contracts/ - Contexto de contratos
│   ├── events/ - Contexto de eventos
│   ├── kits/ - Contexto de kits
│   ├── messages/ - Contexto de mensagens
│   ├── settings/ - Contexto de configurações
│   ├── statistics/ - Contexto de estatísticas
│   ├── themes/ - Contexto de temas
│   ├── apiContext.tsx - Contexto de API
│   ├── authContext.tsx - Contexto de autenticação
│   ├── handleContext.tsx - Contexto principal que agrupa todos os outros
│   └── storageContext.tsx - Contexto de armazenamento
├── data/ - Dados mock para desenvolvimento
├── hooks/ - Hooks personalizados
│   ├── useCrud.ts - Hook para operações CRUD
│   ├── useDialogManager.ts - Hook para gerenciamento de diálogos
│   ├── useKitsThemsData.ts - Hook para dados de kits e temas
│   ├── useNotifications.ts - Hook para notificações
│   ├── usePagination.ts - Hook para paginação
│   ├── useTemplateDialogs.ts - Hook para diálogos de templates
│   ├── useTemplateManagement.ts - Hook para gerenciamento de templates
│   └── use-theme.tsx - Hook para tema
├── integrations/ - Integrações com serviços externos
│   └── supabase/ - Integração com Supabase
│       ├── client.ts - Cliente Supabase
│       └── types.ts - Tipos para Supabase
├── lib/ - Bibliotecas e utilitários
│   └── utils.ts - Funções utilitárias
├── pages/ - Páginas da aplicação
│   ├── admin/ - Páginas administrativas
│   │   └── PlansManagement.tsx - Gerenciamento de planos
│   ├── Auth/ - Páginas de autenticação
│   │   └── LoginPage.tsx - Página de login
│   ├── Leads/ - Páginas de leads
│   │   └── LeadPage.tsx - Página de lead
│   ├── AdminSettings.tsx - Configurações administrativas
│   ├── CalendarPage.tsx - Página de calendário
│   ├── ClientDetails.tsx - Detalhes do cliente
│   ├── Clients.tsx - Página de clientes
│   ├── ClientsManagement.tsx - Gerenciamento de clientes
│   ├── Configurations.tsx - Configurações
│   ├── Contracts.tsx - Página de contratos
│   ├── Dashboard.tsx - Painel principal
│   ├── Eventos.tsx - Página de eventos
│   ├── Financial.tsx - Página financeira
│   ├── Index.tsx - Página inicial
│   ├── KitsThems.tsx - Página de kits e temas
│   ├── Landing.tsx - Página de landing
│   ├── Leads.tsx - Página de leads
│   ├── Messages.tsx - Página de mensagens
│   ├── NotFound.tsx - Página 404
│   ├── Notifications.tsx - Página de notificações
│   ├── Reports.tsx - Página de relatórios
│   └── Statistics.tsx - Página de estatísticas
├── services/ - Serviços
│   ├── adapters/ - Adaptadores para diferentes fontes de dados
│   │   ├── ApiRestAdapter.ts - Adaptador para API REST
│   │   ├── LocalStorageAdapter.ts - Adaptador para LocalStorage
│   │   └── SupabaseAdapter.ts - Adaptador para Supabase
│   ├── apiServices/ - Serviços de API
│   │   ├── kitApiService.ts - Serviço de API para kits
│   │   ├── themApiService.ts - Serviço de API para temas
│   │   └── whatsappApiService.ts - Serviço de API para WhatsApp
│   ├── entityServices/ - Serviços para entidades
│   │   ├── clientService.ts - Serviço para clientes
│   │   ├── contractService.ts - Serviço para contratos
│   │   ├── kitService.ts - Serviço para kits
│   │   ├── leadService.ts - Serviço para leads
│   │   ├── planService.ts - Serviço para planos
│   │   └── themService.ts - Serviço para temas
│   ├── authService.ts - Serviço de autenticação
│   ├── CrudService.ts - Serviço CRUD genérico
│   ├── databaseService.ts - Serviço de banco de dados
│   ├── kitService.ts - Serviço de kits
│   ├── migrationScripts.ts - Scripts de migração
│   ├── planService.ts - Serviço de planos
│   ├── StorageAdapterFactory.ts - Fábrica de adaptadores de armazenamento
│   ├── themService.ts - Serviço de temas
│   ├── unifiedKitService.ts - Serviço unificado para kits
│   └── unifiedThemService.ts - Serviço unificado para temas
├── types/ - Definições de tipos
│   ├── auth.ts - Tipos para autenticação
│   ├── contracts.ts - Tipos para contratos
│   ├── crud.ts - Tipos para operações CRUD
│   ├── index.ts - Exportação de tipos principais
│   ├── leads.ts - Tipos para leads
│   ├── plans.ts - Tipos para planos
│   └── supabase.ts - Tipos para Supabase
├── utils/ - Funções utilitárias
│   ├── contractEntityFields.ts - Campos de entidade para contratos
│   ├── contractUtils.ts - Utilitários para contratos
│   └── format.ts - Funções de formatação
├── App.css - Estilos globais da aplicação
├── App.tsx - Componente principal da aplicação
├── index.css - Estilos de índice
├── main.tsx - Ponto de entrada principal
└── vite-env.d.ts - Definições de ambiente Vite
```

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/da7f8e72-7d14-435f-a645-eb97f262294e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- api rest

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/da7f8e72-7d14-435f-a645-eb97f262294e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
