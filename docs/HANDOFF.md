# Session handoff — 17 Nov 2026

> **Stable point saved 18 Nov 2026:** tag `stable-2026-11-18` in all three repos. What's in it and how to get back:
> `docs/RELEASE-2026-11-18.md`.

Start the next session from here. Branch in all three repos: `claude/adoring-euler-w8jj3h`.

| Repo | Last commit |
|---|---|
| prsnn-mobile | `c956b0b` Refresh knowledge graph (after the two-modes, live-preview, welcome-video and chat-dedupe work) |
| prsnn-backend | `b8de72d` Production guards (no-overlap constraint, reused Razorpay orders, duplicate-payment refunds) |
| prsnn-frontend | `79a4d31` Refresh knowledge graph (after `fb27f89`: italic **prsnn.** brand everywhere on the site) |

All three are clean and pushed. Every migration is applied and the `payments`, `refunds` and `razorpay-webhook` edge functions are deployed (v9).

## Done most recently
- Website: every visible "prsnn" renders as italic, bold *prsnn.* via `Name` / `rich()` in `app/(site)/_components/Brand.jsx`. Live on prsnn.com.
- App: two modes (Booking / Companion) with an easy switch, live preview for admin, the welcome video, PIN screen shows the number, "What's it for?" removed, faces no longer cropped.
- Backend: database blocks double booking; the same payment twice is harmless; a second payment is refunded automatically.

## Waiting on the owner
0. Make one paid booking to confirm the companion's WhatsApp booking request now arrives (fixed 17 Nov: the offer notice had no booking, so its WhatsApp was skipped). `notify` logs now say `waplify sent/failed` per message.
1. **Restore prices.** Live prices are still the ₹10 test prices. On "restore prices", set `packagePrices` in `public.settings` (key `pricing`) back to 399, 699, 999, 1299, 1599, 1899, 2199, 2499, 2799, 3099, 3349, 3599.
2. Make the Razorpay webhook secret match in Razorpay and in Supabase secrets.
3. Build a new APK on the Mac and upload it to Drive:
   `cd ~/prsnn-mobile && git stash && git pull && npm install`
   `npx eas-cli@latest build -p android --profile preview --local --output ~/prsnn-builds/prsnn.apk`
4. Razorpay: set payment capture to automatic.
5. Upgrade Supabase to Pro before scaling (docs/LAUNCH_GUIDE.md, Part E).
6. Cloudflare Web Analytics: remove the duplicate "prsnn.com Automatic setup" site.
7. Google Search Console: request indexing.

8. Email sign-in (visitors from abroad): Supabase custom SMTP was set to the Zoho free mailbox (admin@prsnn.com) and the email limit raised from 2/hour to 30. Not tested yet; the Zoho free plan may block SMTP (then use ZeptoMail or Zoho Mail Lite). Use a Zoho app password and sender admin@prsnn.com. Test: sign in with email, then check Auth logs for `mail.send` from prsnn.com.
9. Booking #ABDFC7: an admin's full ₹10 refund failed (Razorpay balance too low). Top up and retry in Admin → Refunds, or decide to drop it.

## Offered, not started
- Admin "Payments" screen: one row per payment with outcome, plain reason and Razorpay IDs (design first)
- ID check at companion sign-up
- Tourism step 1 (languages, licensed-guide badge)
- Block feature (needed for Apple review)
- Merge the three repos into one

## Working rules (unchanged)
Keep the theme; `svc.*` via React Query + `qk`; loading/error/empty states; no fake data; backend changes as migrations or edge functions documented in API.md and covered by the e2e script; secrets never in the repo or `EXPO_PUBLIC_*`; don't work around denied actions or Supabase confirmations; show designs before building UI unless told "build"; commit and push to `claude/adoring-euler-w8jj3h`, no PRs unless asked; `graphify query` before reading code and `graphify update .` after changes.
