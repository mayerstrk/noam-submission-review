# AI Agent Orchestration — `.ai-docs/`

## Setup

Place this folder as `.ai-docs/` in your project root.

```
your-project/
├── .ai-docs/
│   ├── README.md           ← You are here
│   ├── MASTER_PLAN.md      ← Phases, roles, sequencing, flow diagrams
│   ├── ARCHITECTURE.md     ← Folder structure, conventions, MCP tools, QA
│   ├── TASKS.md            ← Granular task list (the main working doc)
│   ├── API_STRATEGY.md     ← API layer, mocking, rate-limit handling
│   └── PROGRESS.md         ← Living tracker + commit log (updated every task)
```

## How to Use

### Starting a session

Tell the agent:

> Read `.ai-docs/MASTER_PLAN.md` then `.ai-docs/PROGRESS.md`. Pick up the next incomplete task from `.ai-docs/TASKS.md`.

### Quick commands

| Command           | Effect                                                       |
| ----------------- | ------------------------------------------------------------ |
| `"Start phase N"` | Agent reads plans, begins that phase                         |
| `"Continue"`      | Picks up next incomplete task                                |
| `"Review mode"`   | Switches to Reviewer role, audits code                       |
| `"QA check"`      | Uses Playwright MCP to verify current UI                     |
| `"Status"`        | Reads and summarizes PROGRESS.md                             |
| `"Commit"`        | Finalizes commit entry in PROGRESS.md, stops for your review |

### The Loop

```
Read MASTER_PLAN → Check PROGRESS → Pick task from TASKS →
Execute (using ARCHITECTURE + API_STRATEGY as reference) →
Update PROGRESS → At end of phase: propose commit message → STOP for review
```

### Key Rules

1. Agent reads docs BEFORE writing any code
2. Uses **Context7 MCP** for library docs (TanStack, shadcn) — never guesses APIs
3. Uses **Playwright MCP** to visually verify UI and check devtools
4. After each phase: stops, updates tracking, waits for your approval
5. DRY enforced — agent checks `ARCHITECTURE.md` before creating files
