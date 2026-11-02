# Product specification

> Scope update: we are retaining all existing Orca features and porting Orca to Tauri. [Orca foundation](07-orca-foundation.md) and [migration roadmap](08-migration-roadmap.md) supersede greenfield implementation assumptions and any apparent deferral of inherited features.

## Product promise

A lightweight desktop workspace where people bring their own Codex and Claude Code agents, plan together, divide work, inspect changes, and integrate results without losing track of who changed what.

Multiplayer is the foundation. The first meaningful demonstration must show two people, on two computers, using different providers on one project and exchanging work safely. A polished solo chat wrapper does not meet the brief.

## Confirmed constraints

- Tauri desktop application; lightweight operation; dark and light themes.
- Multiple people, each normally running agents on their own computer.
- No rented VPS, manual server installation, or mandatory cloud development environment. Optional encrypted connection relays are acceptable.
- Codex and Claude Code are first-class providers. Existing installations and user-owned authentication should be reused where supported.
- Optional worktrees, multiple agents and subagents, cross-agent and cross-person messages.
- Plan before implementation; understand the repository and intended product; establish a strong baseline.
- Recoverable changes, attributable commits, clean reviews, and respect for existing files.
- Multiple projects with project folders and chats; tabs, splits, movable/collapsible sidebar, global floating search.
- Readable Markdown, plans, tasks, diffs, integrated browser annotations, usage tracking, browser and computer tools.
- A keep-awake option, including guidance for lid-closed operation where the operating system allows it.

## Initial audience and hypotheses

Proposed initial audience: pairs and small software teams of 2–5 people who already use a coding agent. Support any repository rather than specializing in one project category. Solo work is fully supported and is a useful onboarding path.

Hypotheses to validate, not established market demand:

1. The biggest multiplayer frustration is conflicting changes and missing context, rather than insufficient agent parallelism.
2. People will accept explicit ownership and integration steps if these make parallel work dependable.
3. Existing subscriptions and local tooling matter more than a large model marketplace.
4. A shared plan and a clear next-action view reduce coordination work.
5. Teammates want scoped access to another person's environment; unrestricted desktop access should be optional and exceptional.

## Primary end-to-end journey

Harsh opens an existing app repository. ADE detects installed agents, Git state, project instructions, package manager, test commands, and existing modifications. It presents a baseline report without installing or changing anything automatically.

Harsh invites Maya using an expiring connection ticket. Maya verifies the room and chooses a local clone. Both see the product brief and plan. Harsh owns the API task using Codex; Maya owns the UI task using Claude Code. Each task has an execution machine, branch, owner, acceptance criteria, and allowed paths. A dependency contract describes the API before either side implements it.

They approve plan revision 3. Agents run in isolated branches/worktrees by default; the interface offers a serialized current-checkout alternative. Maya's agent asks Harsh's agent a question with a reference to the API contract. Both humans can inspect the exchange. Harsh's agent answers with a proposed schema update, which becomes a reviewed plan change rather than silently rewriting the agreement.

Maya annotates the local preview. Her annotation creates a linked task with route, viewport, screenshot, and text. Completed work includes a diff, checks, limitations, and a commit. A designated integrator checks both contributions together against the current integration head and creates the integration commit. Nobody's unrelated local edits are included.

If a machine disconnects, peers see stale/offline status. An already-authorized isolated local task can finish locally, but messages wait for delivery and shared integration pauses. Reconnection resumes from acknowledged events without automatically replaying writes or provider requests; unknown outcomes require reconciliation.

## Priority definitions

P0: required for a trustworthy multiplayer alpha. P1: required for the broader v1 experience. P2: expansion after evidence from real teams. P0 work can be delivered in internal slices; not every slice is an external launch.

