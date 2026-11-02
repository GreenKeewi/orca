# Approved execution scope — November 1, 2026

The user explicitly clarified the approach and requested cloud execution:

1. Start from the actual stablyai/orca GitHub fork and use Orca's real application code.
2. Keep Orca's existing design, components, layouts, tokens, typography and behavior as the baseline.
3. Audit our requested features against Orca first. Add or extend only what is missing or insufficient.
4. Preserve all existing Orca features during this stage. The user will choose features to remove later; do not remove, hide or simplify them preemptively.
5. Tauri remains the target desktop shell. Preserve reusable renderer/runtime code and migrate native/Electron boundaries with parity evidence.
6. Run the implementation as a Codex Cloud task. This instruction approves beginning implementation under this approach, not merely producing another concept site.

The standalone website/demo created earlier is an exploratory artifact. It is not the product foundation, not a substitute for Orca's renderer, and not an instruction to redesign Orca.

## Requested additions to audit and implement

- Reliable multiplayer for multiple people, each bringing their own agents and local computer. No user-managed VPS/server setup; optional encrypted relay is accepted.
- Cross-person agent and subagent communication, work coordination, visible ownership and bounded delegation. Codex and Claude Code are initial priorities, while retaining upstream's other providers.
- Shared understanding of the product being built; strong repository preflight/baseline; versioned plans before managed implementation; acceptance checks and visible todos.
- Protect existing files and dirty changes; checkpoint and commit intended work; optional worktrees with safe serialized current-checkout behavior; controlled integration.
- Reuse and extend existing computer/browser tools, annotations, project folders/chats, tabs/splits, formatted Markdown/plan readers, movable/collapsible sidebar, themes and floating global search.
- Preserve and improve available usage tracking for Codex and Claude Code. Unknown telemetry stays unknown.
- Audit existing keep-awake/lid handling before adding anything; report OS-specific limitations truthfully.

Detailed architectural proposals and recovery invariants are in 01-product.md, 02-architecture.md, 07-orca-foundation.md and 08-migration-roadmap.md. If an earlier document suggests a greenfield app, smaller feature set or a new visual system, this document takes precedence.

## Execution expectations

Inspect repository instructions and current Git state, establish a reproducible baseline, write a bounded implementation plan, then execute it. Keep the existing pnpm lockfile and test/check infrastructure. Commit coherent work. Do not push to stablyai/orca, publish releases, deploy or remove features without an explicit request.

Make a real first implementation slice using Orca's code: prove the renderer/runtime/Tauri seam and extend a demonstrated missing collaboration capability. Keep uncompleted parity work visible. A mock UI, a wrapper around the previous demo, source-file discovery or a successful narrow build is not evidence of full feature parity.

Follow docs/STYLEGUIDE.md and assets/main.css for UI. Add lintapple alongside existing checks when changing rendered UI, using upstream tokens. Linux cloud validation does not prove Windows/macOS native behavior, two-person live networking, provider authentication or hardware-dependent computer-use behavior; state actual coverage.
