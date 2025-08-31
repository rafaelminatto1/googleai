
# Referência da API (Camada de Serviços)

Este documento descreve a camada de serviços do FisioFlow. Embora o sistema utilize um backend simulado (`mockDb.ts`), esta camada é projetada para funcionar como uma interface de API consistente, que poderia ser facilmente adaptada para consumir uma API RESTful ou GraphQL real.

As funções aqui documentadas representam os "endpoints" disponíveis para a aplicação frontend.

**Modelo de Dados Principal:** Todas as interfaces de tipo (ex: `Patient`, `Appointment`) estão definidas em `src/types.ts`.

---

## `patientService.ts`

Gerencia todas as operações relacionadas a pacientes.

### `getAllPatients(): Promise<Patient[]>`
-   **Descrição:** Retorna uma lista de todos os pacientes cadastrados.
-   **Retorna:** Uma `Promise` que resolve para um array de objetos `Patient`.

### `getPatientById(id: string): Promise<Patient | undefined>`
-   **Descrição:** Busca um paciente específico pelo seu ID.
-   **Parâmetros:**
    -   `id` (string): O ID único do paciente.
-   **Retorna:** Uma `Promise` que resolve para o objeto `Patient` ou `undefined` se não for encontrado.

### `addPatient(patientData: Omit<Patient, 'id' | 'lastVisit'>): Promise<Patient>`
-   **Descrição:** Adiciona um novo paciente ao sistema.
-   **Parâmetros:**
    -   `patientData` (object): Um objeto contendo todos os dados do novo paciente, exceto o `id`.
-   **Retorna:** Uma `Promise` que resolve para o objeto `Patient` recém-criado, incluindo o novo `id`.
-   **Efeitos Colaterais:** Emite o evento `patients:changed`.

### `updatePatient(updatedPatient: Patient): Promise<Patient>`
-   **Descrição:** Atualiza os dados de um paciente existente.
-   **Parâmetros:**
    -   `updatedPatient` (object): O objeto `Patient` completo com os dados atualizados.
-   **Retorna:** Uma `Promise` que resolve para o objeto `Patient` atualizado.
-   **Efeitos Colaterais:** Emite o evento `patients:changed`.

### `savePainPoints(patientId: string, painPoints: PainPoint[]): Promise<Patient>`
-   **Descrição:** Salva ou atualiza a lista de pontos de dor para um paciente.
-   **Parâmetros:**
    -   `patientId` (string): O ID do paciente.
    -   `painPoints` (PainPoint[]): O array completo e atualizado de pontos de dor.
-   **Retorna:** Uma `Promise` que resolve para o objeto `Patient` atualizado.
-   **Efeitos Colaterais:** Emite o evento `patients:changed`.

---

## `appointmentService.ts`

Gerencia agendamentos e a agenda.

### `getAppointments(startDate?: Date, endDate?: Date): Promise<Appointment[]>`
-   **Descrição:** Retorna uma lista de agendamentos. Pode ser filtrada por um intervalo de datas.
-   **Parâmetros (Opcionais):**
    -   `startDate` (Date): Data de início do filtro.
    -   `endDate` (Date): Data de fim do filtro.
-   **Retorna:** Uma `Promise` que resolve para um array de objetos `Appointment`.

### `saveAppointment(appointmentData: Appointment): Promise<Appointment>`
-   **Descrição:** Cria um novo agendamento ou atualiza um existente.
-   **Parâmetros:**
    -   `appointmentData` (object): O objeto `Appointment` a ser salvo. Se contiver um `id` existente, ele será atualizado.
-   **Retorna:** Uma `Promise` que resolve para o objeto `Appointment` salvo.
-   **Efeitos Colaterais:** Emite o evento `appointments:changed`.

### `deleteAppointment(id: string): Promise<void>`
-   **Descrição:** Exclui um único agendamento.
-   **Parâmetros:**
    -   `id` (string): O ID do agendamento a ser excluído.
