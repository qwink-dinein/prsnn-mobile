# What the new mock-ups missed (audit against the current app, 2026-11-14)

Source: every file in `src/app` and the shared components (`bookings.tsx`, `PanicButton.tsx`,
`companions.tsx`, `IdentityForm.tsx`, `fellow/*`, `admin.tsx`). "Mock" = `preview/all-screens.html`.

## Wrong or changed behaviour (must fix)

| # | Screen | Current app | Mock got wrong |
|---|---|---|---|
| 1 | Setup · who to meet | 4 options: Women, Men, Non-binary, **Anyone** (“All companions are shown to you”) | Only 3; “Anyone/Everyone” missing |
| 2 | Setup steps | 7–8 steps: name → mobile + country (email sign-ups only) → where → what for → **I am** → who to meet → photo → **who can see your photo** | Showed 5; missing *mobile + country*, *I am*, *photo visibility*; order wrong (where was last) |
| 3 | Book a time | One screen: **choose length first (price cards) → day → start time**; button “Continue · ₹1,299” | Split into two screens in the wrong order (time, then length) |
| 4 | Booking details | Has the **panic button** (3 states: “turns on at 4:00 PM” before start; hold-3s SOS during; red “alert active” banner) | Panic button missing; I drew it as a separate screen |
| 5 | Review & pay · who for | **Me / Someone else**, then Mother, Father, Grandparent, Relative, Friend, Other (+ “Who are they to you?”) | Me / Parent / Friend / Other |
| 6 | Review & pay | “**How it works**” (4 steps: you pay now; 15 min–5 h to accept; up to 2 similar companions; refund 1 h before), **cancellation & refunds from the server + support email**, agree text “my booking may go to a similar companion”, button “Continue to pay ₹X” | All missing or reworded |
| 7 | Payment | **4 methods with hints**: UPI (GPay, PhonePe, Paytm), Card (Visa, Mastercard, RuPay), Net banking, **Wallets**; pay-by deadline; test checkout sheet | 3 methods, no hints, no deadline |
| 8 | Login | Consent line: “you agree to get **login codes and booking updates on WhatsApp**” (Meta opt-in) | Dropped |
| 9 | Chat | No panic icon in the header | I added one (not a real feature; remove or decide) |

## Missing states and content

**Get started**
- Splash: photo collage and “Real people. Real moments.”
- Login: **Reset your PIN** mode; “session ended, confirm with a code” notice; errors.
- Code: 30 s resend timer; email version (“check spam”); “new code sent” notices.
- PIN: **Confirm your PIN** step; “Choose a new PIN” (reset); weak-PIN and mismatch errors; “Enter your PIN · For +91…”.
- Setup: “Next · 2 chosen”; “We kept your answers from last time”; photo tip “You choose who sees it on the next step”; visibility options with icons, body text and “· recommended”.

**Member**
- Home: **area chip** (📍 Gachibowli ⌄) in the header; unread count on the bell; banner “Good company, from ₹399 · people near you, pay safely, public places only”; **photo pending / changes requested notice with Fix**; category cards show “from ₹X”; **Safety, built in** card; empty state “Companions are joining your city”; pull to refresh.
- Search: **city sheet**, **Area panel**, **Sort** (recommended…), “Showing women” chip → Privacy, **result count**, empty state with **Clear filters**.
- Category: **check-list of what it’s for**, **Suggested hours · price · /hr · save %**, “Popular in {city}” plans, “People in {city} who offer this”, “no one in {city} yet, here’s elsewhere”, empty state with other categories.
- Companion profile: **locked photo** state and lock note; **New on prsnn** explanation (ID checked before you meet, else another companion or full refund); category tag cards + interest pills; days list + hours; footer **“From ₹399 for 1 hour · longer costs less per hour”**; “This is you”.
- Book a time: weekday header, crossed-out unavailable days, 60 days ahead, “4:00 PM – 8:00 PM · sessions run 7 AM–10 PM”, “No 4-hour slot fits that day…”.
- Review & pay: companion card; date/time card; **What’s it for?** chips; note “Companionship only — no medical or care services”; price line with ₹/hour.
- Booked: **three outcomes** — Payment received (waiting), **Booking confirmed!** with **Chat with Maya**, **No companion available** (refunded).
- Bookings: title “My bookings”; booking card **status pill** (10 stages: Awaiting confirmation, Accepted · pay to confirm, Payment not finished, Paid · awaiting companion, Accepted · safety check, No companion · refunded, Confirmed, Completed, Declined, Cancelled), **Pay / Finish payment** button, View + Chat; empty states.
- Booking details: status pill; meeting place, **who it’s for + their number**, category; **status timeline** (Booked, Paid, Finding your companion · “offered to companion 2 of 3 · 40 min left”, Safety check of ID, Confirmed); problem-reported card; your note; Pay button; cancel confirm with refund amount; “Problem reported · add details”.
- Panic (alert screen): pulsing SOS, “raised at 4:35 PM · our team has been told (raised by …)”, **sent N times**, what was shared (both names and numbers, meeting place), **PIN sheet to stop**, “Alert closed” state.
- Report: **six reasons** (didn’t show up, safety or behaviour, ended early, charged incorrectly, refund not received, something else); “Thanks — we’ve got it”.
- Messages: empty state text for members and companions.
- Notifications: **All / Bookings / Payments** filter; Clear all (confirm); **Action needed** cards (Fix and resubmit / Update my profile); panic alerts pinned first in red; empty state.

