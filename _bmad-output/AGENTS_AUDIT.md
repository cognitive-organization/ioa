# IOA Agent Audit — BMAD → IOA Transition

**Data:** 2026-02-25
**Autor:** Paulo Lima (via BMAD audit process)
**Versão IOA:** v0.2.0 "Runtime Architecture"
**Escopo:** Mapeamento dos 9 agents BMAD existentes para o time de 9 agents IOA necessários

---

## 1. Inventário dos Agents BMAD Existentes

| # | Agent BMAD | Role Original | Decisão | Justificativa | Novo Papel IOA | Domain IOA |
|---|-----------|---------------|---------|---------------|----------------|------------|
| 1 | Mary (analyst) | Business Analyst: market research, competitive analysis, requirements | **REDEFINE** | Habilidades analíticas (pesquisa, análise competitiva, levantamento de requisitos) são diretamente transferíveis para análise de custos, ROI e economia de agentes. O domínio muda de "mercado" para "finanças operacionais de agentes". | **Agent 03 — Economics & FinOps for Agents** | Economics / FinOps |
| 2 | Winston (architect) | System Architect: distributed systems, cloud, API design | **REDEFINE** | Competências em arquitetura distribuída, cloud e API design são diretamente aplicáveis ao modelo de recursos IOA (spec/status, reconciliation loops, controller patterns). Escopo reduzido de "qualquer sistema" para "IOA runtime model" especificamente. | **Agent 01 — Chief Architect (IOA Runtime)** | Runtime / Core Model |
| 3 | Amelia (dev) | Developer: story execution, TDD, code implementation | **KEEP** | Papel de execução permanece essencial. Amelia implementa schemas TypeScript, CLI commands, templates e testes. Vinculada ao domínio DX como braço de implementação do Agent 09. | **Amelia (dev) → bound to Agent 09 — DX / CLI Scaffolder** | DX / Tooling |
| 4 | John (pm) | Product Manager: PRD creation, requirements discovery | **REDEFINE** | Visão de produto, storytelling e discovery de requisitos são repurposados para construir o movimento IOA: manifesto, documentação pública, anti-patterns, quickstart guides. O "produto" agora é a adoção do standard. | **Agent 08 — Docs & Movement Editor** | Community / Adoption |
| 5 | Quinn (qa) | QA Engineer: test automation, API/E2E testing | **REDEFINE** | Rigor de QA (consistência, validação, cobertura de edge cases) aplicado diretamente a JSON Schemas, enums, type safety e auditoria de consistência cross-schema. Testes de schema são os "E2E tests" do IOA. | **Agent 04 — Schemas & Standards Engineer** | Schemas / Standards |
| 6 | Bob (sm) | Scrum Master: sprint planning, stories, backlog management | **MERGE** | Habilidades de planejamento de sprint, gestão de backlog e orquestração de trabalho são absorvidas pelo Workflow Orchestrator. O conceito de "sprint" se generaliza para DAGs de workflow e orchestration cross-domain. Bob deixa de existir como entidade separada. | **Agent 05 — Workflow Orchestrator** | Orchestration / Workflow |
| 7 | Sally (ux-designer) | UX Designer: user research, UI patterns | **DELETE** | IOA é um standard backend (schemas YAML/JSON, CLI, runtime model). Não existe domínio de UI/UX. Nenhuma habilidade de Sally é transferível para o escopo atual do projeto. | — | — |
| 8 | Barry (quick-flow-solo-dev) | Quick Flow Solo Dev: rapid spec + lean implementation | **DELETE** | O pattern solo-dev conflita diretamente com o princípio de orquestração multi-agent do IOA. Manter Barry criaria um anti-pattern dentro do próprio projeto que define patterns de colaboração entre agentes. | — | — |
| 9 | BMad Master (bmad-master) | System: runtime resource mgmt, workflow orchestration | **KEEP** | O orquestrador de sistema mapeia diretamente para o reconciliation loop do IOA Runtime. BMad Master é o "controller" que gerencia ciclo de vida dos agents IOA, análogo ao kube-controller-manager. | **BMad Master → IOA Runtime Controller** | System / Meta |

### Resumo de Decisões

| Decisão | Qtd | Agents |
|---------|-----|--------|
| KEEP | 2 | Amelia (dev), BMad Master |
| REDEFINE | 4 | Mary → FinOps, Winston → Chief Architect, John → Docs Editor, Quinn → Schemas Engineer |
| MERGE | 1 | Bob → Workflow Orchestrator |
| DELETE | 2 | Sally (ux-designer), Barry (quick-flow-solo-dev) |

