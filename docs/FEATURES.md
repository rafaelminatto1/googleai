
# Funcionalidades do Sistema FisioFlow

Este documento detalha as funcionalidades implementadas em cada um dos portais do sistema FisioFlow.

## 1. Portal da Clínica (Fisioterapeutas / Administradores)

Acesso principal para a equipe da clínica, com ferramentas completas de gestão e atendimento.

### Módulos Principais
-   **Dashboard Administrativo:**
    -   KPIs (Key Performance Indicators) de faturamento, pacientes ativos e novos pacientes.
    -   Resumo do dia: lista de consultas, tarefas pendentes e atividades recentes de pacientes.
    -   Gráficos de faturamento e fluxo de pacientes (novos vs. altas).
    -   Mapa de calor de horários mais movimentados.
    -   Gráfico de produtividade por fisioterapeuta.
-   **Dashboard Clínico:**
    -   KPIs de taxa de alta, média de sessões por tratamento e satisfação (NPS).
    -   Gráfico de evolução média da dor (EVA) dos pacientes.
    -   Gráfico de taxa de sucesso por patologia.
-   **Gestão de Pacientes:**
    -   Listagem de pacientes com busca, filtros (status, data) e paginação.
    -   Cadastro completo de novos pacientes com formulário multi-etapas.
    -   Edição de cadastro de pacientes existentes.
-   **Prontuário do Paciente (Página de Detalhes):**
    -   **Dashboard Clínico Individual:** Visão geral da evolução do paciente, KPIs, resumo clínico gerado por IA e mapa de dor interativo.
    -   **Histórico Clínico:** Linha do tempo de todas as evoluções (notas SOAP), com possibilidade de adicionar novas notas.
    -   **Plano de Tratamento:** Visualização do plano ativo com objetivos e exercícios prescritos.
    -   **Agendamentos:** Linha do tempo de consultas passadas e futuras.
    -   **Laudos e Anexos:** Geração de laudos com IA e upload de documentos.
-   **Agenda:**
    -   Visualização de calendário semanal.
    -   Filtro para visualizar a agenda de múltiplos fisioterapeutas lado a lado.
    -   Criação, edição e exclusão de agendamentos em um modal interativo.
    -   Visualização de blocos de indisponibilidade (almoço, reuniões).
    -   Detecção de conflitos de horários (com outros agendamentos e blocos).
    -   Indicador de hora atual em tempo real.
-   **Acompanhamento Proativo:**
    -   Painel que categoriza pacientes ativos em: **Risco de Abandono**, **Risco Elevado** e **Pontos de Atenção**.
    -   Cards de paciente com ações rápidas: registrar contato, remarcar, adicionar observação.
    -   Sugestão de mensagem de contato gerada por IA.

### Ferramentas de IA (Google Gemini)
-   **Gerador de Laudo de Avaliação:** Gera um laudo cinesiofuncional completo a partir de dados brutos da avaliação.
-   **Gerador de Evolução de Sessão:** Converte anotações rápidas em uma nota de evolução estruturada no formato SOAP.
-   **Gerador de Plano de Exercícios (HEP):** Cria um plano de exercícios domiciliar didático e detalhado a partir de uma lista de exercícios e parâmetros.
-   **Análise de Risco:** Analisa dados do paciente (faltas, remarcações, feedback) para prever o risco de abandono e sugerir um plano de ação.
-   **IA Econômica:** Um sistema de orquestração de IA que prioriza fontes de dados internas e cache antes de usar APIs pagas, com um dashboard para monitorar o uso e a economia.

### Módulos de Gestão
-   **Biblioteca de Exercícios:**
    -   Criação e gerenciamento de grupos (categorias) de exercícios.
    -   Cadastro, edição e exclusão de exercícios individuais, com suporte a vídeo, imagens e instruções detalhadas.
-   **Financeiro:**
    -   Dashboard financeiro com KPIs de receita, despesas e lucro.
    -   Gráficos de fluxo de caixa e composição de despesas.
    -   Registro e gerenciamento de despesas.
-   **Gestão de Parcerias:**
    -   Cadastro e gerenciamento de profissionais parceiros (ex: Educadores Físicos).
    -   Venda de vouchers de serviços de parceiros diretamente pela clínica.
-   **Configurações:**
    -   **Configurações da Agenda:** Definição de limites de pacientes por horário.
    -   **Configurações da IA:** Gerenciamento de provedores de IA e definição do provedor padrão.

---

## 2. Portal do Paciente

Área exclusiva para pacientes, focada em engajamento, comunicação e acompanhamento do tratamento.

-   **Dashboard do Paciente:**
    -   Mensagem de boas-vindas.
    -   Ações rápidas: "Registrar Dor" e "Ver Exercícios".
    -   Card com a próxima consulta agendada.
-   **Meus Exercícios:**
    -   Visualização do plano de exercícios prescrito pelo fisioterapeuta.
    -   Cards interativos para cada exercício.
    -   **Sistema de Feedback:** Paciente pode avaliar a dificuldade (fácil, médio, difícil), o nível de dor (0-10) e adicionar comentários para cada exercício realizado. O feedback é salvo e visível para o fisioterapeuta.
-   **Diário de Dor:**
    -   Mapa corporal interativo (frente e costas) para registrar a localização exata da dor.
    -   Modal para detalhar intensidade, tipo e descrição da dor.
    -   Gráfico que mostra a evolução da intensidade da dor ao longo do tempo.
-   **Meu Progresso:**
    -   Resumo gerado por IA que compara a avaliação inicial com o estado atual, destacando melhoras de forma motivadora.
    -   Gráficos de evolução para métricas específicas (ex: Amplitude de Movimento).
-   **Gamificação:**
    -   Sistema de pontos e níveis baseado na conclusão de atividades (sessões, exercícios, registro de dor).
    -   Acompanhamento da sequência (streak) de dias com atividades.
    -   Galeria de conquistas (badges) que são desbloqueadas ao atingir marcos.
-   **Serviços da Parceria:**
    -   Visualização e compra de planos de serviço oferecidos por profissionais parceiros.
    -   Acompanhamento dos vouchers e créditos comprados.

---

## 3. Portal de Parceiros

Área para profissionais externos (ex: Educadores Físicos) colaborarem no cuidado do paciente.

-   **Dashboard do Parceiro:**
    -   Visão geral com o número de clientes ativos e outras métricas relevantes.
-   **Meus Clientes:**
    -   Lista de todos os pacientes que adquiriram seus planos de serviço.
    -   Acesso a uma página de detalhes de cada cliente, com visualização segura e limitada do histórico clínico relevante (últimas notas SOAP, diário de dor) para auxiliar na prescrição do treino.
-   **Biblioteca de Exercícios:**
    -   Acesso de leitura à biblioteca de exercícios da clínica.
    -   Funcionalidade para sugerir a adição de novos exercícios (que passarão por aprovação do fisioterapeuta).
-   **Financeiro:**
    -   Painel para acompanhamento das vendas de seus planos e o valor de comissão a ser recebido.
