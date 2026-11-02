# Build roadmap and release gates

> Scope update: we are retaining all existing Orca features and porting Orca to Tauri. [Orca foundation](07-orca-foundation.md) and [migration roadmap](08-migration-roadmap.md) supersede greenfield implementation assumptions and any apparent deferral of inherited features.

This is a milestone plan, not a fixed delivery estimate. Detailed file-level implementation plans follow approval of the product design and findings from the feasibility spikes. Build in a new product repository or an explicitly chosen existing repository; do not scaffold into unrelated projects.

## Milestone 0 — Validate the product and hard constraints

Deliver the specification, interaction demo, decision log, and a small set of user interviews. Test the core scenario with at least three pairs already using agents. Observe them finding shared work, understanding execution location, approving a plan, handling a conflict and reviewing an agent handoff. Record disagreement rather than treating this feature list as evidence of demand.

Exit: initial operating system, provider authentication route, collaboration default and protection boundary are recorded; the main workflow makes sense to target users. Proposed first OS is Windows because it is the current environment, with portable boundaries and macOS/Linux support added after native validation. This is a recommendation, not a settled user decision.

## Milestone 1 — Feasibility spikes before shell polish

Build throwaway, clearly labeled spikes in isolated test repositories:

| Spike | Evidence required | Failure fallback |
|---|---|---|
| Codex adapter | Start/resume/interrupt; stream tools and approvals; report usage; compatible auth | Adjust supported version range or terminal-only mode with disclosed limitations |
| Claude adapter | Same lifecycle, permission boundary, supported auth, native child visibility | Separate original CLI mode and API-backed rich mode; no unsupported auth promise |
| Two-device connectivity | Pair/revoke, LAN, two NATs, relay fallback, sleep/reconnect | Refine transport; retain honest supported network matrix |
| Protection boundary | Malicious/out-of-scope path, shell escape, stale writer, external edits, checkpoint restore | Restrict tool set or use stronger process sandbox; no false “safe mode” |
| Git exchange/integration | Minimal object exchange, dirty repo preservation, atomic target validation | Require full compatible clone; narrow unsupported Git features |
| Native preview | Isolated unprivileged webview; annotation capture; automation feasibility | External supported browser bridge |

Exit: repeatable scripts and recorded outcomes, not screenshots alone. Test with two real computers; a one-machine simulation cannot validate multiplayer.

## Milestone 2 — Durable local core

Implement local process supervisor, SQLite journal/outbox, migrations, adapter contract, device identity, project detection, canonical path policy, checkpoint storage and Git operation service. Cover corrupt/interrupted writes, disk-full and child-process cleanup. Keep secrets in OS storage; logs are redacted with explicit retention.

Acceptance: approved task runs in an isolated fixture, streams events, is interrupted safely, resumes without duplicate side effects, and commits only intended changes. Restarting ADE reconstructs task state. Current-checkout mode enforces one broker-owned writer and preserves pre-existing changes.

## Milestone 3 — Real multiplayer vertical slice

Implement room coordinator, expiring verified invites, membership, roles, shared task/plan state, addressed agent messages, object transfer, reconnect cursor, integration owner and queue. Build only the minimum UI needed to operate this slice.

Acceptance: two people, two computers, Codex and Claude Code, one shared baseline. Approve a shared plan; delegate separate work; exchange a question; commit both contributions; integrate and check them. Disconnect one peer mid-run, restart one app, replay duplicate events, revoke a grant, and confirm no duplicate command, permission escalation or lost original edit. Relay use is visible. Coordinator loss pauses new shared authority.

This is the first product-defining gate. Do not postpone multiplayer to the end of UI development.

## Milestone 4 — Workspace experience

Implement project folders/chats, workspaces, tabs, a split view, sidebar collapse/movement, command search, formatted Markdown, task board, plan approvals, diff/checkpoint review, usage indicators, both themes and keyboard support. Empty/error/loading/disconnected states are designed alongside the happy path.

Acceptance: session layout survives restart; search covers every requested object type; approvals bind the exact plan revision; unsupported telemetry is explicit. Run lintapple with the intended token policy on every affected rendered view and meaningful interaction state at phone and desktop sizes, plus keyboard and native-webview checks.

## Milestone 5 — Orchestration and controlled tools

Add visible task trees, provider-native child reporting where supported, ADE-managed cross-provider child sessions, bounded agent conversations, budgets, cancellation propagation and human handoff. Add preview annotations, browser tools, selected-port sharing, and device-owned tool grants. Add desktop observation/control only after a separate native permission and interruption test suite.

Acceptance: an agent cannot expand its own permissions through a child; cancelling a parent stops or explicitly detaches children; cross-person messages cannot approve a plan. Annotation-created tasks retain evidence and branch association. Remote browser or desktop grants expire, revoke and stop input reliably.

## Milestone 6 — Pilot hardening and distribution

Measure shell and process-tree performance; implement lazy indexing, transcript virtualization and inactive-preview suspension as required by measurements. Add signed installers/updates, recovery export, database migration rollback strategy, support diagnostics, retention controls, keep-awake lifecycle and OS-specific documentation. Test update interruption and schema compatibility between peers.

Acceptance: declared supported OS/version matrix, tested provider binary range, native permission matrix and known limitations. Run pilot teams through actual multi-day work. Publish only claims supported by recorded evidence.

## Verification matrix

| Area | Minimum cases before release |
|---|---|
| Network | LAN, home NAT, restrictive network with relay, packet interruption, coordinator offline, sleep/wake, revoked peer reconnect |
| Commands | Duplicate delivery, crash after dispatch/before receipt, unknown completion, cancellation race, stale permission response |
| Git | Dirty index/worktree, untracked overlap, rename/delete/binary, case/line endings, branch moved, merge conflict, stale lock, disk-full |
| Files | Traversal, symlink/junction escape, external edit mid-run, ignored secret, oversized file, failed checkpoint, restore over newer edits |
| Agents | Missing binary, incompatible version, auth missing, quota reached, malformed event, child failure, lost stream, unsupported usage |
| Sharing | Expired/replayed invite, mistaken device, revoked grant, read-only peer write attempt, private chat not shared |
| UI | Empty/busy/error/offline, dialogs, Cmd/Ctrl+K, focus restore, long names/docs, narrow/wide, both themes |
| Desktop/browser | Locked machine, user input conflict, missing OS permission, expired grant, stop, stale preview, untrusted page |
| Recovery | App kill, OS restart, database migration failure, corrupted record, room replay, incomplete transfer |

## Working practices for implementation

Every milestone starts with a short approved plan and bounded acceptance checks. Read current project instructions and Git state before changes. Commit coherent completed work and documentation; preserve unrelated modifications. Use isolated tasks when agents work in parallel. Record test commands, fixture versions and machine/network conditions. A failed check remains visible; do not weaken UI policy or claim simulated integrations are live.

## Initial backlog

1. Decide initial OS and authentication/product distribution assumptions.
2. Run provider lifecycle/auth spikes and document the supported capability matrix.
3. Run two-machine direct/relay transport and reconnect spike.
4. Prove protection and Git integration in disposable dirty repositories.
5. Write the milestone-2 file-level implementation plan from spike results.
6. Implement the local core, then the real multiplayer slice.
7. Build the workspace UI on those working contracts.
8. Add orchestration, preview tools and native desktop capabilities incrementally.
