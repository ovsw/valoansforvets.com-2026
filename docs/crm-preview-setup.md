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
that record ID. A global Trigger.dev idempotency key deduplicates concurrent
dispatches for the same inquiry. Trigger.dev clears the key after a failed run,
so a later retry can create a new run. Completed jobs skip sending. Resend also receives a stable
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

## Hosted test environment

During this phase, the `main` branch on the Vercel domain is the hosted test
environment. There is no separate staging branch, Sanity dataset, or review
Studio yet. Add them when a public domain goes live, because that is the
first moment production content and production data differ from test.

- Website: https://valoansforvets-com-2026.vercel.app
- Staff CRM: https://valoansforvets-com-2026.vercel.app/crm
- Hosted Studio: https://valoansforvets-com-2026.sanity.studio

The Vercel team is on the Hobby plan. The production URL has no Vercel
protection. The CRM relies on Clerk sign-in plus the `CRM_STAFF_EMAILS`
allowlist. The site sends `noindex` while `NEXT_PUBLIC_SITE_ENV` is not
`production`. Keep that value at `development` until launch.
Vercel Authentication stays on for pull-request previews only.

| Variable | Local | Hosted |
| --- | --- | --- |
| Frontend `NEXT_PUBLIC_STUDIO_URL` | `http://localhost:3333` | `https://valoansforvets-com-2026.sanity.studio` |
| Frontend `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://valoansforvets-com-2026.vercel.app` |
| Frontend `TRIGGER_SECRET_KEY` | Development key | Prod key from the Trigger.dev API keys page |
| Frontend `PREVIEW_EMAIL_ENABLED` | `true` | `true` |
| Frontend `CRM_STAFF_EMAILS` | Your address | All staff testers, comma separated |
| Frontend `TEST_EMAIL_ALLOWLIST` | Your address | Same list as `CRM_STAFF_EMAILS` |
| Studio `SANITY_STUDIO_PREVIEW_URL` | `http://localhost:3000` | `https://valoansforvets-com-2026.vercel.app` (set by `deploy:hosted`) |

Each staff tester needs a verified Clerk account with an address on both
lists. The confirmation email goes to the address of the person who submits
the test. Any staff member can retry any inquiry.

Vercel deploys the website from `main`. The `Deploy worker` GitHub Action
migrates the test database and deploys the Trigger.dev worker to the `prod`
environment on every push to `main` that touches worker or database files.
It needs two repository secrets: `PREVIEW_DATABASE_URL` and
`TRIGGER_ACCESS_TOKEN` (a personal access token from Trigger.dev).
Deploy the Studio by hand:

```sh
pnpm --dir studio deploy:hosted --yes
```

Local secret values stay in `frontend/.env.local` and `studio/.env.local`.
Never replace either local file with a downloaded hosting environment file.

## Acceptance test

Run this with every local server and worker stopped.

1. Open the CRM URL and sign in with Google, using an address on the staff list.
2. Choose **New test inquiry**, then **Submit test inquiry**.
3. Choose **Refresh** until the row shows **Complete**. This takes under a minute.
4. Open the row with **View**. Confirm the email is accepted, the SMS section
   shows the simulated message, and the inquiry ID is shown.
5. Check your inbox for the test confirmation email.
6. Use the search box, the status filter, and the date sort.
7. Failure check: an inquiry that fails shows **Failed** and a **Last error**
   box. Choose **Retry this inquiry**. A completed retry keeps the same email
   ID, so no second email is sent.
8. Open the hosted Studio, edit a page, and confirm the change shows in the
   Studio preview. Use **Open in Studio** on the website preview to confirm it
   opens the same document.
9. Repeat steps 1 to 4 on a phone. Confirm navigation and forms work.

## Staff UI

The CRM uses adapted licensed Shadcnblocks `stats-card1` and `data-table1`, with
existing shadcn components. The public hero uses `hero1`. The CRM style is the
long-term staff interface direction. Its current data is still test inquiries.
Search, status filters, date sorting, request details, refresh, and safe retries
operate on the latest 20 records. Counts refer to that loaded list, not all-time
business totals. Email acceptance is separate from delivery. No customer SMS is
sent. Staff outcomes and availability still need their domain implementation.

## Remaining infrastructure work

The custom email sending domain and a full restore rehearsal remain before
the complete Basecamp infrastructure task can close. Real SMS and the
newsletter stay deferred. A staging branch, dataset, and review Studio come
with the public domain.
