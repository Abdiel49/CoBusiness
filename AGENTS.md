## Project-wide agent rules

### Product and implementation truth

- Read `PRODUCT.md` before making product or user-flow decisions. Treat its roadmap and target capabilities as planned scope, not proof that a feature is implemented.
- Report any requirement you cannot complete. Include the failed requirement, the exact error or blocker, the affected work, and a practical suggestion or the missing prerequisite. Do not imply that a failed command or incomplete step succeeded.

### Task delegation and completion reports

- Delegate every task to a subagent unless the user explicitly asks not to delegate.
- Give each subagent a complete task brief with the title, goal and description, required functionality, acceptance criteria, relevant constraints and files, and known dependencies.
- Require the subagent to report each required functionality as completed or not completed, with evidence. For incomplete work, identify whether the cause was a blocker, missing information, or an error, and suggest a practical next step.
- The primary agent remains responsible for reviewing delegated work, verifying the result, and reporting overall task status.
- If a subagent tool is unavailable, report that delegation could not be completed; never claim that the task was delegated.

### API documentation

- Before answering questions about or implementing against this project's API, inspect the local OpenAPI JSON at `http://localhost:3001/api/docsjson`. Use it as the source of truth for routes, methods, request and response schemas, authorization, and documented errors.
- If the endpoint is unavailable, report the exact error and affected work. Do not invent API behavior. Request that the API be started or a supplied, versioned specification be provided; continue only work that does not depend on the missing API details.

### Feature documentation

- Document every implemented feature in `docs/features/<feature-slug>.md`, in English. Include user-visible behavior, key flows and states, relevant API and data contracts, configuration, verification performed, and known limitations or pending integrations.
- Keep feature documentation current when the implementation or its integration status changes. Continue updating `docs/component-inventory.md` when reusable UI components change.

### Language and comments

- Write source code, identifiers, and technical documentation in English.
- Avoid code comments unless they explain a non-obvious constraint or invariant, or the user requests them.
- User-facing copy should follow the product's confirmed locale and content requirements.

### Component reuse

- Before implementing a UI component, inspect the existing component source and `docs/component-inventory.md` for a reusable match.
- Reuse and extend an existing component when it meets the need. Add a new component only when the inventory and source confirm there is no suitable one.
- Update `docs/component-inventory.md` when adding, removing, or materially changing a reusable component.

### UI/UX work

- Impeccable is required for all UI/UX design and implementation work. Read `.agents/skills/impeccable/SKILL.md`, run its context/setup command as directed, and follow the applicable command reference before changing interface code.
- Treat `PRODUCT.md` as product truth. Do not invent product capabilities, commercial claims, customers, or outcomes in the interface.
- If Impeccable cannot run or a required UI/UX step cannot be completed, report the exact failure and a suggestion or prerequisite before presenting the interface work as complete.

### Branches, commits, and pull requests

- Work on one feature at a time. Start each feature on a new `feature/<short-name>` branch created from `develop`; do not implement features directly on `main` or `develop`.
- Commit a focused change for each completed feature. Do not create feature commits while the feature is incomplete.
- When a feature is complete, open a pull request from its feature branch to the remote `develop` branch.
- Apply the same `develop` base and pull-request flow to bug fixes, using a `fix/<short-name>` branch.
- If the repository has no remote or no `develop` branch, do not silently substitute another base or claim a pull request was created. Report the missing remote/branch and the exact command error or repository state, then suggest configuring the remote or restoring `develop`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
