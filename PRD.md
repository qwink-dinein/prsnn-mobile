# prsnn mobile — Product Requirements

**prsnn.** Good company, on your terms.
A native iOS and Android app for finding and booking verified companions in
Hyderabad for coffee, walks, events, study and more. It is built on the
existing prsnn backend (`qwink-dinein/prsnn-backend`) and keeps every core
feature of the web app (`qwink-dinein/prsnn-frontend`).

## Who it's for

| Person | Wants | Core job in the app |
|---|---|---|
| **Member** (role `user`) | Company for an activity without going alone | Find → request → pay → chat → meet |
| **Companion** (role `companion`) | Earn by spending time with people, on their own terms | Onboard → get verified → accept requests → chat → get paid |
| **Admin / super admin** | Keep the platform safe | Stay on the **web** admin dashboard (mock-up 22). Not in the app. |

## Core features (must match the web app)

1. **Accounts.** Phone + OTP on WhatsApp (new), a 4-digit PIN for quick
   login (new), and email + password for existing web accounts.
2. **Discover and search** verified companions by name, area, activity
   (tags) and duration.
3. **Companion profile** with bio, activities, available days and hours,
   and the durations they offer (prices are fixed, see Pricing).
4. **Booking** for a date, start time (inside the companion's hours)
   and package (1–12 whole hours, between 7 AM and 10 PM). The companion **accepts or declines**:
   in the app, after the customer has paid (prepaid, below); on the website,
   before payment.
5. **Payment** through Razorpay (simulated until it's switched on). The server
   verifies the signature or webhook, the order, the capture and the amount.
6. **Chat** per booking over Socket.io. It opens once the booking is confirmed
   and paid. Phone numbers are masked by the server.
7. **Notifications** for booking requests, acceptances and payments.
8. **Companion onboarding** with ID front and back, photo, bio, tags, the
   durations they offer, days and hours, then **admin verification**.
9. **Companion dashboard and earnings** from paid sessions (80% of each booking).
10. **Profile**: edit details, saved companions, PIN, help, legal, log out,
    and **delete account** (an App Store and Play requirement).

## Pricing (owner decision 2026-11-09)

Every companion uses the **same price list**, built on a **₹399 base for one hour**.
Companions cannot set their own rate; they only choose **which durations they offer**.
Longer bookings cost less per hour.

| Package | Price | Per hour | Customer saves | Companion receives (80%) |
|---|---|---|---|---|
| 1 hour | ₹399 | ₹399 | — | ₹319 |
| 2 hours | ₹699 | ₹350 | ₹99 | ₹559 |
| 3 hours | ₹999 | ₹333 | ₹198 | ₹799 |
| **4 hours** (popular) | ₹1,299 | ₹325 | ₹297 | ₹1,039 |
| 5 hours | ₹1,599 | ₹320 | ₹396 | ₹1,279 |
| 6 hours | ₹1,899 | ₹317 | ₹495 | ₹1,519 |
| 7 hours | ₹2,199 | ₹314 | ₹594 | ₹1,759 |
| 8 hours | ₹2,499 | ₹312 | ₹693 | ₹1,999 |
| 9 hours | ₹2,799 | ₹311 | ₹792 | ₹2,239 |
| 10 hours | ₹3,099 | ₹310 | ₹891 | ₹2,479 |
| 11 hours | ₹3,349 | ₹304 | ₹1,040 | ₹2,679 |
| 12 hours | ₹3,599 | ₹300 | ₹1,189 | ₹2,879 |

- Customers see the headline cards **1, 2, 4, 6 and 12 hours** (or whichever of these the
  companion offers). Companions may switch on any duration from 1 to 12 hours, and see
  "You get ₹X" on every card.
- **prsnn.'s share is 20%** of the booking price; the companion receives **80%**
  (rounded down to the rupee). There is no separate booking fee.
- Bookings start **no earlier than 7:00 AM** and **finish by 10:00 PM**, and need about
  90 minutes' notice so a companion can be confirmed.
- One price list lives in `src/domain/pricing.ts` (app) and `src/utils/pricing.js`
  (backend); a test fails if they drift apart.

## Booking and payment (prepaid, owner decision 2026-11-09)

The app no longer makes customers wait for acceptance before paying, because that led
to abandoned bookings. Customers **pick a companion and a package, see the price, the
cancellation and refund terms, agree, and pay**. Payment does not guarantee the booking
until a companion accepts. The booking then shows **“Paid — awaiting companion”**.

The chosen companion is offered the booking first. If they decline or don't answer, it
is offered, **one at a time**, to up to **2 similar companions** (same city, the
customer's gender preference, free at that time, offering that duration). The first to
accept is assigned in one atomic backend operation.

**How long each companion has to accept** scales with the notice the customer gave: the
time until one hour before the session is shared equally across the three possible
offers, and each window is kept between a **minimum of 15 minutes** and a **maximum of
5 hours**. If nobody has accepted by **1 hour before the session**, the booking is
cancelled and **fully refunded** automatically. See API.md for the state machine.

**When a backup companion takes the booking.** The customer always pays exactly the
price shown at checkout, whoever accepts, and the companion who accepts receives their
usual 80% for that package. Should any difference ever arise between what was paid and
what is owed for the companion who accepts, it is retained by prsnn. and goes towards
the matching, safety and support work that makes a reassignment possible. It is neither
added to the companion's payout nor returned to the customer, and the customer is
never charged more than the price they agreed to.

### Cancellations and refunds

| Who cancels | When | Customer refund | Retained by prsnn. |
|---|---|---|---|
| Customer | 15 minutes or more before the start | **85%** | 15% cancellation fee |
| Customer | Less than 15 minutes before the start, or after it starts | None | 100% |
| Companion (after confirming) | Any time | **100%** | None |
| Nobody accepts in time | Automatically, 1 h before the start | **100%** | None |

The 15% fee covers the payment, matching and the companion time that was held for the
booking. Refunds go back to the original payment method.

Acceptance criteria (all covered by backend tests):
- A retried create or payment never makes a second booking or charge (idempotency key, atomic mark-paid).
- Only one companion can be assigned. An expired offer cannot be accepted.
- A failed allocation triggers a full refund, claimed once and retried on provider errors.
- Customers see booking status and payment status separately (timeline + payment line).
- Cancelling follows the table above. “Report a problem” works on any paid booking and
  reaches support at mukarramjahmm@gmail.com.

The website keeps its original request → accept → pay flow on the same backend, with the
same package prices.

## Privacy, gender and location

- Everyone chooses **I am** (woman / man / non-binary) and **Show me** (women / men /
  non-binary people / everyone). Listings are filtered **on the server** by Show me.
- **Profile lock.** Default: men **Open**; women and non-binary people **Locked**. Each
  person picks Open or Locked during setup; tapping the choice is their consent (time stored). A locked profile
  shows a static blurred placeholder with a lock and the first name only. The photo unlocks
  only for someone with a confirmed, paid booking with them.
- **Locations.** All 4,300+ Indian cities by state, plus area lists for the major metros
  (typed elsewhere). Used in onboarding, companion registration and the Search filters.
- **Brand.** The wordmark is italic serif **“prsnn.”** with the clay full stop, everywhere in the app.
- **Onboarding by tap.** Choosing a role, gender, “show me”, visibility, city and area
  each moves straight to the next step; there are no Confirm buttons.

## Non-goals for v1

- In-app admin tools (they stay on the web).
- Ratings and reviews, wallet, refer-and-earn, payouts setup. The mock-ups
  show these, but the backend has no data for them, so v1 hides them rather
  than showing fake numbers. See Phases.md.
- Google and Apple sign-in. These need OAuth client IDs, and Apple requires
  "Sign in with Apple" whenever Google is offered.
- Dark mode. The brand is light cream. `userInterfaceStyle` is `light`.

## Success measures

- A new member completes OTP → profile → first request in under 2 minutes.
- More than 95% of payments verify on the first try. Verification failures
  show the booking reference and never claim that no money moved.
- Zero phone numbers shown in chat. The server masks them, so no client can
  bypass it.

## Safety rules the app must keep

- Public places only (shown on profile, review and chat screens).
- Companions are bookable only when `verificationStatus === 'verified'`.
- No client-side shortcut to verification. The backend refuses companions on
  `onboard-basic`.
- Tokens live in the Keychain or Keystore (`expo-secure-store`). They are
  never written to logs.
