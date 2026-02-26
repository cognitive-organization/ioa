# IOA Repo Blueprint — Estrutura Alvo v0.2

**Data:** 2026-02-25
**Projeto:** cognitive-organization-ioa
**Fase:** Pos-BMAD Audit — mapa completo de arquivos apos todos os epicos

---

## Estrutura de Diretorios

```
cognitive-organization-ioa/
│
├── README.md                              # Reescrito (IOA-015) — compelling, quickstart
├── CLAUDE.md                              # Dev guide (existente, atualizar)
├── CONTRIBUTING.md                        # Existente
├── CHANGELOG.md                           # Release notes (IOA-016)
├── package.json                           # Existente (pnpm workspace)
├── tsconfig.json                          # Existente
│
├── .github/
│   ├── workflows/
│   │   └── ci.yml                        # Existente
│   ├── ISSUE_TEMPLATE/
│   │   └── doctrine_amendment.md         # Existente
│   └── PULL_REQUEST_TEMPLATE.md          # Existente
│
├── _strategy/                             # Existente — docs estrategicos
│   ├── 01-landscape-analysis.md
│   ├── 02-doctrine-critique.md
│   ├── 03-roadmap-90days.md
│   └── 04-v0.2-spec.md
│
├── _bmad-output/                          # NOVO — Outputs do BMAD/IOA Agent Team
│   ├── AGENTS_AUDIT.md                   # Fase 1: Audit BMAD → IOA (IOA-000)
│   ├── IOA_AGENT_TEAM.md                 # Fase 2: 9 agents definidos
│   ├── IOA_BACKLOG.md                    # Fase 3: Epicos + Issues
│   └── REPO_BLUEPRINT.md                # Este arquivo
│
├── docs/                                  # NOVO — Documentacao publica
│   ├── manifesto.md                      # IOA Manifesto v0.2 (IOA-016)
│   ├── anti-patterns.md                  # Anti-Patterns Playbook (IOA-016)
│   ├── getting-started.md                # Getting Started guide (IOA-017)
│   ├── why-ioa.md                        # "Why IOA / Why Now" (IOA-016)
│   ├── glossary.md                       # Glossario IOA (IOA-017)
│   ├── resource-model.md                 # Resource Model v0.2 (IOA-001)
│   ├── controller-spec.md                # Controller Reconciliation (IOA-002)
│   │
│   ├── diagrams/                         # NOVO
│   │   └── resource-dependencies.md      # Mermaid diagrams (IOA-001)
│   │
│   ├── security/                         # NOVO
│   │   └── threat-model.md              # Threat model por resource (IOA-004)
│   │
│   ├── economics/                        # NOVO
│   │   └── token-accounting.md          # Modelo de token accounting (IOA-006)
│   │
│   ├── workflows/                        # NOVO
│   │   ├── pattern-catalog.md           # 5+ patterns (IOA-007)
│   │   ├── state-machine.md             # Maquina de estados formal (IOA-008)
│   │   └── error-handling.md            # Guia de error handling (IOA-008)
│   │
│   ├── memory/                           # NOVO
│   │   ├── compounding-patterns.md      # Compounding memory (IOA-011)
│   │   └── retention-policies.md        # Templates de retencao (IOA-011)
│   │
│   ├── telemetry/                        # NOVO
│   │   ├── event-taxonomy.md            # Eventos por resource (IOA-012)
│   │   ├── observability-guide.md       # Telemetry vs Observability (IOA-012)
│   │   ├── sli-slo-templates.md         # Templates SLI/SLO (IOA-013)
│   │   └── cognitive-load-metrics.md    # Metricas de carga cognitiva (IOA-014)
│   │
│   └── schemas/                          # NOVO
│       └── consistency-report.md        # Resultado do audit de schemas (IOA-009)
│
├── packages/
│   ├── doctrine/                         # @ioa/doctrine — SEM MUDANCAS
│   │   ├── content/v0.1/                # 12 principios
│   │   └── src/
│   │
│   ├── schemas/                          # @ioa/schemas — EXPANDIDO
│   │   ├── src/
│   │   │   ├── domain.schema.json       # Existente
│   │   │   ├── agent.schema.json        # Existente (atualizar refs)
│   │   │   ├── decision.schema.json     # Existente (fix enums IOA-009)
│   │   │   ├── telemetry.schema.json    # Existente (atualizar IOA-012)
│   │   │   ├── governance.schema.json   # Existente
│   │   │   ├── workflow.schema.json     # Existente (atualizar IOA-007/008)
│   │   │   ├── config.schema.json       # Existente
│   │   │   ├── security-policy.schema.json  # NOVO (IOA-003)
│   │   │   ├── budget.schema.json       # NOVO (IOA-005)
│   │   │   ├── memory.schema.json       # NOVO (IOA-010)
│   │   │   ├── controller.schema.json   # NOVO (IOA-002, draft)
│   │   │   │
│   │   │   ├── types/
│   │   │   │   ├── index.ts             # Existente (atualizar exports)
│   │   │   │   └── resources.ts         # Existente (EXPANDIR com novos types)
│   │   │   │
│   │   │   └── validators/
│   │   │       └── index.ts             # Existente (adicionar novos validators)
│   │   └── dist/
│   │
│   ├── templates/                        # @ioa/templates — EXPANDIDO
│   │   ├── scaffolds/
│   │   │   ├── init/                    # Existente (.ioa/ structure)
│   │   │   ├── domain.yaml.hbs          # NOVO (IOA-018)
│   │   │   ├── agent.yaml.hbs           # NOVO (IOA-018)
│   │   │   ├── workflow.yaml.hbs        # NOVO (IOA-018)
│   │   │   ├── budget-startup.yaml      # NOVO (IOA-006)
│   │   │   └── budget-enterprise.yaml   # NOVO (IOA-006)
│   │   └── src/
│   │
│   └── cli/                              # @ioa/cli — EXPANDIDO
│       ├── bin/ioa.js                   # Existente
│       ├── src/
│       │   ├── index.ts                 # Existente
│       │   └── commands/
│       │       ├── init.ts              # Existente
│       │       ├── validate.ts          # Existente (atualizar para novos schemas)
│       │       ├── status.ts            # Existente (atualizar dashboard)
│       │       ├── migrate.ts           # Existente
│       │       └── generate.ts          # NOVO (IOA-018)
│       └── dist/
│
├── examples/
│   ├── ai-native-startup/               # Existente — EXPANDIR
│   │   └── .ioa/
│   │       ├── config.json
│   │       ├── domains/ (3)
│   │       ├── agents/ (4)
│   │       ├── decisions/ (2)
│   │       ├── telemetry/ (2)
│   │       ├── governance/ (1)
│   │       ├── workflows/ (1)
│   │       ├── security/               # NOVO
│   │       │   └── default-security.yaml
│   │       ├── budgets/                # NOVO
│   │       │   └── product-budget.yaml
│   │       └── memory/                 # NOVO
│   │           └── product-context.yaml
│   │
│   └── enterprise-migration/            # NOVO (futuro, referencia)
│       └── .ioa/ (TBD)
│
└── templates/                            # NOVO — Templates standalone (fora de packages)
    ├── budget-startup.yaml              # Budget template: cenario startup
    ├── budget-enterprise.yaml           # Budget template: cenario enterprise
    ├── budget-hybrid.yaml               # Budget template: cenario hibrido
    ├── sli-domain.yaml                  # Template SLI para domains (IOA-013)
    └── sli-agent.yaml                   # Template SLI para agents (IOA-013)
```

