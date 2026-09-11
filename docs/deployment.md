# Deployment

The CRM is a standalone Next.js application. Vercel hosts the web app and
Trigger.dev hosts its worker. One owner deploys the worker:
`.github/workflows/deploy-worker.yml` on `main` pushes.

## Vercel

The private GitHub repository is deployed with `frontend` as the project
root in the paid Studio ROVST team. Project ID:
`prj_YY6MeizqVoVEnsg7MRI41oD572D5`. Current URL:
<https://valoansforvets-crm.vercel.app>.

Production deploys use `main`. Set variables from
`frontend/.env.local.example`, including the production Trigger secret and
the staff and test-recipient allowlists. The application remains a private
test CRM until a real production data flow exists.

The old `valoansforvets-com-2026.vercel.app` alias redirects to the new CRM
URL with status 307 and preserves the path. It does not host a separate app.

## Trigger.dev

Trigger project `proj_zufesthoajsdxpvfeqsr` retains the hosted `prod`
environment. It is a test worker using the pinned Neon development branch.
The workflow deploys it when worker or database files change on `main`.

Required repository secrets are `PREVIEW_DATABASE_URL` and
`TRIGGER_ACCESS_TOKEN`. See [Trigger setup](trigger-setup.md).

## Release checks

Run `pnpm verify`, confirm anonymous redirect and staff allowlist behavior,
and confirm the worker and website use the same Trigger environment and Neon
development branch. The test worker is not a production intake or booking
system.
