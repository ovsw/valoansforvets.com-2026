# Plivo account access and US mortgage SMS

Checked against official Plivo sources on 2026-09-09. No account settings were changed.

## Findings

- **Do not use a VPN to complete signup.** Plivo's [account management documentation](https://plivo.com/docs/faq/account/account-management) explicitly requires “No VPN during onboarding.” It also requires a work email and phone verification. It directs delayed applicants to support.
- **Romania eligibility is not established.** The reviewed sources do not identify a Romania signup ban. Destination coverage is not evidence of account eligibility. Only Plivo can explain this particular regional rejection or approve a Romanian developer's access.
- **Client ownership is a suitable proposed arrangement, subject to access approval.** Plivo supports an account owner and invited developers. The owner is the account creator; the docs say ownership cannot be changed. A developer can configure applications, use API credentials, and read logs without billing access. Have the US client own their business account rather than use inaccurate location or identity information.
- **Invitations are not a guaranteed workaround.** The [RBAC support page](https://support.plivo.com/hc/en-us/articles/360041828611-Does-Plivo-offer-role-based-access-control) says new invitees must create an account and advises against proxies when inviting users. It also says RBAC requires an annual contract with monthly committed spend starting at $750. The newer account documentation lists roles without this condition. Confirm current plan eligibility and Romanian member access with support before relying on team invitations.
- **A permanent development VPN is not a normal application requirement.** API credentials authenticate server requests; production requests come from the hosted application. The account docs describe optional API IP allowlists. This does not establish whether Plivo currently permits Romanian-origin API calls or console sessions. Ask support to confirm both. Local UI work and simulated SMS do not require a provider connection.

## Mortgage messaging needs a specific answer

Do not treat all mortgage messages as prohibited, or assume all direct inquiry replies are approved.

- The [general US messaging guidance](https://plivo.com/docs/messaging/concepts/us-messaging-best-practices) prohibits third-party mortgage loan offers, third-party lead generation, and real estate. It directs uncertain use cases to support.
- The [campaign rejection guide](https://support.plivo.com/hc/en-us/articles/24760935120665-Why-was-my-campaign-registration-declined-and-how-can-I-fix-it) distinguishes prohibited third-party mortgage offers (1001) from direct lending campaigns missing the “Direct lending or loan arrangement” attribute (1003). Thus the sources do not support a blanket claim that all direct lending is banned.
- The [ISV-specific policy](https://www.plivo.com/docs/faq/messaging/isv-guidelines) is broader: its prohibited financial examples include “Mortgage, loans, credit repair, debt collection.” It says no campaign or toll-free verification will be supported for those categories. This policy applies to ISVs providing messaging services to other businesses. Do not automatically apply it to a direct client-owned account with a hired developer, or assume that arrangement is exempt without confirmation.
- [US 10DLC registration](https://docs.plivo.com/docs/messaging/a2p-10dlc/registration-guidelines) requires a brand and campaign before A2P SMS over US long-code numbers. Use the client's legal business identity and actual message purpose. Disclose consent flow, sender, frequency, costs, HELP/STOP, terms, and privacy policy. A form submission alone must not be assumed to include SMS consent.

## Questions for Plivo support

1. Can a US business own the account and invite its Romania-based developer, using their real details and normal Romanian connection?
2. Are console login and development API calls from Romania supported? What caused the regional signup rejection?
3. Which plan supports a separate developer login, and does the documented $750 monthly commitment still apply?
4. Is a client-owned mortgage business allowed to send consented inquiry receipts and appointment reminders to people who contact that same business, without selling or sharing leads? Does the business's lender or broker status change eligibility? Which campaign attributes are required?

Recommendation: resolve these questions before choosing Plivo or paying for messaging. The evidence supports avoiding VPN onboarding; it does not establish a Romania-wide ban or approval for this exact mortgage workflow.

## Twilio comparison

- Twilio's [trial documentation](https://www.twilio.com/docs/usage/trials) lists Romania as supported. Trial destination limits follow the verified signup phone country; this does not explain an individual signup rejection or guarantee account approval.
- Twilio supports [external users](https://www.twilio.com/docs/iam/organizations/managed-users), including contractors on specific accounts. A client-owned account with separate developer access is therefore a supported account pattern, subject to account eligibility.
- Twilio's [forbidden messaging categories](https://help.twilio.com/hc/en-us/articles/360045004974-Forbidden-Message-Categories-in-the-US-and-Canada-Short-Code-Toll-Free-and-Long-Code) include new loan solicitation and third-party loans. It defines third-party as someone other than the loan servicer and includes mortgage loans as an example. First-party loan content is acceptable when non-promotional, with a separate approved-short-code exception. Do not assume a mortgage originator meets that definition. Disclose the client's lender, originator, and servicing roles and actual message samples before relying on either provider.
