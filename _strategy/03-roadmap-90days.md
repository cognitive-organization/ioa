# IOA 90-Day Roadmap

**Version:** 1.0
**Date:** 2026-02-25
**Author:** Strategic plan for Paulo Lima / Paribali
**Baseline:** v0.1.0 "Foundation" shipped, CI green, monorepo operational

---

## 1. Vision Statement

In 90 days, IOA should be the reference open standard that technical leaders reach for when they need to design, document, and govern AI-augmented organizations. Concretely: published on npm with stable schemas, a documentation site that converts curious visitors into implementors, at least 3 real-world case studies (including Paribali itself), a VS Code extension that makes authoring `.ioa` files frictionless, an MCP server that lets AI agents natively understand organizational architecture, and a small but engaged community of early contributors. The measure of success is not stars or downloads in isolation -- it is whether someone outside Paulo's network can go from `npx @ioa/cli init` to a validated organizational architecture in under 30 minutes, without asking for help.

---

## 2. Phase 1: Foundation (Days 1-30) -- ALREADY STARTED

### What is Done (v0.1.0)

| Component | Status | Notes |
|-----------|--------|-------|
| Monorepo structure (pnpm + Turborepo) | DONE | 4 packages, dependency chain working |
| 12 Doctrine Principles (v0.1) | DONE | Markdown files under `packages/doctrine/content/v0.1/` |
| 6 JSON Schemas | DONE | Domain, Agent, Decision, Telemetry, Governance, Config |
| TypeScript types matching all schemas | DONE | `packages/schemas/src/types/resources.ts` -- 30 interfaces |
| AJV validators with format support | DONE | `packages/schemas/src/validators/index.ts` |
| Cross-reference validation | DONE | Agents reference domains, telemetry references agents/domains |
| CLI: `ioa init` | DONE | Scaffold via Handlebars templates |
| CLI: `ioa validate` | DONE | Schema + cross-ref validation, colored output |
| CLI: `ioa status` | DONE | Dashboard with resource counts and names |
| 1 example project (ai-native-startup) | DONE | 3 domains, 4 agents, 2 decisions, 2 telemetry, 1 governance |
| CI pipeline (Node 20 + 22) | DONE | `.github/workflows/ci.yml` |
| CONTRIBUTING.md with doctrine amendment process | DONE | Structured process with 7-day discussion period |
| GitHub issue/PR templates | DONE | Doctrine amendment template, PR checklist |
| Changesets configured | DONE | `@changesets/cli` in devDeps |
| Git tag v0.1.0 | DONE | |

### What Still Needs to Happen in Phase 1

#### 2.1 npm Publish (Days 3-7)

**WHY:** Without npm packages, adoption is impossible. Right now users must clone the repo to use IOA. `npx @ioa/cli init` needs to actually work as advertised in the README.

**What to do:**
- Verify all 4 package.json files have correct `name`, `version`, `main`, `types`, `exports`, `bin` fields
- Set up npm org `@ioa` (or use `@ioa-dev` if `@ioa` is taken -- check immediately)
- Add `publishConfig.access: "public"` to each package.json
- Test the full publish flow locally with `pnpm publish --dry-run` in each package
- Create a GitHub Actions workflow `release.yml` that uses changesets to automate publish on merge to main
- First publish should be `0.1.0` for all packages, matching the git tag
- Verify that `npx @ioa/cli init --name test --org "Test Org"` works from a clean machine

**Effort:** M (2-3 days)
**Risk if skipped:** The README promises `npx @ioa/cli init`. If that does not work, credibility is zero on first contact.

#### 2.2 Documentation Site (Days 5-15)

**WHY:** The README is fine for a developer glancing at the repo. But IOA targets a broader audience: CTOs, engineering managers, org designers, AI consultants. They need a proper site with progressive disclosure -- overview first, deep dives later.

**Recommended stack:** Starlight (Astro-based).

**Why Starlight over Docusaurus:**
- Lighter, faster, ships less JS
- Built-in sidebar generation from filesystem
- First-class Astro component support (useful later for interactive schema explorer)
- Better suited for a standard/specification site (see: OpenAPI docs, Cloudflare docs)
- Deploys trivially to GitHub Pages or Vercel

