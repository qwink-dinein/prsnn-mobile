# Tasks

Legend: ✅ done · 🔑 needs a key or account from the owner · ⏳ next · 💡 later

## Done (v0.1)

- ✅ Expo 58 / RN 0.88 / expo-router app with the web palette, Lora + DM Sans, and inline SVG icons
- ✅ Screens 1–21 (see design.md screen map), plus About you, booking details, saved, edit profile, availability and delete account
- ✅ Phone OTP + PIN login, and email login for web accounts
- ✅ Booking request → accept → Razorpay payment → chat, matching the backend rules
- ✅ Companion onboarding (4 steps, live at the end), dashboard, requests and earnings
- ✅ **ID check at the first booking** (2026-11-10): sign-up only tells companions an ID will be needed; the first offer opens “Verify ID & accept” (Aadhaar / PAN / DL / passport / voter ID + selfie); the booking is held until staff approve; members see “New on prsnn” and a safety-check step; reject → re-offered or refunded; deadline → refund. Tested in the database (rolled back); re-run `scripts/e2e-supabase.mjs` after `prsnn-backend/supabase/tests/e2e-reset.sql`
- 💡 Instant ID approval via DigiLocker or an ID-check provider (needs an account and key)
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

- ✅ **Round 2** (2026-11-10): PIN right after verification · email sign-up for visitors from abroad · all-India state → city → area dropdowns (India Post, 156,912 localities) · five categories · new price cards · photo required and approved by staff · every companion approved before going live · change requests in the bell with "Fix and resubmit" · booking for someone else (incl. Other) · meeting place on every booking · chat safety reminder · panic button (session start → end + 1 h, hold 3 s) with WhatsApp + push to every admin every 5 min until resolved · admin approvals, panic alerts and city plans · offline banner, slow-network progress, drafts kept through session expiry, success states
- 🔑 **Supabase email OTP** (visitors from abroad): Authentication → Providers → Email on, "Confirm email" on; Email Templates → Magic Link: put `{{ .Token }}` in the body; set up custom SMTP (the built-in sender allows only a few emails an hour)
- 🔑 **WhatsApp `prsnn_panic_alert`**: submit in Waplify, then set the secret `WAPLIFY_TPL_PANIC_ALERT`
- 💡 Weekly plans for a loved one and gift bookings (designed, not built: need series payments and gift codes)

## Before the first real build

- ✅ **Moved to Supabase** (2026-11-09): Postgres + RLS, Auth phone OTP (WhatsApp via Send SMS hook), Storage, Realtime chat, pg_cron sweeper, edge functions for push/WhatsApp/broadcast. Render, MongoDB and Cloudinary are no longer used by the app. 46-step check: `node scripts/e2e-supabase.mjs`.
- 🔑 **Supabase dashboard** (see prsnn-backend/supabase/README.md): enable Phone auth, turn on the Send SMS hook, add the Waplify secrets, add your superadmin numbers, add reviewer test numbers.
- ⏳ Razorpay on Supabase (create order + verify + webhook + refund sender as edge functions). Until then `payment_mode = simulated`.
- ⏳ Website (prsnn-frontend) still talks to the old Express API — being moved next.

- ✅ End-to-end tested locally (2026-11-09) against MongoDB 7 + the backend branch: OTP and PIN login, member and companion onboarding, admin verification, prepaid booking, simulated payment, offer/accept, chat (live, numbers masked), 85% cancellation refund, dispute handling, sub-admin limits, price change, suspend. Real WhatsApp delivery was not tested (needs the Waplify key, and this environment can't reach Waplify or Render).
- 🔑 **Test logins for App Store / Play review**: set `OTP_TEST_NUMBERS=9000000009:<6 digits>` on Render and give that number and code to the reviewers. No message is sent for these numbers.

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
- In-memory caches (companions, pending OTPs) are per process. Move to Redis before running more than one instance.
