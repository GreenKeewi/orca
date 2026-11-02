# Cloud implementation evidence

Source: GreenKeewi/orca, starting at `ade/tauri-multiplayer` / `6d6bf40e82623236cc09cb9606db8f2da8e09201`, with upstream `32a6c4206eb7c31e846c2d32285e5125e6fc2bc2` in its ancestry. Repository was clean before changes. Upstream history, MIT notice, providers and original application remain intact.

## Implemented

- Real Tauri 2 host for the existing Orca web renderer/App and web/runtime bridge. No standalone replacement UI or hidden Electron process.
- Separate `dev.harshs.orca-ade` profile, build-embedded runtime resource hashes, pinned packaged Node, owned child PID/nonce/protocol handshake, ephemeral loopback listener, session-only pairing, native bootstrap ACL limited to the local main asset window, background startup and normal shutdown on parent pipe loss. Failure does not auto-relaunch or attach to another installation. Runtime stderr goes to private ADE diagnostics.
- Existing runtime's federation control-mail import now uses its existing lifecycle transaction helper: batch mail/cursor changes commit together, notifications occur after commit, and duplicate control content is checked against durable mail. A changed message ID behind the imported cursor is no longer silently accepted as a valid retry. Ordinary matching retries remain idempotent.
- Required lintapple dev dependency and policy matching Geist/Orca typography, desktop/phone viewports and both themes. Existing checks remain intact.
- Reproducible static capability audit: 800 literal runtime methods, 609 source files with Electron imports and 475 candidate web defaults. These counts are inventory signals, not parity scores. Dynamic methods and all behavior still require assessment.

## Test results

| Check                                                                 | Observed result                                                                                                                                  |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Frozen root lockfile install using pnpm 12.14.0                       | Passed with scripts deferred for explicit build execution                                                                                        |
| Existing web build and verify-web-build                               | Passed; existing chunk/dynamic-import warnings                                                                                                   |
| Existing mobile-web build and verifier                                | Passed after running mobile's existing asset-generation scripts; 182 assets                                                                      |
| Existing Node orcad build                                             | Passed; 7,913 modules, zero Electron / node:sqlite imports in server graph; PTY prebuild/glibc check and bundled load/worker smoke guards passed |
| Desktop resource stage                                                | Passed; 238 verified runtime files, including preserved Orca MIT notice                                                                          |
| `pnpm tc:node`, `pnpm tc:web`                                         | Passed using repository typecheck workflow                                                                                                       |
| Focused Vitest selection (8 files)                                    | 26 passed                                                                                                                                        |
| Rust library tests                                                    | 3 passed: nonce/PID/endpoint rejection, path/manifest refusal and tampered resource rejection                                                    |
| Complete Tauri Windows-target `cargo check --locked`                  | Passed from Linux with Windows Rust target and MinGW resource tools; compile evidence only                                                       |
| Changed-source oxlint and changed code-quality checks                 | Passed; zero new findings                                                                                                                        |
| Changed formatting, diff whitespace, capability inventory consistency | Passed                                                                                                                                           |
| Existing flaky-test pattern ratchet                                   | Passed                                                                                                                                           |

The 26 tests cover the new desktop-parent and renderer bootstrap contracts, existing orcad entry behavior, Codex delegation translation, Git quoted-path handling, terminal row metadata, browser-headless capability behavior, and federation control mail.

### Collaboration regression proof

With the original upstream `federation-relay.ts` restored temporarily, the new regression selection produced **3 failures / 6 passes**. With the implementation restored it passes. The three exposed failures are partial batch commit, changed-content retry acceptance, and the same retry acceptance over encrypted transport after disconnect.

The encrypted fixture uses the existing `WebSocketTransport`, `MobileSocketWiring`, device registry, E2EE handshake and dispatcher, with two orchestration runtime instances. It sends mail, forcibly terminates the socket before consuming the acknowledgement, reconnects, retries without duplicate delivery, then rejects changed content. Separate checks reject a different authenticated owner and roll back an invalid batch before a corrected retry. No provider CLI or real agent is launched by this fixture; pane identities are controlled test fixtures.

## Environmental limits and failed attempts

The cloud runtime skill was read. This executor exposes neither `cloud_environment.environment_status` nor `/etc/codex/network-policy.json`, so managed credential readiness could not be established by that workflow. Public clone/fetch succeeded; CLI push had no GitHub credentials. Connected GitHub tools are the fork-only review delivery path. No credentials were copied or displayed.

The initial unchanged web/runtime build stopped in the tsx CLI's unnecessary IPC listener (`listen EPERM`). The workspace build now uses the same tsx loader via Node `--import`, after which both builds pass. A later runtime build required mobile's existing generated assets; those were built rather than omitted. GNU tar required `TAR_OPTIONS=--no-same-owner` for the pinned Node archive in this user-namespace executor. No source or integrity checks were disabled.

The original peer-desktop live-server suite has **4 environment-blocked tests**: the executor denies the runtime's Unix socket. The full Node daemon/runtime was not run successfully here. No production Unix-socket, PTY-session continuity or native-window launch result is claimed by the narrower tests.

Linux native `cargo check` is blocked by missing pkg-config/GTK/WebKit development prerequisites. OS-package installation encountered container permissions and proxy/allowlist failures. Playwright's Chromium download yielded a truncated/invalid archive. Consequently native screenshots, desktop/phone light/dark rendered-state inspection and lintapple execution remain **unverified**, not passing. The Windows-target compile check does not establish Windows runtime behavior. An optional direct standalone TypeScript invocation was memory-killed; the supported repository typecheck workflow passed.

## Remaining release gates

1. Run the Tauri window and real local runtime together on an equipped machine; verify projects, file reads, structured chat, terminal output, startup failure, shutdown and crash recovery. Produce rendered-state/lintapple evidence.
2. Replace the Electron `BrowserWindow` browser backend with a tested non-Electron adapter preserving profiles, screenshots, downloads, annotations, input and agent control. Preserve all original native/API features; web fallback values and stubs are blocking gaps, never functional implementations.
3. Implement human room membership, scoped per-owner permissions, desktop encrypted relay fallback and two-physical-computer onboarding. Upstream runtime-scope relay offers are explicitly rejected today. Existing full-trust remote pairing is not a scoped team invite.
4. Connect shared revisioned plan approval, baseline/preflight, bounded task ownership, checkpoint/write fencing and controlled integration to real per-person Codex/Claude execution. Existing federation/depth/mail machinery is retained; this slice is not the complete managed collaboration policy.
5. Validate all supported macOS/Linux/Windows, folder, remote and mobile behaviors. Port existing keep-awake/platform assertions; physical lid behavior remains untested. Audit release packaging/signing, updater/service identities and third-party notices before distribution.

No deployment, release publication, feature removal, original-profile migration or upstream write occurred. The full-parity release gate remains open.
