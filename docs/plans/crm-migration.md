# Standalone CRM migration

Status: complete. Owner: primary agent. Updated: 2026-09-11.

## Approved outcome

Repurpose this repository as `valoansforvets-crm`. One internal CRM, database,
automation system, and future booking system serves PHXHomeLoan.com and
VALoansForVets.com. Deploy on Studio ROVST (`studio-rovst`), never DelGrossos.
Make the GitHub repository private. Preserve CRM records, test message limits,
staff authorization, and Git history. Keep the existing local worktree paths
until this session ends. Preserve hosted Sanity data; remove app coupling.

## Plan and status

- [x] Inspect current source and hosting; branch equals origin/main at 675014a.
- [x] Confirm name with user: valoansforvets-crm.
- [x] Rename GitHub repository, restrict visibility, and update remote.
- [x] Remove website/Sanity starter; preserve and test CRM behavior.
- [x] Simplify workspace, CI, and documentation.
- [x] Transfer and rename existing Vercel project to Studio ROVST; retain test services.
- [x] Run local checks and one CodeRabbit review; fix material findings.
- [x] Publish verified code and verify hosted app in Chromium extension browser.
- [x] Retire the old hosted test URL through a path-preserving redirect.
- [x] Record final URLs, evidence, and remaining product work.

## Safety and release checks

No new production database, real SMS, new quiz, public intake API, booking,
or nurture implementation is part of this migration. The Trigger.dev hosted
`prod` worker remains a test worker and uses the pinned Neon development branch.
Only one repository workflow deploys it. No secrets enter Git or task logs.
Before cutover: confirm root redirect, anonymous access, approved staff access,
CRM list and detail behavior, database target, and worker/environment pairing.
Email test needs the existing approved test recipient and no customer data.

## Current inventory

- Original repo: ovsw/valoansforvets.com-2026 (public; admin access).
- Original Vercel project: valoansforvets-com-2026, personal team.
- Original URL: https://valoansforvets-com-2026.vercel.app.
- Trigger.dev project: proj_zufesthoajsdxpvfeqsr.
- Neon test branch: br-flat-pond-ayj3kzbk, project bold-brook-55267955.
- Basecamp: account 6230954; VAL project 48575138; PHX project 47793039.
- No branch protection on original main at inspection.

## Work allocation

- crm_app (Terra): frontend routes, imports, components, focused tests.
- workspace_cleanup (Terra): packages, scripts, Sanity removal, CI.
- Primary: hosting, GitHub, service settings, docs, integration and live checks.

## Infrastructure progress

GitHub rename/private state verified. Vercel transfer retained project ID
`prj_YY6MeizqVoVEnsg7MRI41oD572D5` and all 28 environment entries. Destination
team ID is `team_giRaxUeEBcJZCpizTdiCSFZq` (Studio ROVST, Pro). New verified
domain: https://valoansforvets-crm.vercel.app. Old alias retained until cutover.

Browser baseline after transfer: anonymous `/crm` redirected to `/sign-in`;
Google sign-in with existing staff account succeeded on new domain; all four
pre-existing completed test inquiries remained visible. Browser: Chromium
extension, 2026-09-11. Final CRM-only build still pending.

## Verification before deployment

`pnpm verify` passed: TypeScript, ESLint, 19 Vitest checks, 13 Node checks,
and the production build. CRM database/auth/worker implementations are unchanged.
Fresh backup saved in ignored `frontend/.local/backups/` at
`preview-2026-09-11T12-10-47.356Z.dump`; archive index checked. A full restore
rehearsal remains separate work. CodeRabbit rejected the whole-repo review
before analysis (308 files, limit 300); the one review was narrowed to frontend.

Local production build verified in Chromium on port 3009: root opens CRM;
existing staff session loads four records; inquiry detail retains email and SMS
status. HTTP checks: root 307 to /crm, robots disallow all, old blog and Sanity
draft routes 404. No new inquiry or outbound message sent during these checks.

CodeRabbit frontend review completed with zero findings. No second review
will run after this initial review. Workspace/CI changes inspected directly.

## Completed cutover

- Private repository: https://github.com/ovsw/valoansforvets-crm.
- CRM: https://valoansforvets-crm.vercel.app (root redirects to /crm).
- Vercel: https://vercel.com/studio-rovst/valoansforvets-crm.
- Verified app commit: e10c043ceba3d1236e4606c498fd37ec104d42fe.
- Vercel deployment: dpl_9KYBgo1bBeLWMFthkmbQcGSX6TWK, Ready.
- Release gate: https://github.com/ovsw/valoansforvets-crm/actions/runs/34598023909 (success).
- Hosted worker: https://github.com/ovsw/valoansforvets-crm/actions/runs/34598023957 (success).
- New named checkout: /work/dev/val/valoansforvets-crm. Dependencies installed
  from the frozen lockfile; ignored local CRM settings and ROVST project link
  retained. Existing worktree paths remain intact for open sessions.
- Old domain returns 307 to the new domain, preserving both / and /crm.
- Removed 14 unused website Vercel env entries and six obsolete CI variables.
  Retained Clerk, Neon test, Trigger, and test messaging settings. Removed
  the unused DATABASE_URL from hosting; no database or hosted Sanity data deleted.
- User approved one test email. Hosted inquiry
  1ef5645b-11de-499d-b5f7-85b06def73b7 completed. Resend dashboard confirmed
  a6911c04-8aa9-4495-b01c-9e22d617e894 Delivered. No SMS sent. All four
  prior inquiries remain; five total records after verification.

## Remaining product work (outside this migration)

Public quiz/intake API, booking, real nurture automation, production customer
data setup, custom sender domain, real SMS, and a full database restore
rehearsal remain separate work. The deployed application is still a staff-only
test CRM. Hosted Sanity content and old Git history are preserved.
