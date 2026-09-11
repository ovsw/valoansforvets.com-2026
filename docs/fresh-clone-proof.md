# Fresh-clone proof

Use this checklist for a fresh checkout of the standalone CRM. It does not
create or remove hosted data.

1. Clone the private `ovsw/valoansforvets-crm` repository.
2. Use Node.js 24.x and pnpm 11.10.0, then run
   `pnpm install --frozen-lockfile`.
3. Copy `frontend/.env.local.example` to `frontend/.env.local` and provide
   development credentials and the pinned Neon development connection.
4. Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build`.
5. Run `pnpm dev` and `pnpm trigger:dev` in separate terminals.
6. Open `/crm`, confirm anonymous users redirect to sign-in, and sign in with
   a verified address on `CRM_STAFF_EMAILS`.
7. Submit a test inquiry. Confirm the saved record, worker completion,
   allowlisted test email, and simulated SMS.
8. Retry a failed inquiry and confirm idempotency and retry behavior in
   [CRM development flow](crm-preview-setup.md).
9. Confirm an unverified or non-allowlisted identity cannot read or create
   inquiries.

Keep proof against the Neon development branch and approved test email. Do
not call this a production migration, intake, booking, or funnel test.
