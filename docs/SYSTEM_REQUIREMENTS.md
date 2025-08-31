
# Requisitos do Sistema FisioFlow

Este documento define os requisitos funcionais e não-funcionais para o sistema FisioFlow.

## 1. Requisitos Funcionais (RF)

Os requisitos funcionais descrevem *o que* o sistema deve fazer.

### RF-01: Gestão de Autenticação e Acesso
-   **RF-01.1:** O sistema deve permitir o login de usuários com email e senha.
-   **RF-01.2:** O sistema deve suportar múltiplos perfis de usuário: `Admin`, `Fisioterapeuta`, `Paciente`, `EducadorFisico`.
-   **RF-01.3:** O sistema deve restringir o acesso a páginas e funcionalidades com base no perfil do usuário logado.
-   **RF-01.4:** Um usuário não autenticado só deve ter acesso à página de login.
-   **RF-01.5:** O sistema deve permitir o logout do usuário, encerrando sua sessão.

### RF-02: Gestão de Pacientes
-   **RF-02.1:** Fisioterapeutas devem poder criar, visualizar, editar e gerenciar o cadastro de pacientes.
-   **RF-02.2:** O cadastro do paciente deve incluir: dados pessoais, contato de emergência, endereço, histórico médico (alergias, alertas, cirurgias, condições) e consentimentos (LGPD, WhatsApp).
-   **RF-02.3:** Fisioterapeutas devem poder buscar pacientes por nome ou CPF.
-   **RF-02.4:** Fisioterapeutas devem poder filtrar a lista de pacientes por status (Ativo, Inativo, Alta).
-   **RF-02.5:** O sistema deve permitir o anexo de documentos (exames, laudos) ao perfil do paciente.

### RF-03: Agendamento
-   **RF-03.1:** O sistema deve exibir uma agenda em formato de calendário semanal.
-   **RF-03.2:** Fisioterapeutas devem poder visualizar a agenda de um ou múltiplos profissionais simultaneamente.
-   **RF-03.3:** Deve ser possível criar um novo agendamento para um paciente em um horário e dia específicos.
-   **RF-03.4:** O sistema deve permitir a edição de agendamentos existentes.
-   **RF-03.5:** O sistema deve detectar e impedir agendamentos que conflitem com horários já ocupados ou blocos de indisponibilidade.
-   **RF-03.6:** Fisioterapeutas devem poder definir blocos de indisponibilidade em suas agendas (ex: Almoço, Reunião).

### RF-04: Prontuário Eletrônico e Documentação Clínica
-   **RF-04.1:** Fisioterapeutas devem poder criar notas de evolução no formato SOAP (Subjetivo, Objetivo, Avaliação, Plano) para cada sessão.
-   **RF-04.2:** O sistema deve exibir o histórico de notas SOAP de um paciente em uma linha do tempo cronológica.
-   **RF-04.3:** O sistema deve permitir a criação e gerenciamento de um Plano de Tratamento para cada paciente, contendo diagnóstico, objetivos e prescrição de exercícios.
-   **RF-04.4:** Pacientes devem poder registrar pontos de dor em um mapa corporal interativo.

### RF-05: Integração com Inteligência Artificial
-   **RF-05.1:** O sistema deve usar a API do Google Gemini para gerar um rascunho de Laudo de Avaliação com base em dados inseridos pelo fisioterapeuta.
-   **RF-05.2:** O sistema deve usar a API do Google Gemini para gerar um rascunho de Evolução de Sessão (SOAP) a partir de anotações.
-   **RF-05.3:** O sistema deve usar a API do Google Gemini para gerar um Plano de Exercícios Domiciliar (HEP) detalhado.
-   **RF-05.4:** O sistema deve usar a API do Google Gemini para analisar dados do paciente e sugerir uma mensagem de contato para pacientes em risco de abandono.

### RF-06: Portal do Paciente
-   **RF-06.1:** Pacientes devem poder visualizar seus agendamentos futuros e passados.
-   **RF-06.2:** Pacientes devem poder visualizar seu plano de exercícios domiciliar.
-   **RF-06.3:** Pacientes devem poder registrar feedback sobre cada exercício, incluindo dificuldade, nível de dor e comentários.
-   **RF-06.4:** O feedback do paciente deve ficar visível para o fisioterapeuta no portal da clínica.
-   **RF-06.5:** O sistema deve apresentar o progresso do paciente de forma gamificada, com pontos, níveis e conquistas.

---

## 2. Requisitos Não-Funcionais (RNF)

Os requisitos não-funcionais descrevem *como* o sistema deve operar.

### RNF-01: Performance
-   **RNF-01.1:** O carregamento inicial da aplicação (App Shell) deve ser inferior a 3 segundos em uma conexão 3G.
-   **RNF-01.2:** As interações na UI, como abrir modais ou mudar de abas, devem ter uma resposta inferior a 200ms.
-   **RNF-01.3:** As chamadas à API de IA não devem bloquear a interface do usuário; um indicador de carregamento deve ser exibido durante o processamento.

### RNF-02: Usabilidade e UX
-   **RNF-02.1:** A interface deve ser intuitiva e seguir padrões de design consistentes em toda a aplicação.
-   **RNF-02.2:** O sistema deve ser responsivo, adaptando-se a diferentes tamanhos de tela (desktop, tablet).
-   **RNF-02.3:** O sistema deve fornecer feedback claro ao usuário após ações importantes (ex: toasts de sucesso ou erro).

### RNF-03: Confiabilidade
-   **RNF-03.1:** O sistema deve lidar graciosamente com falhas de rede ou erros da API, exibindo mensagens de erro amigáveis.
-   **RNF-03.2:** O estado da aplicação deve ser consistente. Ações de um usuário devem ser refletidas em tempo real em outras partes relevantes da UI (ex: criar um paciente na agenda deve atualizá-lo na lista de pacientes).

### RNF-04: Segurança
-   **RNF-04.1:** O acesso aos dados do paciente é restrito a usuários autenticados e autorizados.
-   **RNF-04.2:** A chave da API do Google Gemini deve ser gerenciada como uma variável de ambiente e nunca exposta no código do cliente.
-   **RNF-04.3:** O sistema deve estar em conformidade com os princípios da LGPD, como o registro de consentimento.

### RNF-05: Manutenibilidade
-   **RNF-05.1:** O código deve ser escrito em TypeScript, bem organizado em módulos e seguir as diretrizes de contribuição.
-   **RNF-05.2:** A lógica de negócio deve ser separada da UI, residindo na camada de serviços.

### RNF-06: Portabilidade
-   **RNF-06.1:** A aplicação deve ser compatível com os principais navegadores modernos (Chrome, Firefox, Safari, Edge).

### RNF-07: Disponibilidade Offline
-   **RNF-07.1:** A estrutura básica da aplicação (App Shell) deve ser acessível offline após a primeira visita.
-   **RNF-07.2:** Dados essenciais previamente carregados devem estar disponíveis para consulta offline.