-   **Efeitos Colaterais:** Emite o evento `appointments:changed`.

---

## `soapNoteService.ts`

Gerencia as notas de evolução clínica (SOAP).

### `getNotesByPatientId(patientId: string): Promise<SoapNote[]>`
-   **Descrição:** Retorna todas as notas SOAP de um paciente específico, ordenadas da mais recente para a mais antiga.
-   **Parâmetros:**
    -   `patientId` (string): O ID do paciente.
-   **Retorna:** Uma `Promise` que resolve para um array de objetos `SoapNote`.

### `addNote(patientId: string, noteData: Omit<SoapNote, 'id' | 'patientId' | 'therapist'>): Promise<SoapNote>`
-   **Descrição:** Adiciona uma nova nota SOAP para um paciente.
-   **Parâmetros:**
    -   `patientId` (string): O ID do paciente ao qual a nota pertence.
    -   `noteData` (object): Os dados da nota (S, O, A, P, etc.).
-   **Retorna:** Uma `Promise` que resolve para o objeto `SoapNote` recém-criado.
-   **Efeitos Colaterais:** Emite o evento `notes:changed`.

---

## `evaluationService.ts`

Gerencia o feedback dos pacientes sobre os exercícios.

### `getEvaluationsByPatientId(patientId: string): Promise<ExerciseEvaluation[]>`
-   **Descrição:** Busca todas as avaliações de exercícios feitas por um paciente.
-   **Parâmetros:**
    -   `patientId` (string): O ID do paciente.
-   **Retorna:** Um array de objetos `ExerciseEvaluation`.

### `addEvaluation(data: Omit<ExerciseEvaluation, 'id' | 'date'>): Promise<ExerciseEvaluation>`
-   **Descrição:** Salva uma nova avaliação de exercício. Se já existir uma avaliação para o mesmo exercício no mesmo dia, ela é atualizada.
-   **Parâmetros:**
    -   `data` (object): Os dados da avaliação.
-   **Retorna:** O objeto `ExerciseEvaluation` salvo.
-   **Efeitos Colaterais:** Emite o evento `evaluations:changed`.

---

## `geminiService.ts`

Interface de comunicação com a API do Google Gemini.

### `generateEvaluationReport(data: EvaluationFormData): Promise<string>`
-   **Descrição:** Gera um laudo de avaliação completo em Markdown.
-   **Parâmetros:**
    -   `data` (object): Um objeto `EvaluationFormData` com os dados brutos da avaliação.
-   **Retorna:** Uma `Promise` que resolve para uma string contendo o laudo em formato Markdown.

### `generateSessionEvolution(data: SessionEvolutionFormData): Promise<string>`
-   **Descrição:** Gera uma nota de evolução SOAP em Markdown.
-   **Parâmetros:**
    -   `data` (object): Um objeto `SessionEvolutionFormData` com as anotações da sessão.
-   **Retorna:** Uma `Promise` que resolve para uma string contendo a nota SOAP em formato Markdown.

*(... e outras funções como `generateHep`, `generateRiskAnalysis`, etc.)*

---

## `eventService.ts`

Gerencia o sistema de eventos Pub/Sub para reatividade da UI.

### `on(eventName: string, listener: Function): void`
-   **Descrição:** Inscreve uma função (listener) para um determinado evento.
-   **Parâmetros:**
    -   `eventName` (string): O nome do evento (ex: `patients:changed`).
    -   `listener` (Function): A função a ser executada quando o evento for emitido.

### `emit(eventName: string, ...args: any[]): void`
-   **Descrição:** Dispara um evento, executando todos os listeners inscritos.
-   **Parámetros:**
    -   `eventName` (string): O nome do evento a ser emitido.
    -   `args`: Argumentos opcionais a serem passados para os listeners.

### `off(eventName: string, listener: Function): void`
-   **Descrição:** Remove um listener de um evento.
