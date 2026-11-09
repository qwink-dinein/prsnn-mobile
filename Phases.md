# Phases

```mermaid
gantt
  dateFormat YYYY-MM-DD
  title prsnn mobile
  section Phase 1 · Foundation (done)
  App shell, theme, screens 1–21          :done, p1, 2026-11-09, 1d
  Backend phone OTP + PIN + delete         :done, p1b, 2026-11-09, 1d
  section Phase 2 · Connect
  Keys (Waplify, Razorpay test), migrate DB :p2a, 2026-11-10, 2d
  Deploy backend branch to testing          :p2b, after p2a, 1d
  Android preview APK + device QA           :p2c, after p2b, 3d
  section Phase 3 · Launch
  Push notifications, offline, deep links   :p3a, after p2c, 5d
  iOS TestFlight + Play internal testing    :p3b, after p3a, 5d
  Store listings + review                   :p3c, after p3b, 7d
  section Phase 4 · Grow
  Reviews, pay-at-request, referrals        :p4, after p3c, 21d
```

## Phase 1: Foundation ✅
The whole member and companion journey works against the real API
contract. Demo mode for review.

**Exit check:** typecheck, lint and unit tests pass; every screen renders
without errors at 375 and 440 wide.

## Phase 2: Connect
Real keys, the testing backend, and a real device.

**Exit check:** on an Android phone, a real WhatsApp OTP arrives, a test
booking is accepted from a second account, a Razorpay test payment
verifies, and chat works both ways.

## Phase 3: Launch
Push notifications, store assets and store review.

**Exit check:** approved on TestFlight and in Play internal testing, plus a
privacy policy and data-safety form matching what the app collects (phone,
name, photo, ID images, payments through Razorpay).

## Phase 4: Grow
The P2 items in Tasks.md, ordered by what members ask for.
