# Validation record

This record distinguishes performed checks from planned acceptance tests. Final planning/demo checks were performed November 1, 2026.

## Completed checks

- Installed local dev dependencies: lintapple 0.1.24 and Markdown-it, with npm lockfile. npm reported no known vulnerabilities at installation.
- Initialized and tailored ui-policy.json to the demo's intended colors/type scale/control sizes, without broad exceptions.
- Verified 68 rendered states with lintapple checkPage: workspace plan, disconnected team, changes, annotations, search, split and sidebar-right; website/FAQ; all eight planning documents. Matrix: 1440×1000 and 390×844, light and dark. Final result: zero findings and zero captured workspace script errors. Reports are in reports/ui-states.json and reports/findings.json.
- Exercised approval → running → review, offline gating/reconnect, annotation-to-task, keyboard search navigation and Escape, sidebar collapse/restore, side switching, splits and reset. These are demo interactions, not backend integration tests.
- Visually inspected desktop website/workspace screenshots and the public Orca reference. Phone layouts were covered by rendered checks and generated screenshots.
- Two builder reviews identified and resolved specification gaps, including approval authority, revision invalidation, runtime/profile ownership, platform parity, recovery failures and pairing assumptions. This is a design review, not proof of technical feasibility.
- Pinned the inspected Orca baseline to 32a6c4206eb7c31e846c2d32285e5125e6fc2bc2; recorded 58 upstream documentation pages and 91 preload API entries as preservation audit seeds. No entry is marked ported/tested merely because it was found.

## Environment observations

- Node v22.20.0 is installed.
- Codex CLI 0.166.0-alpha.5.1 and Claude Code 2.1.285 are discoverable locally. Version discovery is not an authenticated integration test.
- The parent working folder is not a Git repository; planning artifacts live in their own new folder.
- Initial restricted npm access failed with EACCES, and restricted browser launch failed with EPERM. Permitted tool escalation subsequently enabled local installation and completed rendered checks. These setup failures do not remain verification blockers.

## Not yet proven by this package

Real provider execution/authentication, real multi-computer networking, filesystem isolation, Git recovery/integration, native Tauri rendering, browser/desktop automation, accurate usage accounting, keep-awake/lid behavior, and product demand.

The demo is a local state machine for reviewing flows. It is not evidence that these capabilities work.
