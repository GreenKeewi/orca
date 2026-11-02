# Orca ADE integration preview

This host loads Orca's existing web renderer and App, launches its packaged Node runtime, and pairs through its existing encrypted runtime bridge. It is an internal integration slice, not a parity-complete desktop replacement.

## Build

Use the repository's Node 24 and pinned pnpm. Install Rust and the platform prerequisites documented by Tauri 2 (Linux requires pkg-config, GTK and WebKitGTK 4.1 development packages; Windows requires WebView2 and the supported Rust toolchain).

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm -C mobile install --frozen-lockfile
pnpm build:ade-desktop
```

The existing mobile install generates renderer assets needed by the existing runtime distribution. The debug binary uses the staged development resources; no Node installation, daemon launch, port configuration or pairing-code copy is required when opening it. This command builds a debug integration binary without producing or publishing an installer. Production resource layout and signing remain release gates.

For isolated tests, set `ORCA_BACKGROUND_LAUNCH=1` before starting an app. The native window starts hidden and is only shown on interactive launches. No foreground activation is performed.

## Ownership and isolation

Application ID: `dev.harshs.orca-ade`. Its own app-local-data directory owns runtime state, device identities and daemon endpoints. It never attaches to a discovered Orca port or copies an original profile. Runtime resources are checked against a build-embedded SHA-256 manifest before launch. The packaged Node executable must match upstream's pin. The readiness response must bind protocol version, a random launch nonce, the spawned PID and an ephemeral loopback endpoint. The renderer receives a session-only pairing and uses upstream E2EE; pairing secrets are not put in the address bar.

Only the main local asset window has the native bootstrap permission. External pages receive no native grants. Parent pipe loss requests normal orcad shutdown; the existing daemon and recovery behavior remain authoritative. A failed/crashed runtime is not automatically relaunched. Unknown task/provider outcomes need reconciliation.

## Explicit gaps

The original Electron application remains intact. This host does not launch Electron. Existing web bridge defaults and stubs are not Tauri parity. The static inventory in `docs/ade/cloud-capability-audit.json` lists native boundaries, runtime methods and candidate web defaults; it does not prove all behavior has been assessed.

Browser embedding/automation, dialogs and OS integration, keep-awake/lid behavior, original remote/mobile surface parity, and secure release packaging are still blockers. The existing browser backend uses Electron BrowserWindow. A system webview is insufficient evidence of browser parity. Desktop team relay connectivity, human room roles, revisioned plan approval, write protection and controlled integration also require additional implementation and testing. Original unrestricted agent/terminal modes remain available and do not acquire managed execution guarantees from this host.

## Focused checks

```sh
pnpm tc:node
pnpm tc:web
pnpm test src/main/orcad/orcad-desktop-parent.test.ts src/renderer/src/web/tauri-bootstrap.test.ts src/main/runtime/rpc/methods/orchestration/federation/federation-control-mail.test.ts --maxWorkers=2
cargo test --locked --manifest-path native/ade-desktop/Cargo.toml --no-default-features --lib
cargo check --locked --manifest-path native/ade-desktop/Cargo.toml
node config/scripts/audit-ade-capabilities.mjs --check
pnpm lint:ade-ui <running-web-client-url>
```

The Rust library tests check handshake and packaged-runtime integrity without a webview. They do not prove a native window, native APIs or a provider works. The encrypted reconnect fixture uses real upstream E2EE and loopback WebSockets with two runtime instances; it does not prove connectivity between physical computers, NAT traversal, relay service operation or local provider execution.
