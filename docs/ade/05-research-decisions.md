# Research, decisions and unresolved questions

> Scope update: we are retaining all existing Orca features and porting Orca to Tauri. [Orca foundation](07-orca-foundation.md) and [migration roadmap](08-migration-roadmap.md) supersede greenfield implementation assumptions and any apparent deferral of inherited features.

Research date: November 1, 2026. Sources describe current documentation, not a successful ADE integration. Provider behavior and terms must be rechecked before implementation/distribution.

## Primary sources

- [Orca](https://www.onorca.dev/): agent/workspace navigation and adjacent terminal/diff/browser surfaces are relevant inspiration. Its public page advertises multi-agent and bring-your-own-agent workflows. This does not establish what our prospective users most want or verify Orca's implementation.
- [Codex app-server](https://learn.chatgpt.com/docs/app-server): documented structured client integration, account and usage surfaces; prefer local stdio for evaluation. Its experimental raw remote transport should not become ADE's public endpoint. The page distinguishes local/open-source and commercial/hosted authentication routes; authentication eligibility is a launch dependency.
- [Claude Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview): sessions, permissions, hooks and subagents are available integration concepts. Its third-party login restriction means embedding the SDK with consumer subscription authentication cannot be assumed.
- [Claude Code programmatic CLI](https://code.claude.com/docs/en/headless): documents subprocess operation and structured output; test actual lifecycle and approvals rather than treating a one-shot prompt as full bidirectional integration.
- [Claude Code legal/compliance](https://code.claude.com/docs/en/legal-and-compliance): describes conditions for offering unmodified Claude Code and user-owned credentials. This differs in scope from the SDK overview's warning. Confirm the intended distribution/integration route; do not infer blanket permission or prohibition from only one page.
- [Claude Code status line](https://code.claude.com/docs/en/statusline): documents session/context/cost data and available rate-limit information. Field availability and adapter access require testing; do not scrape private account endpoints or overwrite an existing status-line command to collect data.
- [iroh](https://docs.rs/iroh/latest/iroh/): direct encrypted peer connections and relay fallback are documented transport capabilities. ADE still needs membership authorization, pairing, replay handling and operational relay decisions.
- [Tauri security](https://v2.tauri.app/security/): capabilities and IPC boundaries are part of the design, not substitutes for process/filesystem protection.
- [Tauri webview versions](https://v2.tauri.app/reference/webview-versions/): underlying webviews vary by platform, so preview and automation capabilities need a platform matrix.
- [Windows SetThreadExecutionState](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-setthreadexecutionstate): idle-sleep inhibition does not prevent deliberate sleep or necessarily lid-close sleep. macOS and Linux lid behavior remain to be checked against the chosen supported environments.

## Confirmed user decisions

| Decision | Status |
|---|---|
| Multiplayer is the defining priority | Confirmed |
| Tauri, lightweight, light/dark | Confirmed |
| Codex and Claude Code first | Confirmed |
| Agents normally run on each person's computer | User starting preference; execution sharing model explicitly open for brainstorming |
| No user-managed VPS/server setup; encrypted relay acceptable | Confirmed clarification |
| Heavy planning, simple demos, then build | Confirmed |
| Optional worktrees and all requested workspace affordances | Confirmed requirements; delivery priority is proposed |

## Proposed decisions and rationale

- **Distributed local execution, scoped machine access:** preserves device ownership while enabling collaboration; broad remote desktop access adds complexity without being necessary for the core shared-code workflow.
- **One coordinator and integration owner in alpha:** avoids split-brain; disconnected independent tasks can continue but new shared mutations wait.
- **Isolated task branches by default:** permits parallel implementation. Current-checkout mode is explicitly serialized.
- **Git contributions rather than continuous file mirroring:** avoids transferring dependency folders, secrets and conflicting mutable trees.
- **Provider-neutral task/message layer:** enables cross-provider delegation without pretending native subagent APIs are identical.
- **React/TypeScript UI and Rust service:** a practical Tauri starting point; final dependency decisions follow spikes.
- **Windows-first pilot:** matches available development environment; cross-platform portability remains an architectural requirement.
- **No mandatory ADE account for first pairing:** device verification and local room membership first. Invite discovery and off-device availability need explicit tradeoffs.

## Decisions still needed before product implementation

1. Initial supported OS/release targets. Proposal: Windows pilot, then macOS, then Linux after native tests.
2. Private/open-source tool versus commercial distribution. This changes supported authentication, packaging, signing and maintenance obligations. Do not assume a monetization model.
3. Relay operation: public provider versus ADE-operated relay; retention, availability, abuse control and bandwidth costs must be explicit. “No user setup” does not mean networking infrastructure has zero cost.
4. Strength of protected execution: support a restricted tool broker initially or fund cross-platform process sandboxing. Unrestricted shells cannot honestly carry an absolute file-safety promise.
5. Whether teammates need live desktop control in the first pilot or shared previews/agent tasks satisfy the initial need. Recommendation: defer general desktop control until core multiplayer works.

These are not reasons to stop planning or demos. They are gates before dependent production work. The demo assumes local per-person agents, scoped access and direct/relay connectivity, and labels all execution as simulated.

## User research plan

Interview three to five pairs who have recently worked with coding agents. Ask for their last actual handoff/conflict, observe current workarounds, and test a prototype task. Do not ask only whether they like a list of features.

Capture: tools used, project size, OS, agent/provider, frequency of conflicting edits, current plan/review practices, willingness to share a local preview versus desktop, connection constraints, and time to recover from agent mistakes. Have each pair rank three observed frustrations after the session. Prioritize based on repeated pain and successful task completion, not a vote for the largest feature list.

## Main risks

| Risk | Impact | Early mitigation |
|---|---|---|
| Provider auth or integration limitations | BYO flow cannot ship as imagined | Evaluate current supported routes before shell development |
| Shell can bypass file policy | Lost/unauthorized changes | Protected execution spike; honest compatibility mode |
| Split-brain coordination | Duplicate/conflicting work | Single coordinator, fencing, no automatic failover |
| Relay dependency hidden in “serverless” claim | Misleading promise and cost surprises | Direct-first/relay disclosure and supported network matrix |
| Agent message loops | Cost and loss of control | Bounded exchanges, budgets, provenance and human escalation |
| Excess scope | Polished wrapper without real teamwork | Two-machine vertical slice before broad UI polish |
| Tauri viewed as a universal browser engine | Broken preview/tool support across OSes | Native webview/browser bridge spike |
| Commit-everything leaks unrelated work | Secrets or accidental attribution | Explicit staging, exclusions, baseline preservation |
