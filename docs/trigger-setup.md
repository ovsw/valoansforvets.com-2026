# Trigger.dev setup

The project is **VALoansForVets.com** in **OVS Websites**.
Its project reference is `proj_zufesthoajsdxpvfeqsr`.

[Open the Development tasks](https://cloud.trigger.dev/orgs/ovs-websites-17f1/projects/valoansforvetscom-jwiX/env/dev).

Tasks and `trigger.config.ts` live in `frontend/`, beside the Next.js app.
Sanity Studio does not run these tasks.

## Run the connection check

1. Run `pnpm install --frozen-lockfile` from the repo root.
2. Run `pnpm trigger:login` and complete the CLI login in your browser.
3. Run `pnpm trigger:dev` and keep the process open.
4. In the Development tasks page, open `infrastructure-check`.
5. Use **Test** with the empty payload `{}`. The run must complete with
   `status: "ok"` and `environment: "DEVELOPMENT"`.

The task has no schedule. It sends no email and uses no private records.
The local worker executes tasks on this computer. The dashboard stores run
metadata and results.

## Hosted worker

The `prod` environment runs the hosted worker for the test flow. The
`Deploy worker` GitHub Action deploys it on every push to `main` that touches
worker or database files. To deploy by hand after `pnpm trigger:login`:

```sh
pnpm --dir frontend exec trigger deploy --env prod
```

The hosted worker reads its environment variables from the Trigger.dev
`prod` environment, not from Vercel. Set `PREVIEW_DATABASE_URL`,
`PREVIEW_EMAIL_ENABLED`, `RESEND_API_KEY`, `RESEND_FROM`, and
`TEST_EMAIL_ALLOWLIST` there. The Vercel `TRIGGER_SECRET_KEY` must be the
`prod` secret key so the website dispatches to the hosted worker.

## Verified connection

On September 9, 2026, the local development worker connected and
[`run_06g8e0fft10vluhic4o15jso01`](https://cloud.trigger.dev/orgs/ovs-websites-17f1/projects/valoansforvetscom-jwiX/env/dev/runs/run_06g8e0fft10vluhic4o15jso01)
completed with `status: "ok"` and `environment: "DEVELOPMENT"`.
The workspace also passed frontend type checking and lint for the new task
and configuration.

## Simulate SMS

Use the `simulate-sms` task in the Development tasks page with payload `{}`.
Its output shows a sample inquiry confirmation and `status: "simulated"`,
with `sent: false`. It accepts no phone number or borrower data and makes
no messaging-provider calls. No SMS credentials or paid account are needed.

This is a manual infrastructure test, not yet connected to a form or CRM.
The dashboard stores the sample result; it is not evidence of SMS delivery.
SMS will remain simulated while the first form and CRM flow are built.
WhatsApp and Telegram are not configured.

## Next.js integration

The app uses `TRIGGER_SECRET_KEY` from server code to dispatch `test-inquiry`.
The local worker uses the CLI login and reads `.env.local` at startup.
Restart it after an environment change. Never expose a secret with `NEXT_PUBLIC_*`.

The protected [CRM test page](http://localhost:3000/crm) saves a fixed test
inquiry in Neon, dispatches its ID, sends an allowlisted email, and records
simulated SMS. See [CRM development setup](crm-preview-setup.md) for commands,
access rules, verification, and remaining hosting work.
