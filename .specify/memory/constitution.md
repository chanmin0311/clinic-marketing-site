<!--
Sync Impact Report
- Version change: (none, template) → 1.0.0
- Rationale: Initial ratification of the project constitution. No prior version existed
  (the file previously held unfilled template placeholders only), so this is a MAJOR
  initial adoption per semantic versioning rules for governance documents.
- Modified principles: n/a (initial creation)
- Added sections:
  - Core Principles I–XII (Spec-Driven Development; TypeScript-First Development;
    Layered Architecture; Reusable, Composable Components; Accessibility;
    Responsive Design; Automated Testing; Security by Default; Performance Budgets;
    SEO Foundations; Maintainability & Simplicity; Minimal Dependencies)
  - AI-Assisted Development Rules (final decision authority, no silent architectural
    changes, traceability to specification)
  - Development Workflow & Quality Gates
  - Governance
- Removed sections: n/a (initial creation)
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ no changes required (already references
    "Constitution Check" generically; re-verify at next /speckit-plan run)
  - .specify/templates/spec-template.md — ✅ no changes required
  - .specify/templates/tasks-template.md — ✅ no changes required
  - .specify/templates/checklist-template.md — ✅ no changes required
- Follow-up TODOs:
  - TODO(PROJECT_NAME): inferred as "Visual Site" from the repository directory name
    (`visual-site`); confirm or replace with the actual client/product name.
-->

# Visual Site Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
No implementation work — no application code, configuration, or infrastructure change —
MAY begin until the governing requirement has been captured in a specification
(`spec.md`) that is sufficiently unambiguous to implement and test against. "Sufficiently
specified" means: user-facing behavior is described in testable terms, edge cases and
error states are enumerated or explicitly deferred, and open questions are resolved via
`/speckit-clarify` before planning starts. Every significant behavior shipped to
production MUST be traceable to a specific requirement, user story, or acceptance
criterion in an approved spec; code that cannot be traced to a spec is treated as scope
creep and MUST be justified or removed. Plans (`plan.md`) and tasks (`tasks.md`) are
derived from specs, never the reverse — implementation MUST NOT retroactively redefine
requirements without updating the spec first.
Rationale: On a freelance engagement, the spec is the contract between developer and
client/stakeholder. Building ahead of a clear spec produces rework billed to nobody and
erodes trust; traceability keeps every line of code defensible in a review or handoff.

### II. TypeScript-First Development
All application source code MUST be written in TypeScript with `strict` mode enabled.
Implicit `any`, unchecked type assertions (`as any`), and `// @ts-ignore` are forbidden
except with an inline comment justifying the specific compiler limitation being worked
around, reviewed case-by-case. Public function signatures, component props, and
API/data-layer boundaries MUST have explicit, exported types or interfaces. Plain
JavaScript is permitted only for third-party-mandated config files (e.g., certain
tooling configs) that do not support TypeScript.
Rationale: Type safety catches an entire class of defects before runtime and serves as
executable documentation for a codebase a client or another developer may inherit.

### III. Layered Architecture: Presentation, Domain, Infrastructure
Code MUST be organized into three clearly separated layers: **presentation** (UI
components, pages, view state — no business rules), **domain** (business logic, use
cases, validation rules, domain types — no framework or I/O dependencies), and
**infrastructure** (API clients, database access, third-party SDKs, filesystem, env
config). Dependencies flow inward: presentation depends on domain, domain depends on
nothing project-specific, infrastructure implements interfaces the domain defines. A
component MUST NOT reach directly into infrastructure (e.g., calling `fetch` or an SDK
inside a UI component); a domain module MUST NOT import a UI framework or a concrete
infrastructure client. Crossing a layer boundary without going through its defined
interface is treated as an architectural violation.
Rationale: This separation keeps business rules testable without a browser or network,
lets infrastructure (hosting, API providers) change without touching UI or domain code,
and makes the codebase legible to a new developer or a future maintainer.

### IV. Reusable, Composable Components
UI and logic components MUST be built with a single, well-defined responsibility and a
documented public interface (props, parameters, return types). Before adding a new
component, an existing one that already solves the problem MUST be reused or extended;
duplicated markup/logic beyond trivial size (roughly 2–3 lines) MUST be extracted into a
shared component, hook, or utility instead of copy-pasted. Components MUST NOT hard-code
content or styling that prevents reuse across the contexts the spec requires them for.
Rationale: A freelance codebase is handed off and extended long after the original
context is gone; reusable components reduce the surface area that has to be understood,
tested, and maintained.

