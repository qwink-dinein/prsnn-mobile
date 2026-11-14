# Build notes: changes to apply together when the owner says "build"

Nothing here is built yet. Keep adding to this list; build everything in one go.

## 1. New look (approved 2026-11-14)
- Palette (porcelain, midnight, champagne), Urbanist text, Outfit "prsnn." logo with the champagne dot: `design.md`.
- Home categories: Wallet "B · Lift to choose". Price cards in the same Wallet style. Companion "lengths you offer" with all 12 lengths.
- Every screen and state as in `preview/all-screens-v2.html` (121 screens), checked against `preview/screens-gap-audit.md`. UI and copy only; no feature removed.
- New feature: SOS button in the chat header (live from session start to 1 h after the end; same alert as the booking screen).
- Chat keyboard fix: the chat moves above the keyboard; ⌄ button, tapping a message or swiping down hides it; one-line safety tip.
- Onboarding copy stays very simple: one short title, at most one short line per step.
- Become a companion: drop "Set your own hourly rate" and "Every member is ID-verified" (no longer true).
- Mock-up annotations are not part of the app (e.g. the grey "Changed copy: …" note on Become a companion, "Email sign-ups only" and "New: panic button in chat" tags).

## 2. New: admins can view the app as a member or companion (design for approval: `preview/view-as.html`)
- Admin overview gets a "View the app as…" row → choose **A member** or **A companion**, and where to start (Home, Sign-up, A booking, Chat).
- Opens the real app screens with the built-in sample data (the demo service), never a real person's account. Admins can't see or act as real users.
- A midnight strip on every screen: "Member preview · sample data · Exit". Switch member ↔ companion from the preview's Profile tab.
- Everything is tappable (book, sample pay, chat, panic, companion onboarding, accept, ID check, earnings) but nothing reaches the server: no payments, notifications or WhatsApp. Sample changes are cleared on exit.
- Exit returns to Admin with the admin's own session untouched; each preview is written to the activity log.
- How: make `svc` switchable at runtime (backend ↔ demo) for staff, with a separate React Query cache and session overlay while previewing.
- Later, if approved: Users → a companion → "See their profile as members do" (read-only real public profile).

## 3. Bugs (owner, 2026-11-14)
- **Text must never spill out of its card.** Seen in the mock-ups:
  - My bookings: the price "₹1,299" on the "Paid · awaiting companion" card runs past the card's right edge.
  - Become a companion: the last note runs under the "Apply now" button.
  - Category page: the first tick line sits tight under the photo header.
  Fix across **all** screens: every row wraps or shrinks text instead of overflowing (flex rows with `minWidth: 0`, `flexShrink`, `numberOfLines` where a single line is required), prices and pills never squeezed off the edge, footers never cover content (scroll padding = footer height), and long names, translated text and large Dynamic Type sizes still fit.
- **Every card must look like a clear, separate card** (owner, 2026-11-14; seen on Become a companion, where the four perks run together as loose text on the background). Rules for all screens:
  - Each block of related content sits in its own card: white (`#FFFFFF`) on the porcelain background, radius 20, a hairline outline (`rgba(24,27,52,.08)`) plus a soft shadow, and 16 pt inner padding. Nothing floats as loose text between cards.
  - Lists of points (perks, steps, terms, how it works) are either one card with dividers between rows, or one card per point. Never bare text on the background.
  - At least 12 pt gap between cards and 20 pt between sections; each section has a short title above its card.
  - Tinted cards (champagne mist for tips, red for safety) keep the same outline and padding, so they read as cards, not highlights.
  - Cards never touch the bottom button: the scroll area ends above the pinned footer.
- **Live number badges** (owner, 2026-11-14): show the real count, updated in real time (no app restart or pull-to-refresh), and cleared when seen.
  - **Bell** (Home header, companion dashboard, admin): number of unread notifications (1, 2, 3 … then "9+"). Today it's only a dot. Opening Notifications marks them read and the badge clears.
  - **Messages tab**: number of unread chat messages across all chats; each chat row in Messages also shows its own count. Opening a chat clears that chat's count.
  - **Bookings / Requests tab**: members, bookings that need you (payment not finished, accepted · pay to confirm); companions, booking offers waiting for your answer (paid offers still live). Clears as you act on them.
  - **Admin**: overview tiles and the admin rows (approvals, ID checks, disputes, panic alerts) keep their live counts; open panic alerts show first.
  - Badges: champagne circle with midnight number, ring in the tab-bar colour, never covering the icon label; hidden at 0; accessibility label reads e.g. "Messages, 3 unread".
  - How: Supabase Realtime subscriptions on `notifications`, `messages` and `bookings`/`booking_offers` for the signed-in person (RLS already limits rows), plus refresh on app foreground; React Query caches updated from the events.
  - **Backend needed (migration + API.md + e2e):** messages have no read tracking today. Add `chat_reads (booking_id, user_id, last_read_at)` with RLS, an RPC `mark_chat_read(bid)` and `unread_counts()` returning `{ notifications, messages, perChat, bookings }`; cover in `scripts/e2e-supabase.mjs`.
- **Back during sign-up goes to the previous step, never to "Enter your mobile number"** (owner, 2026-11-14). A new user verified their number, filled two setup screens, pressed back and landed on the mobile-number screen.
  - Cause: `setup-profile` (and `fellow/onboarding`) handle back only on their own arrow. Android's back button and iOS swipe-back pop the whole screen, and because OTP and PIN were `router.replace`d, the screen underneath is Login. On step 1 the arrow itself also calls `router.back()` → Login.
  - Fix: in setup and companion onboarding, intercept every back (header arrow, Android `BackHandler`, iOS swipe via `usePreventRemove`/`beforeRemove`) and go to the previous step. On step 1, back does nothing harmful: show "Your answers are saved. Finish setting up?" with Keep going / Log out; never show the login or OTP screens to a signed-in person.
  - Remember where they were: save the current step with the draft (`useDraft`) so a closed app, a crash or a session restore reopens on the same step with the answers filled in (today only the answers are kept and it restarts at step 1). Same for companion onboarding (9 steps), booking checkout and the companion ID check.
  - Signed-in people can never navigate back into Login, OTP or Set PIN; after OTP/PIN the stack is reset so those screens are gone.
  - Test on Android (hardware back) and iOS (swipe) for every step of both flows.
- **Fit every device.** Small phones (iPhone SE 375×667, small Android 360 wide), large phones (Pro Max 430 wide), foldables, and tablets (iPad / Android tablets, portrait and landscape): content width capped and centred on tablets, grids add columns on wide screens, no fixed heights that clip text, safe areas respected. Check every screen at 360, 375, 430, 768 and 1024 wide before shipping.
