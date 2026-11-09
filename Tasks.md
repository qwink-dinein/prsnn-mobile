# Tasks

Legend: ✅ done · 🔑 needs a key or account from the owner · ⏳ next · 💡 later

## Done (v0.1)

- ✅ Expo 58 / RN 0.88 / expo-router app with the web palette, Lora + DM Sans, and inline SVG icons
- ✅ Screens 1–21 (see design.md screen map), plus About you, booking details, saved, edit profile, availability and delete account
- ✅ Phone OTP + PIN login, and email login for web accounts
- ✅ Booking request → accept → Razorpay payment → chat, matching the backend rules
- ✅ Companion onboarding (5 steps, ID upload), verification status, dashboard, requests and earnings
- ✅ Demo mode with sample data; web preview checked at 375pt and 440pt
- ✅ Unit tests for pricing, slots, stages, earnings, search, phone and time
- ✅ Backend: phone OTP (Waplify, with MSG91 backup), PIN, self-delete, security fixes, migration script, tests
- ✅ WhatsApp Utility notices: booking request → companion, accepted → member (pay), paid → companion (WHATSAPP_TEMPLATES.md)
- ✅ Simulated payments (`PAYMENT_MODE=simulated`) with a test checkout in the app, including a failure path
- ✅ Forgot PIN → code on WhatsApp → choose a new PIN
- ✅ Easier PIN keypad (76pt keys, no dropped taps, hardware keyboard) and login motion
- ✅ **Prepaid booking**: pay first → chosen companion (15 min) → up to 2 backups → atomic assignment → auto refund; idempotency, webhook, cancel policy, disputes
- ✅ Italic “prsnn.” brand everywhere; gender + “show me” filter (server-side); profile lock with consent and a static blurred placeholder
- ✅ All Indian cities (ODbL dataset) + metro area lists in onboarding, companion registration and Search
- ✅ **Fixed package prices** (₹399 base, 1–12 h, longer = cheaper per hour), price cards for members and companions, 80/20 split with “You get ₹X”
- ✅ Sessions 7 AM–10 PM; offer windows scale with notice (15 min–5 h each); refund if nobody accepts 1 h before
- ✅ Cancellation: customer 85% if ≥15 min before (15% fee to prsnn.), none later; companion cancels → 100%
- ✅ Tap-to-advance onboarding (role, gender, show me, visibility, city, area)
- ✅ **In-app admin** (ADMIN_SPEC.md): superadmin/sub-admin roles, Overview, Verify, Bookings (Live/Refunds/Done) with edit/cancel/reassign and superadmin money actions, Disputes with chat, Users (edit/suspend/delete/make sub-admin), Sub-admins, Prices, Broadcast, Activity log; server-enforced, every action audited
- ✅ Prices, split, cancellation fee and offer/day windows live in a `Settings` document; the app reads them from the API with the bundled table as fallback
- ✅ Push token saved at login (`expo-notifications`); superadmin push broadcasts via Expo

## Before the first real build

- 🔑 **Waplify**: API key + Meta-approved *Authentication* template name (and `WAPLIFY_CODE_KEYS` if the code isn't `{{1}}`). Set these on Render.
- 🔑 **MSG91** (optional SMS backup): auth key + DLT template id.
- ⏸ **Razorpay**: deferred (owner, 2026-11-09). Payments are simulated until then; switching on Razorpay is a backend env change (`PAYMENT_MODE=razorpay` + keys), no app update.
- 🔑 Submit the remaining 2 WhatsApp templates (`prsnn_booking_confirmed`, `prsnn_booking_unfulfilled`, see WHATSAPP_TEMPLATES.md) and set all template names on Render.
- ⏳ Existing companions get the default packages 1, 2, 4, 6, 12 h until they choose; existing bookings keep their old price.
- ⏳ Run `node src/scripts/migratePhoneAuth.js` on the testing DB, deploy the backend branch to the testing service, and smoke-test OTP → book → pay → chat.
- 🔑 **Expo/EAS**: `eas init` on the owner's Expo account (`mukarramjah`), then `eas build -p android --profile preview` for an installable APK. `eas init` also writes the EAS project id that push notifications need; until then the app skips push registration (Expo Go and web can't receive pushes anyway).
- 🔑 **Superadmins**: set `SUPERADMIN_PHONES` on Render (both services) to the owner's two numbers, then log in with OTP or PIN. Never commit the numbers.
- 🔑 **Android push**: upload the FCM V1 service-account key to EAS (`eas credentials`) before broadcasts reach Android devices; iOS needs the APNs key (EAS can create it).
- 🔑 **Apple Developer** account for iOS builds and TestFlight.
- ⏳ Add `https://prsnn.com` deep links (`/companions/:id`) as intentFilters / associatedDomains.

## Prepaid follow-ups

- ⏳ Run the allocation tests against a real MongoDB on the testing service (this session couldn't download MongoDB). The concurrency guarantees rely on MongoDB conditional updates.
- ⏳ Razorpay Dashboard → Webhooks → add `/api/payments/webhook` (payment.captured, refund.processed) and set `RAZORPAY_WEBHOOK_SECRET` when Razorpay goes live.
- ⏳ Push notifications for offers: a 15-minute window is short without them (WhatsApp `booking_request` covers it meanwhile).
- 💡 When a companion cancels a confirmed booking before the start, offer it to backups instead of refunding straight away (needs a product decision).
- 💡 Older companions without a gender appear only to members who chose “Everyone” until they set one (the app asks on next login).

## P1 (launch quality)

- ⏳ Push for booking events (the token and Expo sender exist now for broadcasts; still to send on booking_request, booking_accepted, payment_completed and new messages)
- ⏳ Admin follow-ups: the member app's slot picker still uses the default 07:00–22:00 window client-side (the server enforces the live window); only one refund per booking is possible (a second partial refund needs a refunds array); suspended users' existing tokens stay valid until expiry for non-admin routes (login is blocked)
- ⏳ Offline banner and retry (expo-network)
- ⏳ Server-side "mark notification read" (the backend only has clear-all)
- ⏳ Companion photo gallery (backend stores one photo)
- ⏳ Account deletion should also remove Cloudinary files (backend)
- ⏳ e2e smoke test (Maestro) for login → book → pay (test keys)

## P2 (product)

- 💡 Ratings and reviews after `completed` (new Review model). The mock-ups show "4.8 ★".
- 💡 Saved companions synced to the server
- 💡 Age on profiles (mock-up "Ayesha, 24"). Needs a date of birth at onboarding plus an 18+ check.
- 💡 Refer & earn, wallet credit, offers (mock-up 15, 16)
- 💡 Payout details and payout history for companions (mock-up 20 "Payouts")
- 💡 Google / Apple sign-in
- 💡 Hindi, Urdu and Telugu (i18n like Hyderabad Rishta)

## Known backend issues found while reading the code

- ✅ `searchCompanions` now escapes user input before building a RegExp.
- `updateProfile` lets a user change `email` and `username` with no uniqueness check or re-verification.
- `cancel_session` socket event broadcasts without checking the booking status or that the sender is a participant (it only needs to be in the room).
- One existing test (`booking.test.js` "403 if the requester is not verified") fails because the check was removed on purpose. Update or delete the test.
- In-memory caches (companions, pending OTPs) are per process. Move to Redis before running more than one instance.