**Why NOT Docusaurus:**
- Heavier React runtime
- Over-engineered for what is primarily a specification site
- Community perception: "yet another Docusaurus site"

**Site structure:**
```
docs/
  Getting Started
    Why IOA
    Quick Start (init -> validate -> status)
    Core Concepts (resource model, K8s analogy)
  Doctrine
    Preamble
    12 Principles (one page each, auto-generated from packages/doctrine)
  Resource Reference
    Domain / Agent / Decision / Telemetry / Governance / Config
    (schema docs auto-generated from JSON Schemas)
  Examples
    AI-Native Startup (the existing one, annotated)
  CLI Reference
    ioa init / ioa validate / ioa status
  Contributing
    Code contributions
    Doctrine amendments
    Schema changes
```

**Deploy:** GitHub Pages from `docs/` directory via GitHub Actions. Custom domain `docs.ioa.dev` (or `ioa.dev` root with `/docs` path).

**Effort:** L (5-7 days to build, ongoing to maintain)
**Risk if skipped:** Without a site, IOA looks like a hobby project. First-time visitors will bounce.

#### 2.3 More Examples (Days 10-25)

**WHY:** One example is not enough to demonstrate IOA's range. People need to see themselves in the examples. Each example also stress-tests the schemas and surfaces missing fields or overly rigid constraints.

**Priority examples to build:**

| Example | WHY | Effort |
|---------|-----|--------|
| `consulting-firm` | This IS Paribali. Dogfooding IOA for your own business. Shows IOA is not just for tech startups. Advisory agents, client governance, decision tracking for engagements. | S |
| `saas-platform` | The most common audience. Product, engineering, growth, support domains. Multiple agent types. Shows governance at scale. | M |
| `regulated-fintech` | Demonstrates governance-heavy scenarios. Compliance agents, audit trails, human override for financial decisions. Connects to Finanfix domain knowledge. | M |
| `solo-creator` | Minimal example. 1 domain, 2 agents, 1 decision. Shows IOA is not only for large orgs. Lowers the intimidation barrier. | S |

**Implementation notes:**
- Each example should have its own directory under `examples/`
- Each must pass `ioa validate` at 100%
- Each should have a `README.md` explaining the scenario and design choices
- Examples are the best documentation -- people copy-paste from examples, not from specs

**Effort:** M total (1-2 days per example)
**Risk if skipped:** A single startup example limits perceived applicability. People will assume IOA is only for AI startups.

#### 2.4 Schema Refinements (Days 15-30)

**WHY:** v0.1 schemas were designed in theory. Real-world usage will expose gaps. This is expected and healthy, but must be addressed before more people depend on the current shape.

**Known areas to investigate:**

| Area | Issue | Likely Fix |
|------|-------|------------|
| Agent `spec.model` field | No way to specify which LLM/model an agent uses | Add optional `spec.model` with `provider`, `name`, `version` |
| Agent `spec.tools` | No way to declare which tools/functions an agent can call | Add optional `spec.tools: string[]` |
| Domain `spec.team` | No way to declare the human team associated with a domain | Add optional `spec.team` with `members` and `roles` |
| Decision `spec.deadline` | No way to express time pressure on decisions | Add optional `spec.deadline: string` (ISO date) |
| Telemetry `spec.sla` | No way to express expected latency or freshness | Add optional `spec.sla` object |
| Config `integrations` | No way to declare external tool integrations (Slack, Jira, etc.) | Add optional `integrations` array |
| Cross-ref: Governance -> Domain | Governance references `spec.domain` but a single policy might span multiple domains | Allow `spec.domains: string[]` alongside `spec.domain` |

**Process:**
- Build the new examples FIRST. Let schema gaps emerge naturally.
- Open GitHub issues for each proposed schema change.
- Apply the doctrine amendment process (lighter version) for schema changes: issue -> 3-day comment period -> PR.
- Bump to v0.1.1 for non-breaking additions. Reserve v0.2 for breaking changes.

**Effort:** M (spread across the phase)
**Risk if skipped:** Early adopters hit limitations, fork the schemas, and fragmentation begins before there is even a community.

#### 2.5 Missing CLI Commands (Days 20-30)

**WHY:** The current CLI has 3 commands. That is enough for a demo but not for daily use. The next commands should address real workflow needs.

