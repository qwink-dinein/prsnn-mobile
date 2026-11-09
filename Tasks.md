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

## Before the first real build

- 🔑 **Waplify**: API key + Meta-approved *Authentication* template name (and `WAPLIFY_CODE_KEYS` if the code isn't `{{1}}`). Set these on Render.
- 🔑 **MSG91** (optional SMS backup): auth key + DLT template id.
- ⏸ **Razorpay**: deferred (owner, 2026-11-09). Payments are simulated until then; switching on Razorpay is a backend env change (`PAYMENT_MODE=razorpay` + keys), no app update.
- 🔑 Submit the 4 WhatsApp templates (WHATSAPP_TEMPLATES.md) and set their names on Render.
- ⏳ Run `node src/scripts/migratePhoneAuth.js` on the testing DB, deploy the backend branch to the testing service, and smoke-test OTP → book → pay → chat.
- 🔑 **Expo/EAS**: `eas init` on the owner's Expo account (`mukarramjah`), then `eas build -p android --profile preview` for an installable APK.
- 🔑 **Apple Developer** account for iOS builds and TestFlight.
- ⏳ Add `https://prsnn.com` deep links (`/companions/:id`) as intentFilters / associatedDomains.

## P1 (launch quality)

- ⏳ Push notifications (expo-notifications plus a `pushToken` on User; the backend sends on booking_request, booking_accepted, payment_completed and new messages)
- ⏳ Offline banner and retry (expo-network)
- ⏳ Server-side "mark notification read" (the backend only has clear-all)
- ⏳ Companion photo gallery (backend stores one photo)
- ⏳ Account deletion should also remove Cloudinary files (backend)
- ⏳ e2e smoke test (Maestro) for login → book → pay (test keys)

## P2 (product)

- 💡 Pay-at-request (mock-up order) with auto-refund on decline. Needs backend order and refund flow.
- 💡 Ratings and reviews after `completed` (new Review model). The mock-ups show "4.8 ★".
- 💡 Saved companions synced to the server
- 💡 Age on profiles (mock-up "Ayesha, 24"). Needs a date of birth at onboarding plus an 18+ check.
- 💡 Refer & earn, wallet credit, offers (mock-up 15, 16)
- 💡 Payout details and payout history for companions (mock-up 20 "Payouts")
- 💡 Google / Apple sign-in
- 💡 Multiple cities (location picker; the backend has `city`)
- 💡 Hindi, Urdu and Telugu (i18n like Hyderabad Rishta)

## Known backend issues found while reading the code

- `searchCompanions` builds a `RegExp` from user input (ReDoS / regex injection). Escape it. The app doesn't call this endpoint.
- `updateProfile` lets a user change `email` and `username` with no uniqueness check or re-verification.
- `cancel_session` socket event broadcasts without checking the booking status or that the sender is a participant (it only needs to be in the room).
- One existing test (`booking.test.js` "403 if the requester is not verified") fails because the check was removed on purpose. Update or delete the test.
- In-memory caches (companions, pending OTPs) are per process. Move to Redis before running more than one instance.
