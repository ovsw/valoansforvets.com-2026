> Historical website redesign brief, retained for business context.
> Since 2026-09-11 this repository owns the shared internal CRM.
> Website implementation belongs in the separate website repositories.
> See ../adr/0001-shared-standalone-crm.md.

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: veterans as Prospective Borrowers.** A veteran (or active-duty service member) exploring a home purchase, refinance, or mortgage options, nationwide. Most arrive from Jimmy Vercellino's YouTube channel and already trust him. The initial Audience is **First-Time Buyers**; **Ready Buyers** (want to be in a home within 90 days) are the first priority inside it. Their obstacle is **Buyer Uncertainty**: how VA loans work, how much money and time they need, what credit they need, whether they qualify, what they can afford.

**Internal: Jimmy Vercellino** takes every Consultation himself and records the Consultation Outcome. **Team Members** answer inbound messages and handle exceptions automation cannot. Staff use the gated `/crm` surface (Clerk auth, `CRM_STAFF_EMAILS`).

**Not a site user: Luminate Bank** (the Lender) owns the Mortgage Application on its own systems.

Vocabulary is fixed in the root `CONTEXT.md`. Use its terms (Engaged Lead, Consultation, Opportunity, Blog Post) and respect its `_Avoid_` lists.

## Product Purpose

VALoansForVets.com turns Jimmy's YouTube audience into booked Consultations, then into Luminate Bank mortgage applications, with automated guidance in between. Success is a veteran moving through the Customer Lifecycle with less uncertainty at each step, and a funded loan that fits Responsible Homeownership.

Customer Lifecycle and the Conversion Point that moves a person forward (confirmed by the project owner, 2026-09-10):

| Stage transition | Conversion Point |
|---|---|
| Audience Member → Visitor | Clicks a link from content or an ad |
| Visitor → Engaged Lead | Completes the free **Assessment** (fully automated quiz) |
| Engaged Lead → Marketing Qualified Lead | **Books a Consultation** (call) |
| MQL → Sales Qualified Lead | Attends the Consultation; Jimmy records Opportunity or Preparation Needed |
| SQL → Customer | Starts the **Mortgage Application** via the Luminate Bank Apply Link |
| Customer → Advocate | Gives a referral, Review, or Testimonial |

The public site steers a first-time visitor to the **Assessment first**; **Ready Buyers also get a direct booking shortcut** to a Consultation. Confirmed by the project owner, 2026-09-10.

## Positioning

- Jimmy Vercellino is a **U.S. Marine Corps veteran** (Operation Iraqi Freedom) who now originates VA loans; his **VA-loan YouTube channel has over one million views** and is the main reason veterans choose him. A generic lender cannot claim either.
- **Responsible Homeownership**: payment sized to the veteran's budget plus at least three months of reserves, ahead of maximizing the loan amount.
- **Guidance Promise**: step-by-step coaching toward the veteran's Mortgage Goal, in conditional language, without promising eligibility, approval, or a loan result.
- **Nationwide Service** in all 50 states; every veteran is served through this brand even when a non-VA Mortgage Product is the answer.
- Lead Magnet: a three-minute **Assessment** that returns a **Readiness Score (0–100)** and an **Action Plan** within minutes, with no documents required.

## Operating Context

- **Acquisition:** Organic Content (YouTube first; Instagram, Facebook) and Paid Media. First landing page and source are recorded per visitor.
- **Consultation:** 15-minute phone call (video on request) with Jimmy; nobody screens bookings. The current site books through Outlook Bookings; the new site's Scheduling Provider is **Cal.com**.
- **Application:** Luminate Bank's hosted application (current Apply Link: `applynow.goluminate.com/homehub/signup/jimmy.vercellino@goluminate.com`). Starting it ends marketing Nurture. Sensitive financial data stays on Luminate systems.
- **Nurture:** consented email and SMS sequences per Audience Segment; Unsubscribe stops marketing from both VALoansForVets.com and PHXHomeLoan.com. Long-Term Nurture exists for credit readiness and purchase timing.
- **Sister brand:** PHXHomeLoan.com (same team, broader mortgage focus). Origin Brand is kept for attribution; veterans are served through VALoansForVets.com.
- **Stack (decided, confirmed by the project owner, 2026-09-10):** Next.js App Router (`frontend/`, `pnpm dev` on :3000) + Sanity Studio (`studio/`, :3333, project `5s6rmni1`, dataset `production`); **Vercel** hosting; **Clerk** for CRM login; **Neon** PostgreSQL via Drizzle; **Trigger.dev** for automation; **Resend** for transactional email; **Twilio** for SMS; **Cal.com** for scheduling. Email campaign automation (Nurture) is still open: a third-party provider or a system built here. See `docs/deployment.md`, `docs/trigger-setup.md`, `docs/crm-preview-setup.md`. Note: `docs/plivo-account-access.md` predates the Twilio decision.
- **Phase:** hosted test phase. `NEXT_PUBLIC_SITE_ENV` gates `noindex`; the CRM inquiry flow is a test flow (email to an allowlist, simulated SMS). Production launch and client ownership are separate work.
- **Contact details on the current site:** 602-908-5849, toll-free 1-877-505-1281, fax 480-569-1363, 3602 E Campbell Ave, Phoenix, AZ 85018, jimmy@valoansforvets.com. Confirm before reuse.