**Priority commands:**

| Command | Purpose | WHY | Effort |
|---------|---------|-----|--------|
| `ioa lint` | Style and best-practice checks beyond schema validity | `validate` checks structure. `lint` checks quality: "you have an agent with no constraints" or "domain has no KPIs." This is where IOA's opinions become actionable. | M |
| `ioa export --format json` | Export entire .ioa/ directory as a single JSON document | Enables programmatic consumption, CI pipelines, and integration with other tools. Foundation for API/MCP server. | S |
| `ioa diff` | Compare two .ioa/ directories or two git commits | Essential for understanding what changed in organizational architecture over time. Aligns with Principle 12 (Evolutionary Architecture). | M |
| `ioa add <kind>` | Interactive or template-based creation of a new resource | Lowers the barrier from "write YAML from scratch" to "answer a few questions." | S |

**What to NOT build yet:**
- `ioa deploy` -- deploy to what? There is no runtime. Do not create vaporware.
- `ioa visualize` -- tempting but premature. An ASCII graph of domains/agents is cute but not useful enough to justify the effort in Phase 1.
- `ioa migrate` -- no users to migrate yet.

**Effort:** M total (3-5 days for all four)
**Risk if skipped:** The CLI feels like a toy. Developers will not adopt a tool with only 3 commands.

---

## 3. Phase 2: Adoption (Days 31-60)

### 3.1 Developer Experience Improvements

**WHY:** The gap between "I found IOA" and "I am using IOA" must be as small as possible. Developer experience IS the product for an open standard.

| Initiative | Description | Effort |
|------------|-------------|--------|
| YAML language server integration | Provide JSON Schema associations so standard YAML editors get autocomplete for `.ioa` files | S |
| Error messages overhaul | Current validation errors are AJV-raw. Rewrite them as human-friendly messages with suggestions: "Agent 'foo' references domain 'bar' which does not exist. Available domains: product, growth, analytics." | M |
| `ioa doctor` command | Pre-flight check: is Node version OK, are dependencies installed, is .ioa/ well-formed? Like `flutter doctor` | S |
| Quickstart template selector | `ioa init --template startup` / `--template consulting` / `--template fintech` pulls from examples | S |

**Effort:** M total
**Risk if skipped:** People try IOA once, hit a confusing error, and never come back.

### 3.2 VS Code Extension

**WHY:** VS Code is where developers live. A purpose-built extension converts IOA from "a CLI I run sometimes" to "a visible part of my development environment."

**Scope (Phase 2 -- keep it tight):**
- YAML schema association: autocomplete, hover docs, inline validation for `.ioa/**/*.yaml` files
- Snippet library: quickly scaffold a new Domain, Agent, Decision, etc.
- Tree view: sidebar panel showing .ioa/ resources organized by kind
- Problem reporting: surface `ioa validate` errors as VS Code diagnostics

**What to NOT build yet:**
- Graphical editor for resources (Phase 3 maybe, or never)
- Live preview of organizational topology (premature)

**Technical approach:**
- Use VS Code's built-in YAML support + JSON Schema association
- Write a thin extension that registers schemas and adds snippets
- Publish to VS Code Marketplace as `ioa.ioa-vscode`

**Effort:** M (3-5 days for v1)
**Risk if skipped:** Manageable. The CLI is sufficient. But the extension is a strong adoption signal and differentiator.

### 3.3 MCP Server for IOA

**WHY:** This is the killer feature that separates IOA from every other organizational framework. An MCP server means AI agents (Claude, Cursor, Copilot, custom agents) can natively understand, query, and reason about organizational architecture. This turns IOA from "a config format" into "a live organizational brain."

**Scope:**
- `@ioa/mcp-server` package in the monorepo
- Tools exposed:
  - `ioa_list_resources` -- list all resources by kind
  - `ioa_get_resource` -- get a specific resource by kind + name
  - `ioa_validate` -- run validation and return results
  - `ioa_query` -- "which agents belong to the product domain?" / "what decisions are pending?"
  - `ioa_status` -- organizational compliance dashboard as structured data
- Resources exposed:
  - Each IOA resource as an MCP resource (agents, domains, decisions, etc.)
  - Doctrine principles as context resources

