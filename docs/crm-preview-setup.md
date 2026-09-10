# CRM development flow

## Open and run

Open <http://localhost:3000/crm>. Sign in through Clerk with the verified
`ovi@ovswebsites.com` address. A Clerk dashboard login is separate from the
website login. Other signed-in accounts cannot read or create test inquiries.

From the repo root, run these commands in separate terminals:

```sh
pnpm --dir frontend dev
pnpm --dir frontend trigger:dev
```

The worker reads `frontend/.env.local`. Restart it after changing a setting.
Do not print, commit, replace, or copy these secrets into Studio.

## What the test does

1. A staff-only Server Action accepts a generated inquiry ID.
2. The server saves a fixed test inquiry in Neon. No borrower fields are accepted.
3. Trigger.dev receives only the inquiry ID and reads the record from Neon.
4. Resend sends a test confirmation only to `ovi@ovswebsites.com`.
5. The worker records simulated SMS and job completion.
6. Refresh the CRM page to see the result. Use the Resend link to check delivery.

“Accepted by Resend” does not mean delivered. Delivery is checked in Resend;
there is no delivery webhook yet. SMS never contacts a provider.

A failed dispatch leaves the saved record available for retry. Retrying uses
that record ID. Completed jobs skip sending. Resend also receives a stable
idempotency key. Email retries stop after 23 hours to stay inside Resend's
24-hour idempotency window. For an older incomplete record, inspect Resend
before deciding whether to create a new test. The task queue runs one job at
a time. A saved pending record can be retried if the app stops before dispatch.

## Environment and ownership

All current service projects belong to the developer's workspace. Client
ownership and production deployment remain separate work.

- Next.js: staff UI and server authorization.
- Clerk: development app authentication; `CRM_STAFF_EMAILS` restricts verified identities.
- Neon: project `bold-brook-55267955`, development branch `br-flat-pond-ayj3kzbk`.
- Trigger.dev: project `proj_zufesthoajsdxpvfeqsr`, local Development worker.
- Resend: developer workspace, test sender `onboarding@resend.dev`.
- Sanity: website content only. No dataset was changed for this flow.

`PREVIEW_DATABASE_URL` points at the development branch. The test code rejects
any other host, including the production host. The pre-existing `DATABASE_URL`
was preserved and is not used by this test flow. The development branch was
created schema-only with automatic deletion disabled.

`PREVIEW_EMAIL_ENABLED` is `true` locally for the authorized email test.
The example defaults to `false`. The worker also requires the fixed test
recipient, `TEST_EMAIL_ALLOWLIST`, `RESEND_FROM`, and `RESEND_API_KEY`.
No customer email or SMS is enabled. Clerk and Trigger keys remain server-only,
except Clerk's intentionally public publishable key.

## Migrations and backups

```sh
pnpm --dir frontend db:generate
pnpm --dir frontend db:migrate:preview
pnpm --dir frontend db:backup:preview
```

Migration files are checked into `frontend/drizzle/`. The migration runner
uses only the pinned development database. It never falls back to `DATABASE_URL`.
The backup command needs PostgreSQL 18 `pg_dump` and `pg_restore`. It saves a
custom-format archive in ignored `frontend/.local/backups/`, with file mode
0600, and checks its table-of-contents. The command does not print credentials.
Keep backups outside Git and keep a separate secure copy before material changes.

To restore, use `pg_restore --no-owner --no-acl --exit-on-error` into a separate,
empty PostgreSQL database. Provide connection settings through PostgreSQL's
standard environment variables. Compare the restored schema and record counts
before switching any application connection. Do not restore over production.
A complete restore rehearsal has not yet been performed; an archive check is
not a restore test. Neon's current history retention is six hours.

## Verified on September 10, 2026

- The user signed in and submitted inquiry `09eef6e4-9d08-4028-93e4-c05952bae7b4`.
- Its first job failed with preview email disabled. Retrying the same record
  after restarting the worker with email enabled completed successfully.
- Resend marked email `071485b9-7033-46b8-816c-1ad52746b26d` Delivered.
- Two concurrent replay requests completed and retained that same email ID.
- The CRM showed database Saved, job complete, email accepted, and SMS simulated.
- An anonymous visit to `/crm` redirected to sign-in. Automated checks cover
  unverified and non-staff identities, production database rejection, recipient
  restrictions, retry expiry, and the existing blog proxy behavior (27 checks).
- Next.js production build passed. One CodeRabbit review of tracked changes
  raised authorization as a concern; the page and data operations already
  enforce verified staff authorization. New files received local inspection
  and automated checks; they were not in that CLI review's reported file list.
- A development database backup was saved and its archive index checked.

## Hosted preview and Studio

- Protected website: https://valoansforvets-com-2026-preview.vercel.app
- Staff CRM: https://valoansforvets-com-2026-preview.vercel.app/crm
- Hosted Studio: https://valoansforvets-com-2026.sanity.studio
- Existing production: https://valoansforvets-com-2026.vercel.app

The preview uses Vercel authentication. Keep project deployment protection on.
The production site has not been promoted to this new build.

| Variable | Local | Hosted |
| --- | --- | --- |
| Frontend `NEXT_PUBLIC_STUDIO_URL` | `http://localhost:3333` | `https://valoansforvets-com-2026.sanity.studio` |
| Frontend `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Preview or production URL above, scoped by Vercel environment |
| Studio `SANITY_STUDIO_PREVIEW_URL` | `http://localhost:3000` | Protected preview URL above (set by `deploy:hosted`) |

Sanity credentialed CORS permits these exact hosted origins and the local dev
origins. The official `@sanity/vercel-protection-bypass` Studio tool reads its
secret from protected document `sanity-preview-url-secret.vercel-protection-bypass`.
Anonymous dataset reads cannot retrieve that document. Do not put this bypass
secret in public environment variables, source, or links in documentation.

Deploy from the linked repository root:

```sh
pnpm dlx vercel deploy --yes --scope ovi-savescus-projects
pnpm dlx vercel alias set <new-deployment-host> valoansforvets-com-2026-preview.vercel.app --scope ovi-savescus-projects
pnpm --dir studio deploy:hosted --yes
```

Local secret values stay in `frontend/.env.local` and `studio/.env.local`.
Vercel environment values are managed separately in its project settings.
Never replace either local file with a downloaded hosting environment file.

## Staff UI

The CRM uses adapted licensed Shadcnblocks `stats-card1` and `data-table1`, with
existing shadcn components. The public hero uses `hero1`. The CRM style is the
long-term staff interface direction. Its current data is still test inquiries.
Search, status filters, date sorting, request details, refresh, and safe retries
operate on the latest 20 records. Counts refer to that loaded list, not all-time
business totals. Email acceptance is separate from delivery. No customer SMS is
sent. Staff outcomes and availability still need their domain implementation.

## Remaining infrastructure work

The hosted preview dispatches to Trigger Development. Its worker currently runs
locally; it is not an always-on hosted worker. Deploy the worker and configure
its matching environment before relying on unattended job processing.
The custom email sending domain and a full restore rehearsal also remain before
the complete Basecamp infrastructure task can close.