### V. Accessibility (WCAG 2.1 AA)
All user-facing interfaces MUST meet WCAG 2.1 Level AA at minimum: semantic HTML
elements used for their intended purpose, full keyboard operability with visible focus
states, sufficient color contrast, ARIA attributes only where semantic HTML is
insufficient, and meaningful alternative text for non-decorative images. Interactive
components (menus, modals, forms, custom widgets) MUST be operable by keyboard and
screen reader. Automated accessibility checks (e.g., axe-based linting) MUST run in CI,
and violations MUST block merge unless explicitly waived with written rationale in the
PR.
Rationale: Accessibility is a baseline quality requirement, not an enhancement — it is
often a legal and contractual obligation for client-facing production sites, and
retrofitting it later is materially more expensive than building it in.

### VI. Responsive Design
Interfaces MUST be designed mobile-first and MUST render correctly across the
breakpoint set defined in the spec (at minimum: mobile, tablet, desktop). Layouts MUST
use fluid/relative units and flex/grid techniques rather than fixed pixel widths that
break at arbitrary viewport sizes. Every UI feature MUST be manually or automatically
verified at each defined breakpoint before it is considered done.
Rationale: Freelance client sites are viewed across an unpredictable device mix;
responsive behavior is a default expectation, not a stretch goal.

### VII. Automated Testing
Every domain-layer module MUST have unit tests covering its business rules and edge
cases. Infrastructure boundaries (API clients, data access) MUST have integration tests
verifying the contract they implement. Critical user-facing flows identified in the spec
MUST have end-to-end test coverage. Tests MUST be written or updated alongside the code
change that motivates them, not deferred to a later task. CI MUST run the full
automated test suite, and a failing suite MUST block merge — there is no "merge now, fix
tests later."
Rationale: Automated tests are the mechanism that lets a solo or small freelance team
ship changes confidently without manually re-verifying the whole application every time.

### VIII. Security by Default
All external input (form submissions, query params, API payloads, uploaded files) MUST
be validated and sanitized at the boundary where it enters the system. Output rendered
into HTML MUST be escaped by default; raw HTML injection MUST be justified and reviewed
case-by-case. Secrets (API keys, credentials, tokens) MUST NOT be committed to the
repository and MUST be loaded from environment configuration or a secrets manager.
Dependencies MUST be kept free of known critical/high vulnerabilities, verified by
automated dependency scanning. Authentication and authorization checks MUST be enforced
server-side, never trusted from client state alone. The OWASP Top 10 is the minimum
baseline threat model for any feature handling user data.
Rationale: A security incident on a client's production site is a business-ending event
for a freelance relationship; prevention is non-negotiable and cannot be deferred.

### IX. Performance Budgets
Pages MUST meet the Core Web Vitals thresholds ("Good" rating: LCP, INP, CLS) defined as
the project's performance budget in the spec, measured on representative
mobile/network conditions. Client-side JavaScript bundles MUST be code-split and
lazy-loaded where a route or component is not needed on initial render. Images and
media MUST be served in optimized, appropriately sized formats. Performance MUST be
checked before a feature is marked done, not only discovered via user complaints after
launch.
Rationale: Performance directly affects conversion, SEO ranking, and perceived quality
on client-facing sites — it is a measurable requirement, not a vague aspiration.

### X. SEO Foundations
Public-facing pages MUST use semantic HTML structure (correct heading hierarchy,
landmark elements), unique and descriptive `<title>` and meta description tags, and
valid structured data (schema.org) where the spec calls for rich results. Pages
intended for discovery MUST be server-rendered or statically generated so content is
present without requiring client-side JavaScript execution to be crawlable. A sitemap
and `robots.txt` MUST be maintained and kept accurate as routes change.
Rationale: For most freelance web work, organic discoverability is part of the client's
business value; SEO is a set of concrete, testable technical requirements, not an
afterthought bolted on post-launch.

