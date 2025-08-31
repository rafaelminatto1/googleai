
# FisioFlow - Sistema de Gestão para Clínicas de Fisioterapia

## 1. Visão Geral

O FisioFlow é uma aplicação web completa e moderna (SPA - Single Page Application) projetada para otimizar a gestão de clínicas de fisioterapia. A plataforma centraliza o gerenciamento de pacientes, agendamentos, prontuários eletrônicos e finanças, integrando uma assistente de Inteligência Artificial para potencializar a tomada de decisão clínica e administrativa.

Além do portal principal para a equipe da clínica, o sistema oferece um **Portal do Paciente** para engajamento no tratamento e um **Portal de Parceiros** para colaboração com outros profissionais de saúde.

---

## 2. Principais Módulos e Funcionalidades

### Portal da Clínica (Fisioterapeutas e Administradores)
- **Dashboard Administrativo:** Visão 360° com KPIs de faturamento, fluxo de pacientes e produtividade da equipe.
- **Dashboard Clínico:** Análise de eficácia dos tratamentos, evolução média da dor e taxa de sucesso por patologia.
- **Gestão de Pacientes:** Cadastro, busca, filtros avançados e um prontuário eletrônico detalhado para cada paciente.
- **Agenda Inteligente:** Calendário semanal com visualização multi-profissional, detecção de conflitos, blocos de indisponibilidade e agendamento rápido.
- **Acompanhamento Proativo:** Painel que identifica pacientes com risco de abandono e sugere ações de retenção.
- **Ferramentas de IA (Google Gemini):**
  - Gerador de Laudos de Avaliação.
  - Gerador de Evolução de Sessão (formato SOAP).
  - Gerador de Plano de Exercícios Domiciliar (HEP).
  - Análise de Risco de Abandono.
- **Módulos Adicionais:** Gestão de Grupos, Biblioteca de Exercícios, Controle Financeiro, Gestão de Insumos, Parcerias, Eventos e mais.

### Portal do Paciente
- **Início:** Resumo do dia, próxima consulta e exercícios.
- **Meus Exercícios:** Visualização do plano de exercícios com vídeos e um sistema para registro de feedback (dificuldade, dor, comentários).
- **Diário de Dor:** Mapa corporal interativo para registrar a localização, intensidade e tipo da dor.
- **Meu Progresso:** Resumo gamificado da evolução do tratamento, gerado por IA.
- **Gamificação:** Sistema de pontos, níveis e conquistas para aumentar o engajamento.

### Portal de Parceiros (Ex: Educadores Físicos)
- **Dashboard:** Visão geral dos clientes encaminhados.
- **Meus Clientes:** Acesso a uma visão limitada e segura do histórico clínico dos pacientes que adquiriram seus serviços.
- **Financeiro:** Acompanhamento de comissões e repasses.

---

## 3. Stack de Tecnologias

- **Frontend:** React 18+, TypeScript
- **Roteamento:** React Router DOM v6
- **Estilização:** Tailwind CSS, Lucide Icons
- **Gráficos:** Recharts
- **Inteligência Artificial:** Google Gemini API (`@google/genai`)
- **Backend (Simulado):** Camada de serviços em TypeScript que simula uma API RESTful, com um "banco de dados" em memória (`mockDb.ts`).
- **Offline First:** Service Worker (`sw.js`) para cache do App Shell e dados essenciais.

---

## 4. Como Iniciar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_REPOSITORIO]
    cd fisioflow
    ```

2.  **Instale as dependências:**
    O projeto utiliza um `importmap` no `index.html`, então não há necessidade de `npm install` para as dependências externas. O ambiente está configurado para buscar os módulos diretamente de um CDN (esm.sh).

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto e adicione sua chave da API do Google Gemini:
    ```
    API_KEY=SUA_CHAVE_DA_API_AQUI
    ```
    O sistema está configurado para ler esta variável de ambiente.

4.  **Inicie o servidor de desenvolvimento:**
    Você pode usar qualquer servidor web estático. Uma opção simples é o `serve`:
    ```bash
    # Se não tiver o serve, instale globalmente
    npm install -g serve

    # Inicie o servidor na raiz do projeto
    serve
    ```
    Acesse o endereço fornecido pelo servidor (geralmente `http://localhost:3000`).

---

## 5. Estrutura do Projeto

```
/
├── components/       # Componentes reutilizáveis (UI, dashboard, etc.)
├── contexts/         # Provedores de contexto (Auth, Data, Toast)
├── data/             # Dados mockados para simular o banco de dados
├── docs/             # Documentação do projeto
├── hooks/            # Hooks customizados para lógica de estado e fetching
├── layouts/          # Estruturas de página (Main, PatientPortal, etc.)
├── pages/            # Componentes de página, mapeados pelas rotas
├── services/         # Lógica de negócio, "API" simulada, integrações
├── styles/           # Arquivos de estilização globais
├── types.ts          # Definições de tipos e interfaces do TypeScript
├── App.tsx           # Componente principal que configura o roteador
├── AppRoutes.tsx     # Definição de todas as rotas da aplicação
└── index.tsx         # Ponto de entrada da aplicação
```
