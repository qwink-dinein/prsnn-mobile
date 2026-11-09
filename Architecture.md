# prsnn mobile — Architecture

## System

```mermaid
flowchart LR
  subgraph Phone["prsnn app (Expo · React Native)"]
    UI["Screens<br/>src/app (expo-router)"] --> Q["React Query<br/>cache + retries"]
    Q --> SVC["services/index.ts<br/>svc = backend | demo"]
    UI --> SES["state/session.ts<br/>Zustand"]
    SES --> SS[("SecureStore<br/>JWT")]
    SES --> AS[("AsyncStorage<br/>prefs, saved")]
    UI --> CHAT["lib/chat.ts<br/>Supabase Realtime"]
    UI --> RZ["RazorpaySheet<br/>WebView checkout.js"]
  end
  SVC -- "RPC + Storage (Supabase JWT)" --> BE["Supabase (Mumbai)<br/>Postgres functions + RLS"]
  CHAT -- "Realtime (RLS)" --> BE
  RZ -- "card / UPI" --> RP["Razorpay"]
  BE --> DB[("Postgres<br/>pg_cron sweeper")]
  BE --> CL["Storage<br/>avatars (public), verification (private)"]
  BE --> WA["Waplify<br/>WhatsApp OTP"]
  BE --> SMS["MSG91<br/>SMS backup"]
  BE --> RS["Resend<br/>email OTP"]
  BE -- "verify signature + amount" --> RP
  WEB["prsnn-frontend<br/>Next.js web + admin"] --> BE
```

The app and the website share **one backend and one database**. Anything
the app needs that the backend didn't have was added to the backend; it was
not faked on the client.

## Folders

```
src/
  app/                 expo-router routes (one file per screen, see design.md)
    (tabs)/            home · search · bookings · messages · profile
    book/ pay/ chat/ booking/ companion/ fellow/
  components/
    ui/                Text, Button, Icon (inline SVG), layout, forms
    companions.tsx     CompanionCard, CompanionRow, HeartButton
    bookings.tsx       BookingCard, stage labels, date formatting
    fellow/            Dashboard, RequestCard, AvailabilityEditor
    RazorpaySheet.tsx  Checkout in a WebView (native) / script (web)
  domain/              PURE logic, unit-tested: pricing, slots, stages, search, phone
  services/            backend.ts (REST), demo.ts (sample data), index.ts (svc + query keys)
  lib/                 supabase client, config, chat (Realtime), local PIN, flows, storage, image picker
  state/session.ts     token, user, prefs (Zustand)
  theme/               tokens.ts (palette), fonts.ts (type scale)
__tests__/             Jest (jest-expo) tests for src/domain
```

**Rule:** screens never call `fetch`. They call `svc.*` through React Query
with keys from `qk`. Business rules (prices, availability, booking stages)
live in `src/domain` and are tested there.

## Auth flow

```mermaid
sequenceDiagram
  participant A as App
  participant B as Backend
  participant W as Waplify (WhatsApp)
  A->>B: POST /auth/phone/send-otp {phone}
  B->>W: template message with 6-digit code
  W-->>A: WhatsApp message (SMS via MSG91 if WhatsApp fails)
  A->>B: POST /auth/phone/verify-otp {phone, otp, role}
  B-->>A: {token, user, isNewUser}
  A->>A: SecureStore.set(token)
  alt new account
    A->>B: PUT /profile/update {fullName, city, area, photo}
  end
  A->>B: POST /auth/pin/set {pin}
  Note over A,B: Next time: POST /auth/pin/login {phone, pin}
```

Existing web accounts use `POST /auth/login` (email or username + password)
and `POST /auth/verify-email` when the email isn't verified yet.

A `401` from any call signs the person out and returns to `/login`
(`setUnauthorizedHandler` in `_layout.tsx`).

## Booking and payment flow

```mermaid
sequenceDiagram
  participant M as Member app
  participant B as Backend
  participant C as Companion app
  participant R as Razorpay
  M->>B: POST /bookings/request
  B-->>C: Notification booking_request
  C->>B: PUT /bookings/:id/status {accepted}
  B-->>M: Notification booking_accepted
  M->>B: POST /payments/create-intent {bookingId}
  B-->>M: {orderId, amount, keyId}
  M->>R: Checkout (WebView)
  R-->>M: {payment_id, order_id, signature}
  M->>B: POST /payments/verify-payment
  B->>R: fetch payment (captured? amount?)
  B-->>M: booking.paymentStatus = paid
  M-)B: insert into messages (Realtime pushes it to both)
  B-)C: receive_message (numbers masked)
```

`domain/booking.ts → amountDuePaise()` uses the exact formula of the
backend's `amountDueInPaise()`, so the price shown is the price charged.

## Why these choices

| Choice | Reason |
|---|---|
| Expo 58 + expo-router + RN 0.88 | Same stack as Hyderabad Rishta: one toolchain, EAS builds, OTA updates |
| React Query + Zustand | Server cache vs. small local session state; same as the sister app |
| Razorpay in a WebView, not `react-native-razorpay` | Works in Expo Go and on web, no native module; the server still verifies everything |
| Inline SVG icons | No icon-font download; identical on iOS, Android and web |
| Client-side search over the verified list | The list is ≤100 and cached; filters feel instant and work offline. Move to `/companions/search/:q` past ~500 companions |
| Saved companions on device | The backend has no favourites; adding an endpoint is P2 |
| Demo mode (`EXPO_PUBLIC_DEMO=1`) | Design review, screenshots and store previews without touching real data |

## Environment

| Variable | Default |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | `https://mhovyhapzhxcmcuelbol.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_KEY` | the project's **publishable** key (safe to ship; never the secret/service key) |
| `EXPO_PUBLIC_DEMO` | `0` |

## Backend changes this app depends on

These are on branch `claude/quirky-ramanujan-k68143` of `prsnn-backend`.
See API.md.

1. Phone OTP (Waplify / MSG91) and PIN endpoints.
2. `DELETE /api/profile` (self-service deletion).
3. Optional email/password and partial unique indexes. **Run
   `node src/scripts/migratePhoneAuth.js` once per database before
   deploying.**
4. Security fixes: no OTP or PIN hashes in profile or admin responses, and
   `onboard-basic` can't verify companions.
