
# Arquitetura do Sistema FisioFlow

Este documento descreve a arquitetura da aplicação frontend do FisioFlow, detalhando a estrutura, o fluxo de dados e as principais tecnologias utilizadas.

## 1. Visão Geral da Arquitetura

O FisioFlow é uma **Single Page Application (SPA)** construída com **React** e **TypeScript**. A arquitetura é componentizada, modular e reativa, projetada para ser escalável e de fácil manutenção.

A arquitetura pode ser dividida nas seguintes camadas:

1.  **Camada de Apresentação (UI):** Componentes React responsáveis pela renderização da interface.
2.  **Camada de Estado:** Gerenciamento do estado da aplicação através de Contextos e Hooks customizados.
3.  **Camada de Serviços:** Abstração da lógica de negócio e comunicação com fontes de dados.
4.  **Fontes de Dados:** Simulação de um backend (`mockDb.ts`) e a integração com a API externa do Google Gemini.

---

## 2. Camada de Apresentação (UI)

-   **Componentes:** A UI é construída a partir de componentes reutilizáveis localizados em `src/components`. Eles são divididos por funcionalidade (ex: `dashboard`, `agenda`, `ui`) para melhor organização.
-   **Páginas:** Componentes de nível superior que representam as telas da aplicação, localizados em `src/pages`. Cada página compõe a UI utilizando os componentes reutilizáveis.
-   **Layouts:** Estruturas de página (`MainLayout`, `PatientPortalLayout`) que fornecem elementos consistentes como barras de navegação e sidebars para diferentes seções da aplicação.
-   **Estilização:** Utiliza-se **Tailwind CSS** para uma abordagem *utility-first*, permitindo a criação de interfaces complexas e responsivas de forma rápida e consistente. Tokens de design globais estão definidos em `styles/design-tokens.css`.

---

## 3. Gerenciamento de Estado

O estado da aplicação é gerenciado de forma reativa, combinando a API de Contexto do React com hooks customizados.

-   **`AuthContext`:** Gerencia o estado de autenticação do usuário (`user`, `isAuthenticated`, `isLoading`). Ele envolve toda a aplicação para fornecer informações do usuário logado a qualquer componente.
-   **`DataContext`:** Atua como um cache central de dados frequentemente utilizados, como a lista de fisioterapeutas, pacientes e agendamentos. Ele busca os dados iniciais e se inscreve em eventos para se manter atualizado, evitando a necessidade de *prop drilling* e re-buscas desnecessárias de dados.
-   **Hooks Customizados (`usePatients`, `useAppointments`, etc.):** Para lógicas de estado mais complexas e específicas de uma feature, como paginação, filtros e busca de dados sob demanda, são utilizados hooks customizados. Eles encapsulam a lógica de fetching, estado de carregamento, erros e manipulação dos dados, mantendo os componentes de página limpos.

---

## 4. Fluxo de Dados

O fluxo de dados é primariamente unidirecional, seguindo os padrões do React.

1.  **Carregamento Inicial:** Ao carregar a aplicação, o `DataProvider` busca os dados essenciais (fisioterapeutas, pacientes, agendamentos) através dos serviços e os armazena em seu estado.
2.  **Renderização:** Componentes de página (ex: `AgendaPage`) consomem os dados do `DataContext` ou usam hooks customizados (`useAppointments`) para obter os dados necessários.
3.  **Ações do Usuário:** Uma ação do usuário (ex: salvar um novo agendamento) chama uma função do serviço correspondente (`appointmentService.saveAppointment`).
4.  **Atualização de Dados:** O serviço atualiza a fonte de dados (o `mockDb`).
5.  **Notificação de Mudança:** Após a atualização, o serviço emite um evento (ex: `appointments:changed`) usando o `eventService`.
6.  **Re-renderização Reativa:** O `DataContext` (ou outro hook) que está ouvindo este evento executa novamente sua função de busca de dados, obtendo a lista atualizada. A mudança no estado do contexto causa a re-renderização de todos os componentes que o consomem, exibindo a informação mais recente para o usuário.

Este padrão, baseado em eventos, desacopla os componentes e serviços, garantindo que a UI sempre reflita o estado atual dos dados de forma eficiente.

---

## 5. Camada de Serviços

Localizada em `src/services`, esta camada abstrai toda a lógica de negócio e acesso a dados.

-   **Serviços de "Entidade" (`patientService`, `appointmentService`):** Cada serviço é responsável por uma "entidade" do sistema. Eles expõem métodos como `getAll`, `getById`, `save`, `delete`, que são chamados pelos componentes e hooks.
-   **`mockDb.ts`:** Funciona como um banco de dados em memória. Ele contém cópias mutáveis dos dados mockados e implementa a lógica de CRUD. Isso permite que a aplicação tenha um estado persistente durante a sessão do usuário.
-   **`eventService.ts`:** Um simples *event emitter* (Pub/Sub) que permite que os serviços notifiquem outras partes da aplicação sobre mudanças nos dados. É a peça chave para a reatividade do `DataContext`.

---

## 6. Integração com IA (Google Gemini)

A lógica de IA está encapsulada para ser facilmente gerenciada e otimizada.

-   **`geminiService.ts`:** Serviço de baixo nível que lida diretamente com a comunicação com a API `@google/genai`. Ele é responsável por construir os prompts detalhados (templates) para cada funcionalidade (gerar laudo, análise de risco, etc.) e tratar a resposta da API.
-   **`ai-economica/*`:** Um sub-sistema mais avançado que orquestra as chamadas de IA. Ele implementa um padrão de *chain-of-responsibility*:
    1.  **Cache (`cacheService.ts`):** Verifica se uma resposta para a mesma pergunta já existe no cache.
    2.  **Base de Conhecimento (`knowledgeBaseService.ts`):** Busca por respostas na base de conhecimento interna da clínica.
    3.  **Gerente de Contas Premium (`premiumAccountManager.ts`):** Se as fontes internas falharem, ele seleciona o melhor provedor de IA pago (ex: Gemini, ChatGPT) com base no tipo de pergunta e nas configurações do sistema, e então realiza a chamada.
-   **`aiOrchestratorService.ts`:** Uma camada de abstração que simplifica o acesso ao sistema de IA para os componentes, oferecendo uma única função `getResponse`.

---

## 7. Suporte Offline

-   **Service Worker (`sw.js`):** A aplicação implementa um Service Worker para fornecer funcionalidades offline. Ele utiliza a estratégia **Stale-While-Revalidate**:
    1.  Na primeira visita, o *App Shell* (HTML, CSS, JS principal) e alguns dados mockados são salvos em cache.
    2.  Em visitas subsequentes, a aplicação é carregada instantaneamente a partir do cache.
    3.  Em paralelo, uma requisição é feita à rede para buscar a versão mais recente dos arquivos. Se uma nova versão for encontrada, o cache é atualizado em segundo plano para a próxima visita.

Isso garante que a aplicação possa ser aberta mesmo sem conexão com a internet e que o carregamento seja extremamente rápido em visitas repetidas.