---

## 2. Lacunas Críticas (Gap Analysis)

| # | Gap | Prioridade | Cobertura Atual | Agent Necessário | Artefato Necessário |
|---|-----|-----------|-----------------|------------------|---------------------|
| 1 | Security / Trust | **P0** | ZERO — nenhum schema, nenhum princípio de segurança explícito, nenhum modelo de ameaças | **Agent 02 — Security & Trust Governor** | `SecurityPolicy` schema (JSON Schema draft-07) + threat model para agent-to-agent communication + audit trail spec + zero-trust reference architecture |
| 2 | Economics / Cost | **P0** | ZERO — nenhum recurso de orçamento, nenhuma contabilidade de tokens, nenhum modelo de ROI | **Agent 03 — Economics & FinOps for Agents** (Mary redefinida) | `Budget` resource (spec/status) + token accounting templates + cost-per-decision model + ROI framework para agent operations |
| 3 | Status subresource | **P0** | PARCIAL — schemas já possuem campo `status` mas não existe lógica de reconciliação, nem controller spec, nem estado desejado vs. observado | **Agent 01 — Chief Architect / IOA Runtime** (Winston redefinido) | Controller spec document + reconciliation loop patterns + desired-state vs observed-state model + convergence criteria |
| 4 | Workflow resource | **P0** | DONE — schema Workflow implementado em v0.2 com DAG, steps, conditions | **Agent 05 — Workflow Orchestrator** (Bob merged) | Exemplos avançados + guidelines de uso + compensation/rollback patterns + cross-domain orchestration examples |
| 5 | Decision schema | **P0** | MOSTLY DONE — status `active` adicionado, mas enums inconsistentes e campos opcionais ambíguos | **Agent 04 — Schemas & Standards Engineer** (Quinn redefinida) | Consistency audit report + enum harmonization cross-schema + campo-a-campo review + breaking changes log |
| 6 | Memory schema | **P1** | ZERO — nenhum recurso Memory, nenhuma política de retenção, nenhum modelo de contexto | **Agent 07 — Memory Systems Architect** | `Memory` resource (spec/status) + retention policies (TTL, relevance decay) + context window management patterns + knowledge graph spec |
| 7 | Telemetry vs Observability | **P1** | PARCIAL — Telemetry schema existe mas mistura eventos, métricas e traces sem separação clara. Sem SLIs/SLOs definidos | **Agent 06 — Telemetry & Observability Lead** | Event taxonomy (structured categories) + SLI/SLO templates + separation of concerns (events vs metrics vs traces) + observability pipeline reference |
| 8 | Cognitive Load | **P1** | PARCIAL — princípio "Cognitive Load Awareness" existe na doctrine mas sem schema, sem métricas, sem thresholds operacionais | **Agent 06 — Telemetry & Observability Lead** | Cognitive load metrics schema + measurement methodology + threshold definitions + alerting rules para overload detection |

### Cobertura por Prioridade

| Prioridade | Total Gaps | ZERO Coverage | PARCIAL | DONE/MOSTLY |
|-----------|-----------|---------------|---------|-------------|
| P0 | 5 | 2 | 1 | 2 |
| P1 | 3 | 1 | 2 | 0 |

---

## 3. Mapa de Transição

```
BMAD AGENT          DECISÃO        IOA AGENT                         IOA DOMAIN/LAYER
═══════════════════ ══════════════ ═════════════════════════════════ ═══════════════════════
Winston (architect) ─→ REDEFINE ─→ Agent 01: Chief Architect         Runtime / Core Model
         ·                         (IOA Runtime)
         ·                         resource model, spec/status,
         ·                         reconciliation loops

[NOVO]              ─→ CREATE   ─→ Agent 02: Security & Trust        Security / Governance
                                   Governor
                                   SecurityPolicy, zero-trust,
                                   audit trail

Mary (analyst)      ─→ REDEFINE ─→ Agent 03: Economics & FinOps      Economics / FinOps
                                   for Agents
                                   Budget resource, token accounting,
                                   ROI

Quinn (qa)          ─→ REDEFINE ─→ Agent 04: Schemas & Standards     Schemas / Standards
                                   Engineer
                                   JSON schemas, enums, validation,
                                   consistency

Bob (sm)            ─→ MERGE    ─→ Agent 05: Workflow Orchestrator   Orchestration / Workflow
                                   Workflow resource, cross-domain
                                   orchestration, compensation

[NOVO]              ─→ CREATE   ─→ Agent 06: Telemetry &             Observability
                                   Observability Lead
                                   events, traces, SLIs/SLOs,
                                   cognitive load metrics

[NOVO]              ─→ CREATE   ─→ Agent 07: Memory Systems          Memory / Context
                                   Architect
                                   Memory resource, retention,
                                   context management

John (pm)           ─→ REDEFINE ─→ Agent 08: Docs & Movement         Community / Adoption
                                   Editor
                                   manifesto, README, anti-patterns,
                                   quickstart

Amelia (dev)        ─→ KEEP     ─→ Agent 09: DX / CLI Scaffolder     DX / Tooling
                                   (Amelia bound)
                                   ioa init scaffold, templates,
                                   CLI implementation

Sally (ux-designer) ─→ DELETE      —                                  —
Barry (quick-flow)  ─→ DELETE      —                                  —
BMad Master         ─→ KEEP     ─→ IOA Runtime Controller            System / Meta
                                   (system orchestrator)
```

