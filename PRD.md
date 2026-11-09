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
   (tags) and price.
3. **Companion profile** with bio, activities, available days and hours,
   and hourly rate.
4. **Booking** for a date, start time (inside the companion's hours)
   and duration (30 min to 4 h). The companion **accepts or declines**:
   in the app, after the customer has paid (prepaid, below); on the website,
   before payment.
5. **Payment** through Razorpay (simulated until it's switched on). The server
   verifies the signature or webhook, the order, the capture and the amount.
6. **Chat** per booking over Socket.io. It opens once the booking is confirmed
   and paid. Phone numbers are masked by the server.
7. **Notifications** for booking requests, acceptances and payments.
8. **Companion onboarding** with ID front and back, photo, bio, tags, rate,
   days and hours, then **admin verification**.
9. **Companion dashboard and earnings** from paid sessions.
10. **Profile**: edit details, saved companions, PIN, help, legal, log out,
    and **delete account** (an App Store and Play requirement).

## Booking and payment (prepaid, owner decision 2026-11-09)

The app no longer makes customers wait for acceptance before paying, because that led
to abandoned bookings. Customers **pick a companion, see the price, fees (none) and the
cancellation and refund terms, agree, and pay**. The booking then shows **“Paid — awaiting
companion”**. The chosen companion gets **15 minutes** to accept. If they decline or
don't answer, the booking is offered, **one at a time**, to up to **2 similar companions**
(same city, the customer's gender preference, free at that time, same or lower rate). The
first to accept is assigned in one atomic backend operation. If nobody accepts by
**min(2 h after payment, 1 h before the session)**, the booking is cancelled and **fully
refunded** automatically. See API.md for the state machine.

Acceptance criteria (all covered by backend tests):
- A retried create or payment never makes a second booking or charge (idempotency key, atomic mark-paid).
- Only one companion can be assigned. An expired offer cannot be accepted.
- A failed allocation triggers a full refund, claimed once and retried on provider errors.
- Customers see booking status and payment status separately (timeline + payment line).
- Cancelling follows the published refund policy (full refund before the start). “Report a problem” works on any paid booking.

The website keeps its original request → accept → pay flow on the same backend.

## Privacy, gender and location

- Everyone chooses **I am** (woman / man / non-binary) and **Show me** (women / men /
  non-binary people / everyone). Listings are filtered **on the server** by Show me.
- **Profile lock.** Default: men **Open**; women and non-binary people **Locked**. Each
  person confirms their choice with an explicit consent tick (time stored). A locked profile
  shows a static blurred placeholder with a lock and the first name only. The photo unlocks
  only for someone with a confirmed, paid booking with them.
- **Locations.** All 4,300+ Indian cities by state, plus area lists for the major metros
  (typed elsewhere). Used in onboarding, companion registration and the Search filters.
- **Brand.** The wordmark is italic serif **“person.”** with the clay full stop, everywhere in the app.

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
