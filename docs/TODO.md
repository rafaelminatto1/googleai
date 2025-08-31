
# TODO List - Roadmap de Evolução do FisioFlow

Esta lista de tarefas serve para acompanhar a implementação das melhorias e boas práticas definidas no arquivo `ROADMAP.md`.

## [ ] Arquitetura e Estrutura de Código

-   [ ] **Backend Real (Monorepo com Next.js):**
    -   [ ] Planejar a estrutura de um monorepo (ex: usando Turborepo ou pnpm workspaces).
    -   [ ] Iniciar um novo projeto com Next.js.
    -   [ ] Migrar a lógica dos `services` para API Routes do Next.js.
    -   [ ] Configurar o Prisma ORM, criar o schema do banco de dados e conectar a um banco de dados (ex: PostgreSQL em Docker).
-   [ ] **Gerenciamento de Estado Avançado:**
    -   [ ] Avaliar e escolher uma biblioteca de estado (ex: Zustand).
    -   [ ] Refatorar o `DataContext` para usar a nova biblioteca, migrando o estado global (ex: `therapists`).
-   [ ] **Gerenciamento de Estado do Servidor:**
    -   [ ] Integrar TanStack Query ao projeto.
    -   [ ] Refatorar os hooks de busca de dados (ex: `usePatients`, `useAppointments`) para usar `useQuery`.
    -   [ ] Implementar `useMutation` para as operações de criação, atualização e exclusão de dados.
-   [ ] **Componentes de UI com CVA:**
    -   [ ] Instalar `class-variance-authority`.
    -   [ ] Refatorar componentes base como `Button`, `Badge` e `Alert` para usar CVA, definindo variantes de estilo.

## [ ] Performance e Otimização

-   [ ] Implementar Code Splitting para as rotas principais (se não estiver usando um framework que já o faz, como Next.js).
-   [ ] Identificar as listas mais longas da aplicação (ex: Pacientes, Log de Auditoria).
-   [ ] Implementar virtualização de listas usando `TanStack Virtual` onde for necessário.
-   [ ] Configurar um sistema de otimização de imagens para servir formatos modernos (WebP) e tamanhos responsivos.

## [ ] Testes e Qualidade de Código

-   [ ] Configurar o Vitest e a React Testing Library no ambiente de desenvolvimento.
-   [ ] Escrever testes unitários para pelo menos 3 `services` críticos (ex: `patientService`, `appointmentService`).
-   [ ] Escrever testes unitários para pelo menos 2 `hooks` complexos (ex: `usePatients`).
-   [ ] Escrever testes de componentes para os formulários de `AppointmentFormModal` e `PatientFormModal`, testando validações e submissão.
-   [ ] Configurar Cypress ou Playwright para testes E2E.
-   [ ] Criar um teste E2E para o fluxo crítico: "Login -> Criar Paciente -> Agendar Consulta".
-   [ ] Configurar um workflow de Integração Contínua (CI) no GitHub Actions para rodar `lint` e `test` em cada pull request.

## [ ] Experiência do Desenvolvedor (DX)

-   [ ] Configurar o Storybook no projeto.
-   [ ] Criar *stories* para os componentes de UI base (`Button`, `Input`, `Card`, `Modal`).
-   [ ] Documentar as propriedades (props) dos componentes no Storybook.

## [ ] UI/UX e Acessibilidade (A11y)

-   [ ] Instalar Radix UI (ou outra biblioteca headless).
-   [ ] Refatorar o componente `AppointmentFormModal` para usar os primitivos do Radix UI, garantindo acessibilidade.
-   [ ] Refatorar o componente `TherapistSelector` (dropdown) para usar Radix UI.
-   [ ] Realizar uma auditoria completa de navegação por teclado em toda a aplicação.
-   [ ] Utilizar uma ferramenta (ex: Axe) para verificar e corrigir problemas de contraste de cores e falta de atributos ARIA.
-   [ ] Instalar Framer Motion.
-   [ ] Adicionar animações de transição suave entre as páginas.
-   [ ] Adicionar animações de entrada e saída para todos os modais da aplicação.