**WHY this matters strategically:**
- Paulo already uses BMAD MCP server for development methodology. IOA MCP server is the same pattern for organizational methodology.
- An AI coding agent that understands your organizational architecture can make better decisions: "This feature touches the analytics domain, which has a supervised agent. Should I alert the domain owner?"
- Creates a moat: once your AI tools understand your IOA config, switching away has a cost.
- Aligns with Principle 7 (Memory and Context): the MCP server IS the queryable organizational memory.

**Effort:** L (5-7 days)
**Risk if skipped:** IOA remains a static config format. The entire value proposition of "AI-native organizational architecture" rings hollow if AI cannot actually read the architecture.

### 3.4 Integration Patterns

**WHY:** IOA cannot live in isolation. Organizations already use tools. IOA needs to show how it connects, not replace.

**Priority integrations (documentation + examples, not code):**

| Integration | Pattern | Effort |
|-------------|---------|--------|
| Terraform / Pulumi analogy | Write a doc explaining IOA's declarative model in terms infra engineers understand. "Domains are like modules. Agents are like resources. Validate is like plan." | S |
| GitHub Actions | Example workflow: validate IOA config on PR, diff IOA changes in PR comments, block merge if validation fails. | S |
| Claude Code / BMAD | Show how an IOA-aware AI agent uses the MCP server to make context-aware development decisions. "Before implementing this feature, check which domain it belongs to and what governance applies." | M |
| Slack notifications | Example: governance alert channels mapped to Slack webhooks. When a human override is needed, Slack is notified. | S |

**What to NOT build:**
- Direct integrations with Jira, Linear, Notion. Too many, too fragmented. Provide export format and let people build connectors.
- A Terraform provider for IOA. Cute analogy, wrong execution. IOA is not infrastructure.

**Effort:** M total
**Risk if skipped:** IOA feels disconnected from the real world. Integrations are credibility markers.

### 3.5 First External Users / Case Studies (Days 35-55)

**WHY:** An open standard with zero users is a blog post, not a standard. The first 3-5 external implementations determine whether IOA has product-market fit or needs a pivot.

**Strategy:**
1. **Paribali itself** (Day 31-35): Create a `.ioa/` directory in Paribali's operational repo. Document the experience. This is case study #1 and it must be honest -- including the friction.
2. **Paulo's network** (Day 35-45): Identify 3-5 technical leaders in Paulo's professional network who run AI-augmented teams. Offer a 1-hour "IOA onboarding" session. The goal is not to sell -- it is to watch them try to use IOA and observe where they get stuck.
3. **Open call** (Day 45-55): Post on Twitter/X, LinkedIn, and relevant communities (AI Engineering, DevOps, Org Design). "We are looking for 5 organizations to pilot IOA. Free support, you get early influence on the standard." Target audience: CTOs of 10-100 person companies, AI consultants, engineering managers redesigning teams around AI.

**Case study format:**
- Organization profile (size, industry, AI maturity)
- Before: how they managed org-AI architecture
- Implementation: what they defined in IOA, what was hard
- After: what IOA revealed or improved
- Feedback: schema gaps, missing features, confusing concepts

**Effort:** L (ongoing, calendar-intensive)
**Risk if skipped:** Fatal. Without external validation, IOA is an intellectual exercise.

### 3.6 Content Strategy (Ongoing from Day 31)

**WHY:** An open standard grows through ideas, not marketing. Every piece of content should teach something about organizational intelligence, with IOA as the natural framework for applying the concept.

**Content calendar (2 pieces per week):**

| Week | Content | Channel |
|------|---------|---------|
| 5 | "Why your AI agents need an org chart" (problem framing) | Blog + Twitter thread |
| 5 | IOA launch announcement | LinkedIn + Twitter |
| 6 | "Kubernetes for organizations: the IOA resource model" (technical deep dive) | Blog + HN |
| 6 | Short demo video: init -> validate -> status (2 min) | Twitter + YouTube |
| 7 | "Decision records for AI: why your agents need ADRs" (Principle 3) | Blog |
| 7 | Case study #1: Paribali | Blog + LinkedIn |
| 8 | "The governance problem no one is solving" (Principle 5) | Blog + Twitter thread |
| 8 | "IOA MCP Server: teaching AI to understand your org" | Blog + Demo video |

