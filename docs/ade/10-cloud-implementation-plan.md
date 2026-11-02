# Cloud implementation slice

Base: `6d6bf40e82623236cc09cb9606db8f2da8e09201`, descendant of upstream `32a6c4206eb7c31e846c2d32285e5125e6fc2bc2`.
Clean clone; only GreenKeewi/orca is a remote. Existing providers, renderer, profiles, mobile and remote code remain in scope and intact.

## Findings and bounded changes

1. `src/packages/process-host/package.json`: the baseline web/runtime commands fail because the tsx CLI opens an unnecessary Unix IPC listener denied by this executor. Use the same tsx loader through Node's `--import` entry, preserving the compiler and build implementation.
2. `native/ade-desktop/`: Tauri 2 host, separate application identity/profile, local asset origin only. Launch the verified packaged Node/orcad distribution on an ephemeral loopback port. Authenticate bootstrap with a per-launch nonce and child PID; never attach to an ambient Orca. Refuse absent/mismatched resources. Supervise lifetime through an owned stdin pipe; no port killing or credential imports. Preserve daemon/session recovery.
3. `config/scripts/stage-ade-desktop.mjs`: stage existing web output and orcad resources, hash all runtime resources into a build-embedded manifest. Keep pnpm lockfile; add Tauri tooling and lintapple. No installer publication.
4. `src/main/orcad/{orcad-command-arguments,orcad-start-contract,orcad-entry}.ts`, `src/main/server/serve-readiness.ts`: opt-in owned desktop stdio lifecycle and nonce-bearing readiness. Existing CLI/server behavior remains the default.
5. `src/renderer/src/web/{main,tauri-bootstrap}.tsx/ts`: use the existing App and web bridge after native bootstrap. Preserve browser pairing behavior. No new design or replacement renderer. Explicit native capability gaps remain in the register; web fallbacks are not parity evidence.
6. `src/main/runtime/rpc/methods/orchestration/federation/federation-relay.ts` and focused tests: upstream already has federation, authenticated devices, per-host dispatches, durable mail and depth limits. Missing reliability boundary: incoming multi-message control batches can partially commit before a later item fails, and cursor retries skip message consistency validation. Make control batches transactional, notify only after commit, and validate retried control content. Reuse the existing DB and authenticated home binding; do not add a second messaging system. Demonstrate rollback/retry/dedup and wrong-owner rejection across two runtime instances. This is a reliability slice, not a complete human-room feature.

## Acceptance and evidence

Run unchanged `build:web`, `build:orcad`, focused federation/provider/Git/terminal tests and typechecks; record baseline failures separately. Re-run after changes with `ORCA_BACKGROUND_LAUNCH=1`, bounded workers. Build/check the Tauri host and run on an isolated display if dependencies permit. Verify nonce/profile/loopback/resource fences and parent loss, plus unchanged browser startup. Render affected startup states at desktop and phone sizes in both themes when tooling permits. Lint and format changed source, run changed quality/ratchets. Commit explicit paths only.

## High-risk parity gates

Browser: `OffscreenBrowserBackend` imports Electron BrowserWindow; Node host has no equivalent embedded browser. Tauri system webview is not a drop-in. No hidden Electron fallback is permitted. Preserve source; browser profiles, annotations, downloads, CDP/control/crash behavior need a dedicated Chromium adapter and tests before release.

Web bridge: `withFallback` returns default values for missing APIs, and explicit web stubs exist (e.g. memory, WSL move, Codex config sync). Audit these as blocking, not functional. The initial host exercises a subset only.

Awake: existing `AgentAwakeService` uses Electron powerSaveBlocker plus Linux/macOS assertions; Windows deliberately does not change global lid settings. Retain it; Tauri adapter and physical sleep/lid evidence remain required.

No live provider, two physical devices, relay traversal, browser/computer control, OS lid behavior, macOS/Windows parity or complete port claim is authorized by narrow cloud tests. No deployment/release, original profile mutation or upstream push.