### XI. Maintainability & Simplicity
Code MUST favor the simplest solution that satisfies the current spec (YAGNI); new
abstractions, patterns, or frameworks MUST be justified by an existing, current
requirement rather than anticipated future needs. Naming, formatting, and structural
conventions MUST be consistent within the codebase and enforced by automated linting/
formatting in CI. Non-obvious decisions (why an approach was chosen, what alternative
was rejected and why) MUST be recorded in the spec, plan, or a code comment at the
decision site — not left implicit.
Rationale: A freelance codebase is frequently handed to another developer or revisited
by its author months later with no live context; simplicity and recorded rationale are
what make it maintainable without the original author present.

### XII. Minimal Dependencies
A new third-party dependency MUST NOT be added unless it is justified by a genuine
requirement that the platform/standard library or an existing dependency cannot
reasonably satisfy. Each new dependency MUST be evaluated for maintenance health
(active upstream maintenance, license compatibility, bundle-size impact, security
track record) before it is added. Dependencies MUST be reviewed periodically and unused
or redundant ones removed.
Rationale: Every dependency is a liability the freelancer (and eventually the client) is
responsible for patching, upgrading, and securing indefinitely; minimizing the
dependency surface reduces long-term maintenance cost and attack surface.

## AI-Assisted Development Rules

- **Developer as Final Authority**: The human developer is the final decision-maker on
  all requirements, architecture, design, and implementation choices. AI agents
  (including this project's Spec Kit / Claude Code tooling) act in an assistive
  capacity; any AI-proposed decision is a recommendation until the developer approves
  it, whether explicitly or by proceeding with a merge/deploy.
- **No Silent Architectural Changes**: AI agents MUST NOT introduce or alter
  architectural decisions — layer boundaries, technology choices, data models, public
  interfaces, cross-cutting patterns — without surfacing the change explicitly to the
  developer for review before it lands. A change is "silent" if it is made without a
  clear, reviewable description of what changed and why; routine implementation details
  that follow an already-approved plan are not architectural changes under this rule.
- **Traceability to Specification**: Every significant behavior in the codebase MUST be
  traceable to a specific requirement, user story, or acceptance criterion recorded in
  a spec, plan, or task. Where an AI agent implements something not covered by an
  existing spec, the spec MUST be updated (or a clarification requested via
  `/speckit-clarify`) rather than leaving the behavior undocumented.

## Development Workflow & Quality Gates

- Feature work follows the Spec Kit sequence: `/speckit-constitution` (this document) →
  `/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` →
  `/speckit-implement`, with `/speckit-analyze` available to check cross-artifact
  consistency before implementation begins.
- A task is not "done" until: automated tests pass, linting/type-checking pass,
  accessibility checks pass, the change respects the layer boundaries in Principle III,
  and — for user-facing changes — responsive and performance checks have been
  performed against the spec's stated targets.
- Pull requests (or equivalent review checkpoints for a solo freelance workflow) MUST
  state which spec requirement(s) the change satisfies. Changes with no traceable
  requirement MUST be rejected or sent back to `/speckit-specify` first.
- CI MUST enforce, at minimum: type-checking, linting, automated test suite, and
  dependency vulnerability scanning. A red CI pipeline MUST block merge.

## Governance

This constitution supersedes all other informal practices for this project. Where a
conflict exists between this document and an ad hoc convention, this document governs.

**Amendment procedure**: Amendments are proposed via `/speckit-constitution` with the
specific change and rationale. The developer (final authority per the AI-Assisted
Development Rules above) MUST approve any amendment before it is adopted. Approved
amendments are written back to this file along with an updated Sync Impact Report.

**Versioning policy**: This constitution is versioned independently using semantic
versioning:
- **MAJOR** — backward-incompatible governance changes: removing or redefining a
  principle in a way that reverses its prior guarantee.
- **MINOR** — adding a new principle or section, or materially expanding an existing
  principle's guidance.
- **PATCH** — clarifications, wording fixes, and other non-semantic refinements.

**Compliance review**: Every `/speckit-plan` run MUST include a "Constitution Check"
confirming the plan does not violate any principle above; unresolved violations MUST be
justified in the plan's complexity-tracking section or the plan MUST be revised. Any
contributor (human or AI agent) that identifies a violation in existing code MUST raise
it rather than silently work around it.

**Version**: 1.0.0 | **Ratified**: 2026-09-10 | **Last Amended**: 2026-09-10