**Tone:**
- Technically rigorous, not fluffy
- Problem-first, solution-second
- Show real YAML, real CLI output, real schema validations
- Never oversell. "IOA is v0.1. Here is what it can do today and what is coming."

**Effort:** M (ongoing time commitment, 4-6 hours per week)
**Risk if skipped:** IOA remains invisible. Open standards do not market themselves.

---

## 4. Phase 3: Community (Days 61-90)

### 4.1 Open Governance Model

**WHY:** An open standard controlled by one person is not a standard -- it is a product. As external contributors appear, governance must be explicit.

**Structure:**
- **Maintainer:** Paulo Lima (sole maintainer through Phase 3). Trying to create a committee with zero contributors is theater.
- **Decision process:** All doctrine changes go through the existing amendment process (GitHub Issues, 7-day discussion, maintainer decision). Schema changes follow a 3-day lightweight process.
- **RFC process:** For significant additions (new resource kinds, new principles, breaking changes), introduce a lightweight RFC template. RFCs are markdown files in `_rfcs/`. Anyone can submit. Discussion happens in PRs.
- **Versioning policy:** Formalize and publish. Patch = bug fixes + non-breaking schema additions. Minor = new resource kinds or principle revisions. Major = breaking schema changes (not expected before v1.0).
- **Code of Conduct:** Add one. Not because it is needed yet but because its absence signals immaturity.

**Effort:** S (documentation, not code)
**Risk if skipped:** Early contributors feel like they are working on "Paulo's project" instead of "our standard." Contributions dry up.

### 4.2 Contribution Guidelines Maturity

**WHY:** The current CONTRIBUTING.md is adequate for Phase 1. For a growing community, it needs expansion.

**Add:**
- "Good first issues" label strategy with at least 10 tagged issues
- Schema contribution guide (with example: "here is how we added the Telemetry kind")
- Example contribution guide ("how to add a new industry example")
- Doctrine discussion norms (how to propose amendments respectfully)
- Development environment setup for Windows, Mac, Linux
- Testing guide (how to run tests, what coverage is expected)

**Effort:** S
**Risk if skipped:** Low in isolation. But combined with no governance, the message is "contributions not actually welcome."

### 4.3 Plugin / Extension System

**WHY:** IOA cannot anticipate every use case. A plugin system lets the community extend IOA without forking it.

**Scope (Phase 3 -- design only, partial implementation):**

| Extension Point | Description | Priority |
|-----------------|-------------|----------|
| Custom resource kinds | Let organizations define their own resource types (e.g., `kind: Workflow`, `kind: Integration`) with custom schemas | HIGH |
| Custom validators | Plugins that add validation rules beyond schema checks (e.g., "every domain must have at least one agent") | HIGH |
| CLI plugins | `ioa plugin:add @ioa-community/terraform-export` adds new commands | MEDIUM |
| Output formatters | `ioa validate --format sarif` for CI integration | LOW |

**Technical approach:**
- Custom resource kinds: `config.json` gets an `extensions` field pointing to additional schema files
- Custom validators: `config.json` gets a `validators` field pointing to JS/TS modules that export validation functions
- CLI plugins: Use Commander's `.command()` to dynamically load subcommands from node_modules matching `@ioa-plugin-*` or `ioa-plugin-*`

**What to NOT build:**
- A plugin marketplace. Premature. npm IS the marketplace.
- A GUI plugin system. CLI-only is fine.

**Effort:** L (design + initial implementation)
**Risk if skipped:** Manageable in the short term. But without extensibility, IOA hits a ceiling where every new use case requires a core change.

### 4.4 Certification / Compliance Badge

**WHY:** A badge creates a feedback loop: organizations want to be "IOA-compliant," which drives adoption, which drives ecosystem growth.

**Honest assessment:** At Day 60-90, this is too early for a formal certification program. What IS appropriate:

- **`ioa validate` badge:** A GitHub badge that shows "IOA Validated" (green) or "IOA Invalid" (red). Generated by a GitHub Action. Similar to how projects show "build passing." This is achievable and valuable.
- **Self-certification:** "This organization's architecture is described using IOA v0.1." No third-party audit. Just a statement backed by a passing `ioa validate`.
- **Reserve formal certification for v1.0.** Certification requires a stable specification. v0.x is explicitly unstable.

