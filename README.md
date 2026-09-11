# VALoansForVets CRM

`valoansforvets-crm` is one private internal CRM for the team behind
PHXHomeLoan.com and VALoansForVets.com. This repository owns the staff
interface, database integration, and Trigger.dev worker.

The current application supports staff-only test inquiries. It does not yet
provide a quiz, an intake API, appointment booking, or marketing funnels.

## Local development

Use Node.js 24.x and pnpm 11.10.0.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Copy `frontend/.env.local.example` to `frontend/.env.local` and fill in
the development values before starting the app.

Open <http://localhost:3000/crm> and sign in with a verified address in the
`CRM_STAFF_EMAILS` allowlist. In a second terminal run `pnpm trigger:login`
and then `pnpm trigger:dev`. The worker reads `frontend/.env.local`;
restart it after changing a value. Keep secrets server-only and do not commit
the file.

Useful checks are `pnpm typecheck`, `pnpm lint`, `pnpm test`, and
`pnpm build`.

## Services

- Clerk authenticates staff. Only verified identities listed in
  `CRM_STAFF_EMAILS` can use the CRM.
- Neon provides the database. Test work uses the pinned development branch;
  the application rejects the production host for this flow.
- Trigger.dev runs the test inquiry worker.
- Resend sends email only to the configured test allowlist when enabled. SMS
  is simulated and never contacts a provider.

The hosted test application is <https://valoansforvets-crm.vercel.app/crm>.
The Vercel project is `prj_YY6MeizqVoVEnsg7MRI41oD572D5` in the paid Studio
ROVST team. The old Vercel alias redirects to the new address.

See [CRM development flow](docs/crm-preview-setup.md) and
[deployment](docs/deployment.md).

## Migration record

The repository and hosted project were repurposed on 2026-09-11.
See [migration status and verification](docs/plans/crm-migration.md).