---

## Convencoes

### Naming

- **Schemas:** `kebab-case.schema.json`
- **YAML resources:** `kebab-case.yaml`
- **Docs:** `kebab-case.md`
- **TypeScript:** `camelCase` (vars/funcs), `PascalCase` (types/interfaces)

### Estrutura de Resource YAML

```yaml
apiVersion: ioa.dev/v0.2
kind: <ResourceKind>
metadata:
  name: <kebab-case>
  owner:
    name: <string>
    role: <string>
  labels: {}
  annotations: {}
spec:
  # Especificacao do resource
status:
  # Estado em runtime (gerenciado por controllers)
  conditions: []
```

### Versionamento

- **Schemas:** semver via @changesets
- **Doctrine:** imutavel v0.1, amendments via PR process
- **Docs:** versionados junto com schemas

---

## Diretorios por Responsabilidade

| Diretorio | Responsavel | Conteudo |
|-----------|-------------|----------|
| `_strategy/` | Agent 01 (Architect) | Analises estrategicas, specs |
| `_bmad-output/` | Sistema BMAD | Outputs de agents/workflows |
| `docs/` | Agent 08 (Docs) | Documentacao publica |
| `docs/security/` | Agent 02 (Security) | Threat models, policies |
| `docs/economics/` | Agent 03 (Economics) | Token accounting, budgets |
| `docs/workflows/` | Agent 05 (Workflow) | Patterns, state machines |
| `docs/memory/` | Agent 07 (Memory) | Patterns, retencao |
| `docs/telemetry/` | Agent 06 (Telemetry) | Eventos, SLIs, observability |
| `docs/schemas/` | Agent 04 (Schemas) | Relatorios de consistencia |
| `packages/schemas/` | Agent 04 (Schemas) | JSON Schemas + types |
| `packages/cli/` | Agent 09 (CLI) | Comandos CLI |
| `packages/templates/` | Agent 09 (CLI) | Scaffold templates |
| `packages/doctrine/` | Agent 08 (Docs) | Principios (read-only) |
| `examples/` | Agent 04 + Agent 08 | Implementacoes de referencia |