**Profile**
- Profile: **Verified member / status pill**; staff see **Admin**; companions see **Companion dashboard, Earnings, ID check**; “Set a PIN” when none; privacy row value “Photo open · Showing women”; Log out confirm.
- Personal information: **What you’re interested in** (category tiles; companions: What you offer); mobile read-only; Saved / error notices.
- Privacy: **Show me as chips incl. Everyone**; visibility with icons and “· default”; **consent line**; companions don’t see “Show me”; city & area pickers.
- Fix: photo and **profile** versions (companions: About + What you offer); our team’s exact note; tips; **Sent for review** screen.
- Delete: “What happens” paragraph; confirm dialog.
- Saved: empty state with Browse companions.

**Companion**
- Become a companion: today’s copy says “**Set your own hourly rate**” and “**Every member is ID-verified**” — both untrue now (fixed prices; members aren’t ID-checked). Mock replaced them; needs your OK.
- Onboarding has **9 steps**: I am → photo → **who can see it** → **where** → **about you (30+ chars, counter) + interests & languages** → offers → **durations (price cards with “You get”)** → days & hours → **summary (Based in / Offers / Durations) + ID-later notice + Code of Conduct**. Mock showed 3.
- My status: **five states** (finish profile, in review, changes requested with note, not approved + Contact support, live) and the ID sub-states (live, ID in progress, verified, needs another look) with **Verify my ID now / Send a new ID**.
- Dashboard: **approval banner** and **ID banner** states; stats **Sessions · Earnings · Pending**; **Waiting for your answer** list; rows **Upcoming bookings, Earnings, Edit profile, Packages & availability**; **Share your profile**.
- Request card states: **Paid offer · 40 min left**, Held · ID check, Confirmed · paid, You declined, Taken by someone else, Offer expired; member’s note; **Verify ID & accept**; Decline confirm (“we’ll offer it to another companion”); **Mark completed** after the start; Chat, Details.
- Verify ID: **why-first screen** (encrypted, only our safety team sees it, never the member) with **Choose an ID / Not now**; ID types with which sides are needed; Aadhaar note; **Checking your ID / ID sent** screens with steps.
- Packages & availability: days as chips, **From / Until time chips**.
- Earnings: “Questions? Contact support.”

**Admin**
- Overview: “Signed in as …” note; **Refunds to decide** tile (failed count); **ID checks** row; menu rows depend on role (sub-admins don’t see Sub-admins, Prices, Broadcast, Activity).
- Approvals: Photos tab content; **Ask for changes sheet** (reasons + note).
- Review profile: reject with reason; next in queue.
- Verify: **held bookings pill · decide by…**, interests, ID type, gender, hours, missing documents.
- Bookings: empty states per tab.
- Booking: status + **App/Website** pills; Member/Companion links; place, note, price, payment, **payout split**, refund, refund review, cancelled by, **offers list**; **dispute section with chat**; superadmin **Refund (up to ₹X)** and **Delete booking**.
- Disputes: replies count pill.
- Panic alert: resolve **with a note**; “Alert resolved” state.
- Users: role filter chips incl. Staff; empty state hint.
- User: photo visibility, packages offered, available days, **from/until**, About, **Restore account**, **Remove sub-admin**, **Recent bookings**.
- Sub-admins: what sub-admins can and can’t do; add-by-phone sheet.
- Prices: all 12 packages, **headline packages**, companion % hint, **timing (day start/end, offer windows)**, save confirm.
- City plans: add/edit form (city, title, details, category, hours), edit/remove icons.
- Broadcast: device counts on the button, **character counters**, **Sent before** list, send confirm.

**Everywhere**
- Loading, error (Try again), empty, **offline banner**, **slow network**, **drafts kept after session expiry**, inline validation, success screens (the 10-state checklist).
- Locked photo placeholder wherever a locked person appears (cards, rows, avatars).
- Test-payment sheet (simulated) and Razorpay sheet.
- Not-found screen.
