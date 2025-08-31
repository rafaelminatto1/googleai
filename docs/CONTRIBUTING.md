
# Guia de Contribuição - FisioFlow

Bem-vindo(a) ao desenvolvimento do FisioFlow! Este guia contém diretrizes para ajudar a manter o código consistente, organizado e de alta qualidade.

## 1. Filosofia do Projeto

-   **Componentização:** Construa componentes pequenos, reutilizáveis e focados em uma única responsabilidade.
-   **Clareza sobre Performance Prematura:** Escreva um código claro e legível. Otimizações devem ser feitas quando um gargalo de performance for identificado.
-   **Separação de Responsabilidades:** Mantenha a lógica de negócio (serviços) separada da lógica de apresentação (componentes). Componentes devem ser o mais "burros" possível.
-   **Tipagem Forte:** Utilize TypeScript para garantir a segurança dos tipos e melhorar a experiência de desenvolvimento.

## 2. Padrões de Código

-   **Nomenclatura:**
    -   **Componentes:** PascalCase (ex: `PatientCard.tsx`).
    -   **Páginas:** PascalCase com o sufixo `Page` (ex: `AgendaPage.tsx`).
    -   **Hooks:** camelCase com o prefixo `use` (ex: `usePatients.ts`).
    -   **Serviços:** camelCase com o sufixo `Service` (ex: `patientService.ts`).
    -   **Tipos/Interfaces:** PascalCase (ex: `Appointment`, `PatientSummary`).
-   **Estilo:** Siga as convenções do Prettier e ESLint configuradas no projeto.
-   **Importações:** Organize as importações em blocos:
    1.  Dependências externas (React, `lucide-react`).
    2.  Importações de tipos.
    3.  Importações de serviços e hooks.
    4.  Importações de componentes.
    5.  Importações de CSS/estilos.

## 3. Estrutura de Componentes

-   **Componentes de UI (`src/components/ui`):** Componentes genéricos e sem estado, como `Button`, `Skeleton`, `Modal`. Eles não devem conter lógica de negócio.
-   **Componentes de Feature (`src/components/[feature]`):** Componentes específicos de uma funcionalidade, como `components/dashboard/RevenueChart.tsx` ou `components/agenda/AppointmentCard.tsx`.
-   **Páginas (`src/pages`):** Orquestram os componentes de feature para montar uma tela completa. São responsáveis por chamar os hooks que buscam os dados necessários para a página.

## 4. Gerenciamento de Estado

-   **Estado Local (`useState`):** Use para estados que são relevantes apenas para um único componente (ex: estado de um modal, conteúdo de um input).
-   **Contexto (`DataContext`):** Use para dados globais que são necessários em muitas partes da aplicação e não mudam com extrema frequência (ex: lista de fisioterapeutas, lista de todos os pacientes). Isso evita *prop drilling*.
-   **Hooks Customizados (`use[Feature]`):** Use para encapsular lógicas complexas de busca e gerenciamento de estado que são reutilizadas ou que tornariam um componente de página muito complexo. Exemplos: `usePatients` para lidar com filtros e paginação, `useAppointments` para buscar agendamentos de um período específico.

## 5. Adicionando uma Nova Funcionalidade (Ex: Página de "Metas")

1.  **Definir Tipos:** Se a nova funcionalidade introduz novos modelos de dados, adicione as interfaces correspondentes em `src/types.ts`.
    ```typescript
    // Em types.ts
    export interface Goal {
      id: string;
      patientId: string;
      description: string;
      status: 'active' | 'completed';
    }
    ```
2.  **Criar Dados Mockados:** Adicione dados de exemplo para a nova entidade em `src/data/mockData.ts` e atualize o `mockDb.ts` para gerenciá-los.
3.  **Criar o Serviço:** Crie `src/services/goalService.ts`. Implemente as funções de CRUD (`getGoalsByPatientId`, `saveGoal`, etc.) que interagem com o `mockDb`.
4.  **Criar a Rota:** Adicione a nova rota em `src/AppRoutes.tsx`.
    ```tsx
    <Route path="/patients/:id/goals" element={<GoalsPage />} />
    ```
5.  **Criar o Componente de Página:** Crie `src/pages/GoalsPage.tsx`. Esta página irá usar o `goalService` (ou um hook `useGoals`) para buscar e exibir os dados.
6.  **Criar Componentes Reutilizáveis:** Crie os componentes necessários, como `src/components/goals/GoalCard.tsx`.
7.  **Adicionar ao Menu:** Se necessário, adicione o link para a nova página no `Sidebar.tsx` ou em outro local de navegação.

## 6. Mensagens de Commit

Siga o padrão **Conventional Commits**. Isso ajuda a manter o histórico do Git limpo e facilita a geração de changelogs.

-   `feat:` (nova funcionalidade)
-   `fix:` (correção de bug)
-   `docs:` (mudanças na documentação)
-   `style:` (formatação, ponto e vírgula, etc; sem mudança de código)
-   `refactor:` (refatoração de código, sem mudança de funcionalidade)
-   `test:` (adição ou correção de testes)
-   `chore:` (atualização de dependências, configurações, etc.)

**Exemplo:**
```
feat(agenda): add availability blocks to calendar view

Implements the visual representation of non-bookable times
for therapists, such as lunch breaks and meetings.
```

---

Obrigado por contribuir para o FisioFlow!
