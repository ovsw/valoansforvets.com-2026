# CRM development flow

This is one shared internal CRM for PHXHomeLoan.com and VALoansForVets.com.
The current flow creates test inquiries only. There is no quiz, intake API,
booking, or funnel implementation yet.

## Run locally

From the repository root, run the app and worker in separate terminals:

```sh
pnpm dev
pnpm trigger:login
pnpm trigger:dev
```

Open <http://localhost:3000/crm>. Sign in with the verified staff address
allowed by `CRM_STAFF_EMAILS`. The worker reads `frontend/.env.local`.

## Test behavior

1. A staff-only Server Action accepts a generated inquiry ID.
2. The server saves a fixed test inquiry in the Neon development branch.
3. Trigger.dev receives only that ID and reads the record from Neon.
4. Resend sends a confirmation only to `TEST_EMAIL_ALLOWLIST`.
5. The worker records simulated SMS and job completion.

Resend acceptance is not delivery. Check delivery in Resend; no delivery
webhook exists. SMS never contacts a provider.

A failed dispatch leaves the record available for retry. A global Trigger
idempotency key deduplicates concurrent dispatches for one inquiry and clears
after a failed run. Completed jobs skip sending. Resend uses a stable key;
email retries stop after 23 hours to stay within Resend's 24-hour window. The
queue runs one job at a time.

## Services and data

- Clerk development app: verified identities and `CRM_STAFF_EMAILS`.
- Neon project `bold-brook-55267955`, development branch
  `br-flat-pond-ayj3kzbk`.
- Trigger.dev project `proj_zufesthoajsdxpvfeqsr`.
- Resend test sender `onboarding@resend.dev`.

`PREVIEW_DATABASE_URL` must point to the development branch. The test code
rejects the production host. `PREVIEW_EMAIL_ENABLED` is off by default and
must be enabled only for the approved test recipient. No customer email or
SMS is enabled.

Migration and backup commands:

```sh
pnpm --dir frontend db:generate
pnpm --dir frontend db:migrate:preview
pnpm --dir frontend db:backup:preview
```

Backups are local ignored archives. The September 11, 2026 archive index check
passed; this is not a restore rehearsal. A full restore test is still pending.

## Hosted test app

Open <https://valoansforvets-crm.vercel.app/crm>. Vercel serves `main`; the
Trigger workflow deploys the hosted `prod` test worker when its files change.
The old alias remains until cutover. No hosted Sanity Studio or dataset is
part of this CRM. Existing hosted Sanity data was preserved.

The list and counts cover the latest 20 records. Any authorized staff member
can view, retry, or delete an inquiry, including multi-select deletion; each
delete has a confirmation step. Deletion also removes the simulated SMS row.
A running job for a deleted inquiry fails as not found. A database backup is
the only recovery path.

To rehearse recovery, restore a custom-format archive with
`pg_restore --no-owner --no-acl --exit-on-error` into a separate empty
PostgreSQL database. Compare schema and record counts before using it. Never
restore over production. Backups are ignored local files with mode 0600; keep
a separate secure copy for material changes.

## Historical verification

On September 10, 2026, staff submitted inquiry
`09eef6e4-9d08-4028-93e4-c05952bae7b4`. Its first run failed with email
disabled; retrying after enabling the approved test email completed. Resend
marked message `071485b9-7033-46b8-816c-1ad52746b26d` Delivered. Concurrent
replays retained that message ID. The CRM showed database saved, job complete,
email accepted, and SMS simulated. Anonymous, unverified, non-staff,
production-database, recipient, and retry-boundary checks also passed.