**What to build:**
- GitHub Action: `cognitive-organization/ioa-validate-action` that runs `ioa validate` and sets a badge
- Badge SVG: dynamically generated "IOA Validated v0.1" shield
- Landing page section: "How to add the IOA Validated badge to your repo"

**Effort:** S (badge + action)
**Risk if skipped:** Low. But badges are disproportionately effective for open-source adoption.

### 4.5 Partnership Strategy

**WHY:** IOA needs to be adopted by organizations, not just individual developers. Partnerships accelerate this.

**Target partners (in order of priority):**

| Partner Type | Example | Value to IOA | Approach |
|--------------|---------|--------------|----------|
| AI consulting firms | Other firms like Paribali | They need a framework for client engagements. IOA gives them structure. | Direct outreach. "Use IOA with your clients. We will feature you as a partner." |
| AI agent platforms | CrewAI, AutoGen, LangGraph | Their users need organizational context for multi-agent systems. IOA provides it. | Open-source integration. Build an example showing IOA + their framework. |
| DevOps / Platform teams | Internal platform teams at mid-size companies | They already think in declarative configs. IOA is a natural extension. | Content marketing targeting this persona. Conference talks. |
| AI companies | Anthropic, OpenAI ecosystem | MCP server for Claude. Function calling schema for GPT. IOA becomes the organizational context layer. | MCP server (already planned). Marketplace listing. |

**What to NOT do:**
- Pay for partnerships. IOA has no budget and does not need one.
- Partner with "AI governance" SaaS companies. They will try to absorb IOA as a feature.
- Create an "IOA Alliance" or "IOA Foundation." Far too early. Let adoption prove the need first.

**Effort:** M (relationship-building, not code)
**Risk if skipped:** IOA grows linearly (Paulo's direct network) instead of exponentially (partners' networks).

---

## 5. Growth Flywheel

```
Phase 1: FOUNDATION
  npm publish + docs site + examples
       |
       v
  People can actually TRY IOA
       |
       v
Phase 2: ADOPTION
  DX improvements + MCP server + VS Code ext + content
       |
       v
  People WANT to use IOA (it is easy, it is powerful, AI understands it)
       |
       v
  First external implementations + case studies
       |
       v
  Content from real usage generates credibility
       |
       v
Phase 3: COMMUNITY
  Plugin system + governance + badges + partnerships
       |
       v
  People can EXTEND IOA without forking
       |
       v
  Partners bring IOA to their networks
       |
       v
  More users -> more feedback -> better standard -> more users
```

**The critical transition points:**

1. **Phase 1 -> 2:** npm publish is the gate. If packages are not on npm, Phase 2 cannot start. This is the single most important task in the first week.

2. **Phase 2 -> 3:** External users are the gate. If nobody outside Paulo's direct control is using IOA by Day 60, the community phase is premature. Pivot to more adoption work instead.

3. **The MCP server is the flywheel accelerator.** Every other organizational framework is a static document. IOA with an MCP server is a living system that AI agents consult in real time. This is the moat.

---

## 6. Key Metrics

### Phase 1 Metrics (Days 1-30)

| Metric | Target | Signal |
|--------|--------|--------|
| npm packages published | 4 packages, 0.1.0 | Can people install IOA? |
| Documentation site live | Yes, with all sections | Can people learn IOA? |
| Examples | 4+ (from current 1) | Can people see IOA applied? |
| CLI commands | 7 (from current 3) | Is the tool useful? |
| `npx @ioa/cli init` works end-to-end | Yes | Basic product viability |

### Phase 2 Metrics (Days 31-60)

| Metric | Target | Signal |
|--------|--------|--------|
| npm weekly downloads | 50+ | Are people trying IOA? |
| GitHub stars | 100+ | Is the concept resonating? |
| External implementations | 3-5 | Are people actually using IOA? |
| VS Code extension installs | 20+ | Is the DX compelling? |
| MCP server operational | Yes | Can AI agents read IOA configs? |
| Content published | 8+ pieces | Is the narrative building? |
| Blog/social impressions | 10,000+ | Is the message reaching people? |

