# prsnn · Legal and compliance checklist

What Indian law and the app stores ask of prsnn, where each item lives, and what is still
waiting on the owner. "Done" means it is built or published in the repos; "Owner" means only the
business owner can do it (registration, a contract, a filing). This is a working checklist, not
legal advice: have a lawyer and a CA read the policies and the Owner items before launch.

Public policy pages (website, one source in `prsnn-frontend/app/(site)/_lib/legal.jsx`):
`/terms` · `/privacy` · `/refunds` · `/guidelines` · `/companion-terms` · `/grievance` ·
`/child-safety` · `/cookies` · `/delete-account` · `/safety` · `/legal` (all of them).
The app links to these pages (`src/lib/config.ts` → `LINKS`), so the app and site always show the same text.

## 1. Information Technology Act, 2000 and IT (Intermediary Guidelines) Rules, 2021

| Requirement | Status | Where |
|---|---|---|
| Publish terms, privacy policy and user agreement | Done | `/terms`, `/privacy` |
| Tell users what they must not host or share (Rule 3(1)(b)) | Done | `/terms` §5A |
| Remove unlawful content on court or government order | Done (process) | `/terms` §5A, `/grievance` |
| Grievance Officer: name and contact published | Done | `/grievance` + `/support` (name: founder; the email is shown on `/support` after a tap, from `NEXT_PUBLIC_SUPPORT_EMAIL`) |
| Acknowledge complaints in 24 h, resolve in 15 days | Done (process) | `/grievance`; Admin → Disputes |
| Act within 24 h on intimate-image or impersonation complaints | Done (process) | `/grievance` |
| Keep records after removal (180 days) and user data as law requires | Done (policy) | `/delete-account`, deletion keeps a minimal record |
| Report cyber incidents to CERT-In within 6 hours | **Owner** | Name who reports; keep logs (Supabase logs) for 180 days |

## 2. Digital Personal Data Protection Act, 2023 (and Rules)

| Requirement | Status | Where |
|---|---|---|
| Clear notice: what, why, who it's shared with, rights | Done | `/privacy` |
| Consent and how to withdraw it | Done | `/privacy` (Consent), account deletion in app |
| Rights: access, correction, erasure, nomination, grievance | Done | `/privacy` (Your rights), `/grievance` |
| Erase data when the purpose ends; keep only what law needs | Done | `delete_my_account()` RPC; `/delete-account` retention list |
| Reasonable security safeguards | Done | RLS on every table, private storage for IDs, staff actions logged |
| Children: no data from under-18s | Done | Sign-in screens: "you confirm you’re 18 or older"; companions' ID age-checked; `/child-safety` |
| Data breach notice to the Board and affected users | **Owner** | Keep an incident contact; the process is in this file |
| Website error monitoring without personal data | Done | Sentry: `sendDefaultPii: false`, replay only on error, all text masked |

## 3. Consumer Protection Act, 2019 and (E-Commerce) Rules, 2020

| Requirement | Status | Where |
|---|---|---|
| Legal name, address and contact of the platform | Partly | "prsnn, Hyderabad". **Owner:** add the registered legal entity name and full address once incorporated |
| Grievance Officer with name and contact | Done | `/grievance` |
| Clear price before payment, no hidden fees | Done | Price on every card; review screen before paying; "no booking fee" |
| Cancellation, refund and return policy shown before purchase | Done | `/refunds`; app review screen shows the policy and needs a tick |
| No fake reviews or manipulated ratings | Done | The app shows no ratings (Tasks.md: add only real ones) |
| Seller (companion) details available to the buyer | Done | Companion name, photo, ID-checked badge shown after confirmation |
| Refunds processed promptly | Done | Automatic full refund when nobody accepts; 5–7 working days |

## 4. Payments and tax

| Item | Status | Notes |
|---|---|---|
| Payments only through an RBI-authorised aggregator | **Owner** | Payments run in **test mode** (`payment_mode = simulated`; no money moves). Before launch: Razorpay KYC → keys as Supabase secrets → switch `payment_mode` |
| GST registration (platform fee) | **Owner** | Needed once turnover crosses the threshold, or earlier if an e-commerce operator must register; ask a CA |
| TCS under GST (section 52) for e-commerce operators | **Owner** | Ask a CA whether it applies to companions' services |
| TDS under Income-tax Act section 194-O on payouts | **Owner** | Deduct TDS (0.1% since 1 Oct 2024) where it applies; confirm with a CA; issue certificates. Mentioned in `/companion-terms` |
| Companion payouts | **Owner** | Payout rail (Razorpay Route / RazorpayX) not built yet (Tasks.md) |

## 5. Business registrations

| Item | Status |
|---|---|
| Company or LLP incorporation, PAN, TAN | **Owner** |
| Telangana Shops and Establishments registration | **Owner** |
| Trademark for "prsnn" (class 45 and 9) | **Owner** (recommended) |
| Domain and business email (the site and app assume `prsnn.com`) | **Owner**: confirm the domain, then set `NEXT_PUBLIC_SITE_URL` / `EXPO_PUBLIC_SITE_URL` |

## 6. Safety

| Item | Status | Where |
|---|---|---|
| Platonic only; public places; home visits only for loved ones | Done | Database check `bookings_home_visit_loved_one`; `/guidelines` |
| Companion ID check before first booking | Done | `id_check` allocation state |
| Panic button → every admin by push + WhatsApp, repeating every 5 min | Done | `raise_panic`, `notify` edge function, template `WAPLIFY_TPL_PANIC_ALERT` (approved; secret set) |
| Phone numbers hidden in chat | Done | Masking trigger on `messages` |
| Child safety standards published (Google Play requirement) | Done | `/child-safety` |
| A named staff rota to answer panic alerts 24×7 | **Owner** | Add every responder as an admin with a WhatsApp number |

## 7. App stores

See `STORE_SUBMISSION.md` for the Data safety form, App Privacy labels, age rating answers and review notes.