| Capability | Priority | Expected behavior |
|---|---|---|
| Two-computer room and device pairing | P0 | Verified invite, presence, owner permissions, reconnect, revocation |
| Codex + Claude Code | P0 | Detect, connect, stream, interrupt, resume, approve, report unsupported features |
| Per-person agent execution | P0 | Credentials stay on the executing person's device; remote jobs require its owner's grant |
| Shared brief, plans, decisions | P0 | Versioned plan, approval tied to revision, task dependencies and acceptance |
| Repository baseline | P0 | Instructions, dirty files, build/test baseline, missing setup, known existing failures |
| Change protection and integration | P0 | Isolated default, serialized alternative, checkpoints, stale-base checks, scoped commits |
| Cross-person agent messaging | P0 | Addressed, durable, attributable messages with acknowledgement and bounded loops |
| Task ownership and human takeover | P0 | One accountable owner; queued, planning, ready, running, blocked, review, done states |
| Subagents | P0 | Visible parent-child tasks, cancellation, budgets, bounded depth, same protection rules |
| Workspace navigation | P0 | Project folders, chats, workspaces, tabs, one split, collapsed sidebar, session restore |
| Global search | P0 | Cmd/Ctrl+K across projects, workspaces, worktrees, files, folders, chats, plans, tasks |
| Markdown, plan, task and diff readers | P0 | Sanitized rendering, linked sections, provenance, clear state and review actions |
| Usage visibility | P0 | Provider-reported usage/limits when available, timestamps, unknown states, local totals |
| First-run experience | P0 | Open repo → detect providers → baseline → create/join room, without manual server setup |
| Theme and accessibility | P0 | System/light/dark, keyboard navigation, focus, readable contrast |
| Preview + annotations | P1 | Local browser surface, contextual annotation → task, branch/commit association |
| Agent browser tools | P1 | Supported automation bridge, scoped profiles, evidence, owner-granted access |
| Agent desktop tools | P1 | Per-device integration, explicit visible control, stop button, single controller |
| Flexible panel layout | P1 | Left/right sidebar, resizable splits, multiple tabs, saved layouts |
| Rich usage dashboard | P1 | Per task/person/provider/model totals, rate limits, budgets, estimates labeled |
| Remote preview/terminal sharing | P1 | Explicit port/process grants, restricted exposure, visible session ownership |
| Keep awake | P1 | Session-scoped idle-sleep inhibition and truthful platform-specific lid guidance |
| Shared host execution mode | P2 | Optional designated team machine; never credential copying |
| More agent providers | P2 | Adapter-based expansion and a clearly limited terminal compatibility mode |
| Live collaborative source editor | P2 | Only if users need it; separate from initial patch/commit collaboration |
| Mobile companion, marketplace, automation schedules | P2 | Deferred to protect multiplayer and repository reliability |

## Core product rules

### Plans before building

Every implementation task references an approved plan revision and a repository baseline. A quick fix may use a short plan, but still names scope and verification. Read-only exploration and prototypes are labeled separately. Material scope changes invalidate the affected approval. The product may offer a user-controlled standing policy for small tasks, but alpha uses explicit approval.

Plans include goal, non-goals, known constraints, approach, affected areas, dependency contracts, acceptance criteria, checks, rollback, and open questions. Agent summaries cite repository facts and distinguish assumptions. Missing context becomes a visible question rather than a fabricated decision.

### Never lose work

This is an engineering objective, not an absolute guarantee. ADE must prevent the classes of collisions it controls, preserve originals, and prove recovery in tests. A worktree is isolation from other checkouts, not a security sandbox. External editors, shell commands, symlinks, credentials, and OS permissions require additional handling.

### Commit the work

Completed ADE-managed task changes and shared plan revisions receive attributable commits. Crash-recovery checkpoints may include incomplete work in a separate recovery journal or checkpoint ref. Ignore rules and secret exclusions still apply. Never run indiscriminate `git add .` over someone's dirty checkout. Commit, merge, push, and deploy are distinct actions with separate configured permissions. Nothing is automatically pushed or deployed merely because it was committed.

## Secondary journeys and hard cases

- Solo user: same planning and recovery model without a room or network requirement.
- Existing dirty repository: preserve baseline; show pre-existing files; refuse unsafe overlapping edits; offer isolated checkout rather than automatic stash/reset.
- No Git repository: explain protection limits and offer explicit Git initialization; allow read-only exploration first.
- No provider installed: explain what is missing and offer the provider's supported install/sign-in route; never collect copied credentials.
- Agent quota reached: persist state, show reported reset if available, allow deliberate provider switch with a concise handoff; no automatic account rotation.
- Agent ownership transfer: new owner explicitly accepts; previous execution is stopped/reconciled before a replacement writer begins.
- User changes files mid-run: watcher marks possible overlap; diff/base hash check decides whether to pause, rebase, or request review.
- Concurrent schema/lockfile edits: coordinate through an owned dependency task and serialized integration.
- Disconnect or lid sleep: show last acknowledged state; do not infer that a remote task is dead or completed.

## Success criteria proposed for validation

The first pilot succeeds if two users on different providers can complete one shared feature, survive a forced disconnect, inspect all relevant decisions and messages, and integrate with no lost local edits. Measure first shared-task setup time, failed joins by network type, stale/conflicting updates blocked, recovery time, repeated approval friction, and tasks completed with verified acceptance.

Initial target: median first shared task under five minutes for users with installed agents and a runnable repo. This is a target to test, not a present capability or research finding. Do not optimize task counts or agent counts at the expense of successful integrated work.