### Phase 3 Metrics (Days 61-90)

| Metric | Target | Signal |
|--------|--------|--------|
| npm weekly downloads | 200+ | Sustained growth? |
| GitHub stars | 500+ | Community momentum? |
| External contributors | 5+ | Is this becoming a community project? |
| PRs from non-maintainers | 10+ | Active contribution? |
| Case studies published | 3+ | Proven real-world value? |
| Organizations with IOA badge | 5+ | Adoption signaling? |

### Product-Market Fit Signals

The following would signal genuine PMF (not vanity metrics):

1. **Organic mentions:** Someone you do not know tweets about IOA without being asked.
2. **Unsolicited PRs:** A stranger submits a meaningful PR (not just typo fixes).
3. **Schema extension requests:** Users ask for new resource kinds because they hit the limits of the current model.
4. **"How do I do X with IOA?"** questions on Stack Overflow, GitHub Discussions, or Discord.
5. **Integration requests:** "Can IOA work with [tool I use]?" -- this means they already decided to use IOA, they just need it to fit their stack.
6. **Repeat usage:** The same npm user installs updates across multiple weeks (not just a one-time try).

**What would signal the need to pivot:**
- Zero external implementations by Day 45
- Feedback consistently says "I do not understand what problem this solves"
- People try `ioa init` and never run `ioa validate` (setup friction kills them)
- Schema feedback says "this does not map to how we actually organize" (model mismatch)

---

## 7. Risks and Mitigations

### Risk 1: Solo Founder Bottleneck (Probability: HIGH)

**Description:** Paulo is building IOA, running Paribali, and maintaining Finanfix. IOA is a nights-and-weekends project. The roadmap assumes 15-20 hours per week on IOA, which may not be sustainable.

**Mitigation:**
- Prioritize ruthlessly. If something is not on this roadmap, it does not get done.
- Use AI agents aggressively for implementation. Claude Code for coding, AI for content drafts.
- The MCP server and CLI commands are the highest-leverage work because they multiply future productivity.
- If time is tight, cut examples (2 instead of 4) before cutting npm publish or docs site.
- Do NOT try to do consulting engagements using IOA in Phase 1. Dogfood internally only.

### Risk 2: "Standard Without Users" Trap (Probability: MEDIUM-HIGH)

**Description:** Building a standard in isolation leads to a spec that is intellectually elegant but practically useless. The 12 principles feel good on paper but do not map to how real organizations operate.

**Mitigation:**
- External users by Day 45 or pivot. This is a hard deadline, not aspirational.
- Every schema change must be motivated by real usage, not theoretical completeness.
- The consulting-firm example (Paribali dogfooding) is the first reality check.
- If the first 3 external users all struggle with the same thing, that thing is wrong in IOA, not in the users.

### Risk 3: Kubernetes Analogy Becomes a Liability (Probability: MEDIUM)

**Description:** The K8s-style resource model (apiVersion/kind/metadata/spec) is powerful but intimidating. Non-infrastructure engineers may see YAML declarations and think "this is not for me." The analogy helps technical people understand IOA quickly but may repel the organizational design audience.

**Mitigation:**
- Documentation must lead with problems and outcomes, not with YAML.
- The docs site homepage should NOT show YAML above the fold.
- Create a "IOA for non-engineers" guide that focuses on the principles and decisions, with the YAML as an implementation detail.
- Consider (Phase 3) a web-based visual editor that generates YAML under the hood.
- The CLI should be the primary interface, not hand-editing YAML.

### Risk 4: npm Namespace Conflict (Probability: MEDIUM)

**Description:** The `@ioa` npm scope may already be taken. If it is, the entire package naming scheme needs to change, affecting documentation, examples, and the README.

**Mitigation:**
- Check npm scope availability on Day 1. If `@ioa` is taken:
  - Try `@ioa-dev`, `@ioa-org`, or `@ioa-standard`
  - Alternatively, use unscoped packages: `ioa-cli`, `ioa-schemas`, `ioa-doctrine`, `ioa-templates`
  - Update all references before publishing. Do not publish under a temporary name.

### Risk 5: Premature Abstraction in Schemas (Probability: MEDIUM)