---

## Arquivos Novos vs Existentes

### Novos (a criar)

| Path | Issue | Agent |
|------|-------|-------|
| `docs/resource-model.md` | IOA-001 | 01 |
| `docs/diagrams/resource-dependencies.md` | IOA-001 | 01 |
| `docs/controller-spec.md` | IOA-002 | 01 |
| `packages/schemas/src/security-policy.schema.json` | IOA-003 | 02+04 |
| `docs/security/threat-model.md` | IOA-004 | 02 |
| `packages/schemas/src/budget.schema.json` | IOA-005 | 03+04 |
| `docs/economics/token-accounting.md` | IOA-006 | 03 |
| `docs/workflows/pattern-catalog.md` | IOA-007 | 05 |
| `docs/workflows/state-machine.md` | IOA-008 | 05 |
| `docs/workflows/error-handling.md` | IOA-008 | 05 |
| `docs/schemas/consistency-report.md` | IOA-009 | 04 |
| `packages/schemas/src/memory.schema.json` | IOA-010 | 07+04 |
| `docs/memory/compounding-patterns.md` | IOA-011 | 07 |
| `docs/memory/retention-policies.md` | IOA-011 | 07 |
| `docs/telemetry/event-taxonomy.md` | IOA-012 | 06 |
| `docs/telemetry/observability-guide.md` | IOA-012 | 06 |
| `docs/telemetry/sli-slo-templates.md` | IOA-013 | 06 |
| `docs/telemetry/cognitive-load-metrics.md` | IOA-014 | 06 |
| `docs/manifesto.md` | IOA-016 | 08 |
| `docs/anti-patterns.md` | IOA-016 | 08 |
| `docs/getting-started.md` | IOA-017 | 08 |
| `docs/why-ioa.md` | IOA-016 | 08 |
| `docs/glossary.md` | IOA-017 | 08 |
| `packages/cli/src/commands/generate.ts` | IOA-018 | 09 |
| `packages/schemas/src/controller.schema.json` | IOA-002 | 01 |

### Existentes (a modificar)

| Path | Issue | Mudanca |
|------|-------|---------|
| `README.md` | IOA-015 | Rewrite completo |
| `packages/schemas/src/decision.schema.json` | IOA-009 | Fix enums |
| `packages/schemas/src/types/resources.ts` | IOA-003,005,010 | Adicionar novos types |
| `packages/schemas/src/validators/index.ts` | IOA-003,005,010 | Adicionar novos validators |
| `examples/ai-native-startup/.ioa/` | IOA-003,005,010 | Adicionar dirs security/budget/memory |

---

## IOA Compliance Checklist (por projeto)

Um projeto e "IOA Compliant v0.2" se:

- [ ] Possui `.ioa/config.json` valido
- [ ] Pelo menos 1 Domain resource com spec/status
- [ ] Pelo menos 1 Agent resource bound a um domain
- [ ] Todos os resources validam contra schemas (`ioa validate` passa)
- [ ] Cross-references resolvem (agents referenciando domains existentes)
- [ ] SecurityPolicy definida (pode ser default)
- [ ] Budget definido para pelo menos 1 domain
- [ ] Governance policy definida
- [ ] Pelo menos 1 Decision resource documentando escolha arquitetural
- [ ] Pelo menos 1 Telemetry event por domain
- [ ] Pelo menos 1 Workflow se houver interacao cross-domain

---

## Resumo Quantitativo

| Metrica | Atual | Alvo |
|---------|-------|------|
| Schemas JSON | 7 | 11 (+4) |
| Docs publicos | 0 | 20+ |
| Exemplos | 1 | 2 |
| Comandos CLI | 4 | 5 (+generate) |
| Templates scaffold | 1 (init) | 6 |
| Templates standalone | 0 | 5 |
| Resources no exemplo | 14 | 17+ |

---

*Gerado pelo BMAD/IOA Agent Team — Fase 4 (Blueprint)*
