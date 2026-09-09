VALoansForVets.com 2026

Bootstrapped from [ovsw/next-sanity-starter](https://github.com/ovsw/next-sanity-starter), commit `c96f7dcb1ebb3ac55762166948725ef046697a9c`.

## Local development

Use Node.js 24.x and pnpm 11.10.0. Dependencies and local environment files are set up in this worktree.

```bash
pnpm dev
```

- Website: http://localhost:3000
- Studio homepage in Presentation: http://localhost:3333/presentation?preview=%2F
- Sanity project: [valoansforvets.com-2026](https://www.sanity.io/manage/project/5s6rmni1)
- Project ID: `5s6rmni1`
- Dataset: `production` (public)

The dataset contains the starter's sample content. Edit it in Studio, or run `pnpm unseed` before you add real content. Unseed removes marked starter content; it does not empty the dataset.

Local settings and project-scoped tokens are in ignored `frontend/.env.local` and `studio/.env.local` files. The website token has the Viewer role. The Studio token has the Editor role for content scripts. Project administration needs your Sanity CLI login; the Editor token cannot manage CORS or project settings. Do not commit either environment file.

For another worktree of this repository:

```bash
pnpm setup:worktree --source /absolute/path/to/this/configured-worktree
pnpm dev:worktree
```

For a fresh clone, run `pnpm install --frozen-lockfile` and `pnpm setup` with this project's settings and new tokens. For local use, set `NEXT_PUBLIC_STUDIO_URL=http://localhost:3333` in `frontend/.env.local` after setup. The setup script otherwise uses a hosted Studio URL. No hosted Studio or website has been deployed.

Useful checks:

```bash
pnpm typecheck
pnpm lint
pnpm test:smoke
```

The original `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`, and existing files in `docs/` are preserved. The existing context still describes PHXHomeLoan.com; it has not been rewritten as part of setup.
