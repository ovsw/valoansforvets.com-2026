# Host one shared CRM outside the public websites

On 2026-09-11 the owner chose to repurpose this repository as `valoansforvets-crm`,
a separate internal application serving both PHXHomeLoan.com and
VALoansForVets.com. It owns one CRM interface, customer database, automation
system, and future appointment booking system; the websites are entry points.
This avoids duplicate staff interfaces and competing worker deployments.

The repository owns the shared worker deployment. Test and live data are
separate concerns from brand attribution. The existing test infrastructure is
retained for development; the repository name does not limit it to one brand.