## Capabilities and Constraints

**State of the codebase (confirmed by the project owner, 2026-09-10):** the public site is an empty slate. Everything under `frontend/app/(main)`, the page-builder blocks, and the Sanity seed content came from the owner's `next-sanity-starter` and is placeholder scaffolding; none of it is product content or an approved presentation, and none of it constrains the redesign. The only real work started is the **`/crm` route**: an internal CRM and sales tool where Jimmy and Team Members log in to manage submissions from every lead source, including website forms (the Assessment, Consultation booking requests). It is in early alpha, a prototype/proof of concept, and its shape is still being ideated.

**This project is a redesign and re-platform of the existing valoansforvets.com.** Three goals, in priority order:
1. **Update the look and feel.** The current site is outdated and resembles Veterans United (veteransunited.com), Jimmy's main competitor, closely enough that customers sometimes think Jimmy belongs to, works for, or is associated with Veterans United. The new design must be unmistakably not Veterans United. This is a binding constraint on every visual decision, owned by new-work/DESIGN.md.
2. **Upgrade the infrastructure** (Next.js + Sanity + Vercel + first-party CRM and automation).
3. **Move hosting to accounts Jimmy controls.**

**Page inventory rule:** the current live site has an established set of pages and slugs (VA Jumbo Loans, VA Home Improvement Loan, VA Loan Eligibility, VA Loan Rates, VA Loan Benefits, VA Loan Process, VA Loan Checklist, Certificate of Eligibility, Cash-Out Refinance, Arizona VA Streamline Refinance, Locations with Arizona/California/Texas, My Story, All About VA Loans video, Blog, FAQs, Mortgage Terms Glossary, Our Videos, Check Your Eligibility, Contact Me, ADA Compliance, Terms). Any change to the number, nature, or slug of pages between the old site and the new one must be intentional and justified in writing (SEO, funnel, or content reason), with redirects for anything that moves. Default is to preserve.

Not built yet: the Assessment (questions, weights, score bands, Action Plans are still an open ask, see `domain-modeling-questions.md` Q6), public Lead Capture Forms, Consultation booking, Nurture Sequences, Apply Link tracking, Review/Testimonial requests, and every public page.

Mortgage Products: VA purchase, IRRRL (streamline refinance), VA cash-out are primary; VA Jumbo and VA home improvement are secondary. Say "Mortgage Product", not loan type/program/option.

Hard rules for copy:
- Never state or imply VA loan eligibility, approval, rates, or a loan result. Readiness Score and Audience membership do not establish eligibility.
- Every Lead Capture Form states what the person receives plus related email and SMS from that brand, and produces a Consent Record.
- Jimmy reviews all VA and eligibility content before publication.
- Nationwide Audience is a marketing focus; it does not state where the team can originate.

**Every evergreen page and state Landing Page from the current site carries over** to keep its search equity. Confirmed by the project owner, 2026-09-10.

Undecided: the new Assessment's final questions and scoring (the old quiz inventory in Basecamp is the starting point, see Evidence on Hand); whether email campaign automation (Nurture Sequences) uses a third-party provider or a system built in this repo.

## Brand Commitments

