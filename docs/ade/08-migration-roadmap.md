# Orca-to-Tauri migration and extension roadmap

This replaces the greenfield build sequence in the original roadmap. Product behavior and multiplayer invariants from the earlier specifications remain targets; existing Orca implementations are reused before new implementations are considered. Full upstream feature parity is a release requirement.

## A — Pin and inventory the foundation

Keep a clean source baseline at commit `32a6c4206eb7c31e846c2d32285e5125e6fc2bc2`, retain MIT notices, and create a dedicated development branch. Use upstream pnpm and lockfile. Record the public source and any third-party/native license requirements. Audit scripts before dependency installation or execution.

Expand documentation/API registers with runtime method inventory, settings, native features, mobile/cloud protocols and source-only integrations. Record unsupported features already present upstream separately from new port regressions. Review repository instructions and canonical style guide.

Exit: an explicit capability register and baseline test plan. No claim that 58 documentation pages represent the complete behavior surface.

## B — Establish reproducible upstream baselines

Build renderer/web and Node runtime using upstream commands; run typechecks and focused provider/terminal/Git checks. Run the original Electron app only for background baseline comparisons, following its launch policy. Measure native/renderer/runtime boundaries and collect representative fixture screenshots without taking desktop focus.

Exit: recorded baseline results, existing failures and declared environment versions. Reuse actual working contracts rather than inferring functionality from file names.

## C — Prove the Tauri integration seam

Build a throwaway Tauri host for the unchanged renderer and bundled Node runtime. Add a typed platform adapter rather than broad replacements of `window.api`. Begin with runtime lifecycle, project catalog, terminal output, structured chat and safe file reads. Discover unsupported web-bridge APIs explicitly; no fake-success fallbacks.

Ensure a fresh app launch automatically finds/starts the packaged runtime, authenticates its local channel and restores state without a manual development server. Native windows, dialogs, menus, filesystem pickers, clipboard, drag/drop, notifications, deep links, updater and credential storage need explicit platform handling.

Exit: a real Tauri window using real Orca code and a local runtime for a narrow internal slice. This is an integration proof, not full product completion.

## D — Prove native/browser architecture, then complete parity

Close every API parity gap, including PTY/native modules, multiwindow behavior, browser profiles/design mode, computer automation, OS permissions, updater/signing, shell and remote execution. Preserve remote-server and mobile companion flows; service infrastructure and distribution identities must be ours or explicitly available for use.

Browser spike must choose an engine/embedding/automation approach that preserves existing behavior across supported systems without a hidden Electron runtime. Test browser process crashes, profiles, screenshots, downloads, navigation, annotations, keyboard input and agent control. A basic URL webview is insufficient evidence of browser parity.

Early exit into E: representative high-risk browser, terminal and native tests establish the architecture. Do not wait for every integration to be ported before proving multiplayer. Remaining parity work continues as a separate migration track; final exit requires all baseline capabilities to have owners and passing Tauri evidence or explicitly blocking gaps. Source-only features remain in scope.

## E — Add our multiplayer collaboration model alongside remaining D work

Audit existing pairing/device/remote-runtime code against the desired two-person, two-computer workflow. Extend it for human/team identity, task ownership, local per-person agents, agent-to-agent messages, revisioned shared plans, integration authority and scoped machine access. Reuse its transport and security primitives where they fit; replace only a demonstrated mismatch.

Test direct and encrypted-relay paths. Persist shared decisions/outbox state and reconcile disconnects without automatically replaying unknown commands. Maintain a single explicit coordinator/integration authority until failover has a tested protocol.

Exit: two people on separate computers use Codex and Claude, exchange an agent question, preserve dirty local files, survive a forced disconnect and integrate one feature with evidence. Existing upstream solo/remote/mobile workflows still work.

## F — Strengthen planning and repository protection

Extend preflight, checkpoints, Git and trust policies rather than creating parallel subsystems. Bind writes to approved plan content, baseline and task owner. Preserve folder/worktree modes; serialize writes when isolation is off. Add fail-closed checkpoint behavior, stale-base checks and controlled integration only where upstream lacks them.

Exit: our failure/recovery matrix passes in dirty test repositories and no unrelated files enter scoped commits. Cross-person agent messages cannot elevate tools, billing or plan approval rights.

## G — Full-parity pilot and performance

Run the complete parity register and relevant upstream suites across the declared OS/runtime matrix, including remote/mobile modes. Add lintapple with canonical upstream tokens and check affected rendered states, both themes and narrow/desktop layouts. Measure whole-process memory, startup, idle behavior and active browser/agent workloads.

Preserve features while reducing overhead through runtime/process design. Provide signed installers, compatible migration/export paths, rollback/recovery procedures and our own update/service configuration. Do not reuse upstream production credentials or signing assets.

Exit: no silently dropped baseline capabilities, tested new multiplayer workflows, explicit supported platform matrix and factual performance results.

## Development order versus final scope

Prove Tauri's renderer/runtime and browser boundaries early because these can change the migration architecture. Build the two-person collaboration slice early as well, once those contracts work. Internal milestone sequencing does not demote inherited Orca features to optional future work. The release includes the full baseline plus our verified additions.

## First concrete implementation plan after design review

1. Finish source checkout and verify a clean baseline; preserve upstream history and add the working branch.
2. Run and record the web/runtime baseline checks with the existing package manager.
3. Generate a per-method platform capability inventory and locate all Electron-dependent boundaries.
4. Write a bounded Tauri spike plan with exact entry points, lifecycle/security contract and acceptance checks.
5. Build that spike against existing Orca code; retain a comparison baseline for every changed boundary.
6. Decide browser/native adapters from measured results, then execute the parity migration and team extensions.