**Description:** The schemas try to cover too many use cases before any real usage validates the model. Fields get added speculatively, the model becomes bloated, and a breaking v0.2 becomes inevitable.

**Mitigation:**
- Every new field must have a concrete example that uses it. No speculative fields.
- Keep all new fields optional. Required fields in v0.1 are frozen.
- Use `additionalProperties: false` (already in place) to prevent schema drift.
- Document the "extension" pattern: use `metadata.annotations` for non-standard fields. This is how K8s handles it and it works.
- Plan for v0.2 as a "lessons learned" release at the end of 90 days, incorporating all feedback.

---

## 8. Why This Sequence

The phasing is not arbitrary. Each phase solves a specific existential question:

**Phase 1 answers: "Can this thing work?"**

v0.1.0 proved that the concept can be built. The rest of Phase 1 proves it can be used. npm publish makes IOA accessible. The docs site makes it understandable. More examples make it relatable. Schema refinements make it accurate. New CLI commands make it useful. If Phase 1 fails, IOA is an intellectual exercise. Kill it or pivot.

**Phase 2 answers: "Do people want this?"**

DX improvements reduce friction. The VS Code extension and MCP server make IOA part of the daily workflow instead of a one-time exercise. Content and outreach put IOA in front of the right people. External implementations are the only signal that matters. If Phase 2 fails, the concept is real but the execution is wrong. Pivot the approach, not the idea.

**Phase 3 answers: "Can this grow beyond one person?"**

Open governance, contribution maturity, and plugins answer whether IOA can become a community project. Partnerships and badges answer whether IOA can become an industry reference. If Phase 3 fails, IOA remains Paulo's framework used by Paulo's clients. That is not terrible -- it is just not an open standard.

**Why MCP server in Phase 2, not Phase 3:**

Most roadmaps would put an MCP server in the "advanced" phase. For IOA, it belongs in Phase 2 because:
1. IOA's entire premise is "AI-native" organizational architecture. If AI cannot read the architecture, the premise is empty.
2. Paulo already has MCP server experience (BMAD). The implementation cost is lower than for most projects.
3. The MCP server creates the strongest lock-in and differentiation. It turns IOA from "yet another YAML format" into "the organizational context layer for AI agents."
4. Every piece of content in Phase 2 becomes more compelling: "Your AI agent can query your organizational architecture in real time."

**Why NOT a web platform:**

There is no SaaS, no hosted dashboard, no cloud service on this roadmap. This is deliberate:
1. IOA is a standard, not a product. Standards win by being embedded everywhere, not by being a destination.
2. A web platform requires hosting, authentication, billing -- all distractions from the core mission.
3. The CLI + MCP server + VS Code extension cover the daily workflow without a browser.
4. If IOA succeeds as a standard, others will build web platforms on top of it. That is a feature, not a bug.

---

## Appendix: Week-by-Week Execution Summary

| Week | Key Deliverables | Milestone |
|------|-----------------|-----------|
| 1 | npm scope secured, publish pipeline working, first publish | Packages live on npm |
| 2 | Starlight docs site scaffolded, Getting Started + Doctrine sections | Docs site deployed |
| 3 | consulting-firm + solo-creator examples complete | 3 total examples |
| 4 | `ioa lint` + `ioa export` + `ioa add` shipped. Schema refinement issues filed. | CLI at 6 commands |
| 5 | VS Code extension v0.1 published. Error messages overhauled. | DX polished |
| 6 | MCP server `@ioa/mcp-server` operational with 5 tools | AI can read IOA |
| 7 | Launch content blitz: blog post, demo video, Twitter thread. Paribali case study. | Public awareness |
| 8 | 3-5 external users onboarded. Feedback collected. Schema v0.1.1 with fixes. | External validation |
| 9 | Plugin system designed, custom resource kinds working | Extensibility |
| 10 | Governance model published. Good first issues tagged. RFC template live. | Community infrastructure |
| 11 | GitHub Action for IOA badge. 2 more case studies published. | Social proof |
| 12 | v0.2 planning based on all feedback. Partnership outreach in progress. 90-day retrospective. | Phase 3 complete |

---

*This roadmap is a living document. It should be reviewed and updated at the end of each phase (Day 30, Day 60) based on actual progress and feedback. The sequence matters more than the specific dates.*