### Fluxo de Criação de Agents

```
Fase 1 — Reutilizar (imediato):
  Winston → Agent 01 (Chief Architect)
  Quinn   → Agent 04 (Schemas Engineer)
  Amelia  → Agent 09 (DX / CLI) [keep]
  BMad Master → Runtime Controller [keep]

Fase 2 — Redefinir (semana 1):
  Mary → Agent 03 (Economics & FinOps)
  John → Agent 08 (Docs & Movement)
  Bob  → Agent 05 (Workflow Orchestrator) [merge]

Fase 3 — Criar do zero (semana 2):
  Agent 02 (Security & Trust Governor) [NOVO]
  Agent 06 (Telemetry & Observability Lead) [NOVO]
  Agent 07 (Memory Systems Architect) [NOVO]

Fase 4 — Remover (imediato):
  Sally (ux-designer) [DELETE]
  Barry (quick-flow-solo-dev) [DELETE]
```

---

## 4. Suposições

1. **Escopo limitado a backend/standard.** IOA v0.2 não possui e não planeja ter interface gráfica. Isso justifica a remoção de Sally (UX). Se um dashboard de observabilidade for adicionado no futuro, um agent de UX pode ser reintroduzido.

2. **Multi-agent é princípio inegociável.** A remoção de Barry (solo-dev) assume que todo trabalho no IOA segue o pattern de orquestração multi-agent. Tarefas triviais (hotfixes, typos) podem ser executadas diretamente por Amelia sem necessidade de um agent solo-dev dedicado.

3. **BMad Master é suficiente como meta-orchestrator.** Assume-se que o BMad Master existente pode ser estendido (não reescrito) para funcionar como IOA Runtime Controller. Se a complexidade do reconciliation loop exigir, um agent dedicado de runtime pode ser necessário.

4. **Agents BMAD redefinidos mantêm suas capabilities base.** Mary continua sabendo fazer análise — apenas o domínio muda de "mercado" para "economia de agentes". O mesmo vale para Winston, John, Quinn e Bob. Não é necessário reescrever system prompts do zero, apenas adaptar escopo e contexto.

5. **3 agents precisam ser criados do zero.** Security (Agent 02), Telemetry (Agent 06) e Memory (Agent 07) não possuem nenhum equivalente no BMAD atual. Seus system prompts, tools e workflows precisam ser escritos completamente.

6. **Prioridades P0 devem ser resolvidas antes de P1.** A ordem de criação dos agents segue a prioridade dos gaps: primeiro Security e Economics (P0, zero coverage), depois Memory e Telemetry refinements (P1).

7. **Agent 06 (Telemetry Lead) cobre dois gaps.** Tanto "Telemetry vs Observability" quanto "Cognitive Load" são responsabilidade do mesmo agent. Se a carga se mostrar excessiva, Cognitive Load pode ser extraído para um agent dedicado.

8. **Workflow (P0) já está DONE no schema.** O gap remanescente é de exemplos, guidelines e compensation patterns — não de implementação base. Agent 05 foca em documentação e extensão, não em criar o schema do zero.

9. **O IOA Project Board (github.com/users/paribali/projects/2) será usado para tracking** das issues de criação de cada agent, seguindo o mesmo fluxo Tonight/Backlog/In Progress/Done.

10. **Schemas seguem JSON Schema draft-07.** Todos os novos recursos (SecurityPolicy, Budget, Memory) devem aderir ao mesmo padrão dos schemas existentes em `@ioa/schemas`.

---

*Gerado como parte do processo de auditoria BMAD → IOA. Este documento serve como source of truth para a transição do time de agents.*