- Brand: **VALoansForVets.com**, public display name **VA Loans for Vets**. Originator: **The Highly Motivated Vercellino Team**, led by **Jimmy Vercellino**. Lender: **Luminate Bank**.
- **NMLS IDs:** Jimmy Vercellino **184169**; Luminate Bank **1281698**. **Never use 150953** (Luminate Home Loans Inc., a different company). The current live site footer shows 150953; the new site must not copy it. Confirmed by the project owner, 2026-09-09.
- Required on every public page (confirmed by the project owner, 2026-09-10): correct NMLS IDs with an NMLS Consumer Access link; Equal Housing Lender statement/logo; a notice that the site is not affiliated with or endorsed by the VA or any government agency; plus whatever the current site carries (Company Licenses, Privacy Policy, Terms, ADA/accessibility statement, Luminate Bank copyright line). The exact legal wording is Jimmy's/Luminate's to supply; do not invent it. Note: the current site's footer does not visibly show Equal Housing or the VA notice; get approved text before launch.
- Voice: Advisor, not salesperson. Conditional language for anything about eligibility or outcomes. Plain, direct, respectful of military service without pageantry.
- Logos: none in the repo; the site reads light/dark logos from the Sanity `settings` document. Client must supply.
- Current site tagline: "Serving Our Nation's Finest with ALL of their VA Home Loan Financing Needs." Reuse is optional, not binding.
- **Anti-reference: Veterans United** (veteransunited.com). The current site looks too much like it and causes real customer confusion. The new identity must not be mistaken for Veterans United. The old site's look is evidence and anti-reference, never a base to polish. Confirmed by the project owner, 2026-09-10.

## Evidence on Hand

- Jimmy's bio (current site, `/my-story/`): U.S. Marine Corps, Operation Iraqi Freedom, joined at 18, met his wife while stationed at Kaneohe Bay, moved to Phoenix in 2005, licensed instructor with the Arizona Department of Real Estate, family (wife Sylvia, children Sylvia Ann and Christian). Years in lending and awards are **not** published; do not invent them.
- YouTube channel: over one million views (CONTEXT.md). Exact subscriber/view counts must be pulled live before printing.
- Business numbers (`domain-modeling-questions.md`, from the VA Loans Lead Source Audit): 915 lead submissions Jan 2025–Aug 2026; 59.2% YouTube-attributed; **46 loans funded, $23,449,938, Jan 1–Aug 17, 2026**. Usable as internal context; publish only with Jimmy's approval.
- Reviews: the current homepage shows 12+ customer reviews (fast closings of 17–30 days, responsiveness). Google and Zillow Reviews from veteran Customers may be used. None are in this repo yet; all Sanity seed testimonials, team members, and posts are neutral placeholders and must be replaced.
- Existing quiz inventory: the current "Check Your Eligibility" quiz (source `connect.phxhomeloan.com`, inspected 2026-09-09) is transcribed question by question, with options and branch notes, in Basecamp: https://app.basecamp.com/6230954/buckets/48575281/documents/10286280158 (project 48575281, account 6230954). It is a text inventory of the old quiz (purchase and refinance paths, 17 purchase steps: city, budget, home type, occupancy, timeline, current ownership, rent, lease end, first-time buyer, credit range, marital status, and more), not the new Assessment's scoring. Use it as the starting point for Assessment content; the new Assessment also needs service history and state per CONTEXT.md.
- Absent: partner logos, press, case studies, real team bios, Assessment scoring (weights, score bands, Action Plans). Do not fabricate.

## Product Principles

1. **One next step per surface.** Each Landing Page has one Conversion Point; the Assessment is the default first step and Ready Buyers get a booking shortcut.
2. **Reduce uncertainty, never promise outcomes.** Teach how VA loans work and what to prepare; keep eligibility and approval language conditional.
3. **Jimmy is the reason they came.** Lead with his service, his channel, and his voice; the team and lender support that trust.
4. **Responsible Homeownership over loan size.** Guidance and tools favor the budget and reserves the veteran can sustain.
5. **Every veteran, every state, one brand.** Serve the veteran through VALoansForVets.com regardless of Origin Brand or Mortgage Product.
6. **Unmistakably Jimmy, never Veterans United.** If a veteran could confuse the new site with Veterans United, the design has failed, whatever else it does well.

## Accessibility & Inclusion

Target **WCAG 2.2 AA** (confirmed by the project owner, 2026-09-10). The current site publishes a WCAG 2.1 AA statement with an accessibility contact (602-908-5849, jimmy@valoansforvets.com); the new site carries an equivalent statement. Many veterans live with visual, motor, cognitive, or hearing disabilities and some with PTSD-related sensitivities: honor reduced motion, avoid flashing content, keep forms keyboard-complete, and make the Assessment usable by screen reader.
