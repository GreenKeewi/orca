# Experience and disposable demo

> Scope update: we are retaining all existing Orca features and porting Orca to Tauri. [Orca foundation](07-orca-foundation.md) and [migration roadmap](08-migration-roadmap.md) supersede greenfield implementation assumptions and any apparent deferral of inherited features.

## Information architecture

The project is the stable top-level container. A workspace is an execution context attached to a local clone, optionally using a worktree. A chat belongs to a project and can reference a workspace; it is not itself the branch. A task has an owner, plan revision, execution context and status. A room is a sharing boundary, not a replacement for the project.

```text
Projects                    Main tabs                       Context pane
  Storefront                Plan | API chat | Preview        People and agents
    Shared room             -------------------------        Tasks / changes
    Workspaces              Main reader or chat              Approvals / usage
      API / Harsh           Optional vertical split
      UI / Maya             -------------------------
    Chats                   Composer / relevant action
    Plans
    Tasks                   Connection + execution status
  Internal tools
```

Keep navigation stable when agents start or stop. Project folders collapse independently. The sidebar can move left/right or collapse; a keyboard shortcut and visible restore control remain. Remember per-project active tabs, splits, widths and reader position. Closing a tab never kills an agent without a separate action. Status badges distinguish running, waiting for approval, blocked, disconnected and finished with unreviewed changes.

## Views and actions

| View | Main information | Primary action | Important states |
|---|---|---|---|
| Project overview | Brief, baseline, room members, active work | Continue next task | Empty, dirty repo, missing provider |
| Plan reader | Goal, scope, steps, assumptions, checks, revision | Approve revision | Draft, approved, superseded, scope changed |
| Task board | Owner, provider, checkout, dependencies, status | Assign/start/review | Blocked, waiting, cancelled, quota reached |
| Agent chat | Stream, tool events, messages, attached evidence | Send/interrupt | Reconnecting, permission request, recovery |
| Changes | Scoped diff, original modifications, checks, attribution | Commit/review/integrate | Conflict, stale base, failed check |
| Team activity | Human/agent decisions and handoffs | Open referenced work | Delivery pending, revoked sender |
| Preview | URL, environment, viewport, annotations | Annotate | Unreachable route, stale branch, port not shared |
| Usage | Source/timestamp, reported quota, task totals | Manage local concurrency | Unknown, stale, limited, estimate |

Floating Cmd/Ctrl+K search opens above the active content. Keyboard arrows navigate groups; Enter opens a result and Escape returns focus. Results show project, type, path and freshness. Search is local by default; shared results only cover material the user can access. File/folder results come from an ignored-path-aware index. A search result never changes branches or opens remote access without an explicit action.

Markdown supports headings, code fences, task lists, tables, diagrams, internal links and source view. Sanitize HTML and links; remote images are off unless explicitly loaded. Plan steps link to tasks and checks rather than showing an unrelated duplicate checklist. Tasks derive progress from actual state, not an agent's optimistic prose.

## Visual direction proposal

Dense desktop workspace with quiet surfaces, readable document space and human/agent ownership visible beside work. Take inspiration from Orca's proximity of agents, terminal, diff and preview; use an original visual system and multiplayer-first hierarchy. Avoid cloning its assets or marketing copy.

- Palette: dark canvas #171a20, sidebar #111419, surface #222731, main text #eef2f7, muted text #b3becd, accent #a9c3ff. Light theme: canvas #f5f7fb, sidebar #e8edf5, surface #ffffff, text #172033, muted #465775, accent #244f9c.
- Typography: Segoe UI/system sans for controls and content; Cascadia Code/Consolas for paths and code. Sizes 12, 14, 16, 20, 28px. Documents use 16px and relaxed line height; primary controls use 14px.
- Spacing: 4, 8, 12, 16, 24, 32px. Controls at least 32px desktop and 44px at narrow sizes. Borders define panes; rounded corners are reserved for controls, dialogs and previews.
- Motion follows actions only; respect reduced motion. No animated fake activity.
- Focus must remain obvious in both themes; color is supplemented with text for all task and connection statuses.
- Narrow demo layout stacks panes and retains accessible navigation. This is responsive review coverage, not a commitment to a mobile product.

## Simple demos

The disposable browser demo is a guided simulation, not a functioning ADE. It intentionally has no credentials, real file editor, remote browser, agent process, Git operation or network implementation.

1. **Plan and delegate:** review a shared plan, approve it, then advance a two-person Codex/Claude scenario. See ownership, provider choice, an agent question and a checkpointed review result.
2. **Disconnect and recover:** simulate Maya going offline, see shared integration stop, reconnect and continue without duplicating the simulated task.
3. **Navigate work:** switch between plan, team, changes and preview; use global search, split view, themes, and sidebar placement/collapse.
4. **Annotate preview:** place a simulated annotation on a local sample UI and create a task. The preview is local demo content, not an external browsing engine.

Use these demos to decide whether the workflow is understandable before implementing real provider and multiplayer connections. A demo finding changes the specification; it does not silently become a production guarantee.

## Website demo and real-port design distinction

The concept website uses a dark, restrained landing page with an embedded workspace simulation, plus the formatted planning reader. Its display scale adds 40px and 64px headings. It is a standalone review artifact. Actual reused Orca components must use the upstream canonical Geist typography, CSS tokens and shadcn primitives rather than copying this throwaway demo CSS.
