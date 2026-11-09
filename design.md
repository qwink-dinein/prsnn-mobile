# prsnn mobile — Design

Source of truth: the 24-screen mock-up board (screens 1–21 and 24 are
mobile; 22 is the web admin) and the web palette in
`prsnn-frontend/app/globals.css`. **Keep the theme and palette as they are.**
Code tokens live in `src/theme/tokens.ts` and `src/theme/fonts.ts`.

## Palette ("2026 Presence": mist, ink, moss, signal)

| Token | Hex | Use |
|---|---|---|
| `mist` | `#F3F1EB` | App background |
| `paper` | `#FAF9F6` | Cards, sheets, inputs, tab bar |
| `mistDeep` | `#E8E5DC` | Pressed states, segmented track |
| `ink` | `#0E110D` | Primary text |
| `gray500` (textMuted) | `#6A665C` | Secondary text (5.3:1 on mist) |
| `moss` | `#2F4A34` | **The one accent**: primary buttons, selected chips, links |
| `mossSoft` | `#D7E3D4` | Soft fills, avatar placeholders, icon wells |
| `green50` | `#F2F6F1` | Unread rows, safety banners |
| `clay` | `#C45C2A` | Wordmark full stop, hearts, warnings, unread dots |
| `signal` | `#C8F03C` | Reserved accent. Never as text on light backgrounds |
| `danger` | `#B3261E` | Destructive actions only |

Online/verified dot: `#3FB950` with a paper ring.

## Type

- **Display**: Lora SemiBold (serif). Used for screen titles, the wordmark
  and big numbers ("Life is better with good company.", "₹2,100").
- **Text and UI**: DM Sans 400/500/600/700, the same body face as
  prsnn.com.
- Styles are named like iOS text styles (`largeTitle` … `caption`) and
  scale with Dynamic Type. Display titles are capped at 1.4×, body at 2×.

## Wordmark

**“prsnn.”** in Lora SemiBold *Italic*, then a **clay** full stop. Use `<Wordmark/>` for the
large mark, and `<Brand/>` inside running text (“ID verified by *prsnn.*”). System alerts
can't show italics, so they use plain “prsnn.”. The app icon is a cream italic “p” and a
clay “.” on moss. The store and app name stays “prsnn”.

## Locked profiles

A locked person's photo is replaced by `assets/images/locked.jpg`, a static blurred
silhouette in the moss palette, with a cream lock badge (`<LockedPhoto/>`, and
`<Avatar locked/>`). It is never a blurred copy of the real photo.

## Shape and depth

- Radius: 8 / 12 / 16 / 20 / 28. Cards use 20, buttons and inputs use 16,
  chips are pills.
- Shadows are soft and low. Cards get a hairline `line` border plus
  `shadow.card`.
- Primary button: moss, 54pt tall, full width at the bottom (thumb reach).

## Navigation (iOS-native, works on Android)

- **Tab bar** with 5 tabs: Home · Search · Bookings · Messages · Profile.
  For companions the labels become Dashboard · Search · Requests ·
  Messages · Profile.
- The mock-up's **Mobile Menu (24) is replaced by the tab bar and Profile
  list.** Hamburger menus are not native on iOS.
- Stack screens have an inline header: back at the top left and swipe-back
  intact.
- Destructive actions (log out, cancel booking, decline, delete account)
  confirm with a native alert, with the destructive option in red.

## Screen map

| # | Mock-up | Route | Notes |
|---|---|---|---|
| 1 | Splash | `/` | Photo collage + wordmark, auto-advances |
| 2 | Onboarding | `/welcome` | |
| 3 | Choose role | `/role` | Radio cards |
| 4 | Login / sign up | `/login`, `/otp`, `/login-email` | Phone first; Email for web accounts |
| 5 | Set PIN | `/pin?mode=set` · `/pin?mode=login` | Custom keypad, weak PINs refused |
| — | About you | `/setup-profile` | Not in the mock-ups; needed for a name |
| 6 | Home / Discover | `/home` (tab) | Companions see the dashboard (20) here |
| 7 | Search & filters | `/search` (tab) | Location, sort, activity chips |
| 8 | Companion profile | `/companion/[id]` | |
| 9 | Select date & time | `/book/[id]` | Only days and times the companion offers |
| 10 | Booking summary | `/book/review` | Checkout: price, “no booking fee”, how matching works, cancellation and refund terms, consent tick |
| 11 | Payment | `/pay/[bookingId]` | Test checkout while `PAYMENT_MODE=simulated`, Razorpay otherwise |
| 12 | Booking confirmed | `/confirmed?kind=paid` | “Payment received” → live timeline → “Booking confirmed!” |
| — | Booking details | `/booking/[id]` | Status timeline, payment state, cancel with refund preview, Report a problem |
| — | Report a problem | `/report/[id]` | Dispute on a paid booking |
| — | Privacy & preferences | `/privacy` | Gender, show me, photo lock (re-consent), city and area |
| 13 | Chat | `/chat/[bookingId]` | |
| 14 | My bookings | `/bookings` (tab) | Upcoming / Past / Cancelled |
| 15 | Profile | `/profile` (tab) | |
| 16 | Notifications | `/notifications` | |
| 17 | Become a companion | `/fellow/apply` | |
| 18 | Companion onboarding | `/fellow/onboarding` | 5 steps |
| 19 | Verification | `/fellow/verification` | |
| 20 | Companion dashboard | `/home` (companion) | |
| 21 | Earnings | `/fellow/earnings` | |
| 22 | Admin dashboard | — | Web only |
| 24 | Mobile menu | — | Replaced by the tab bar |

## Motion

Built with Reanimated 4 (`src/components/ui/motion.tsx`) and the timings from the
animate-expo skill. Motion only where it does a job; tabs never animate.

| Where | What | Why |
|---|---|---|
| Login, PIN (seen rarely) | Blocks fade up 12pt, 420ms, 70ms stagger; the wordmark's clay dot settles in last | Explanation / first impression |
| Every button, PIN key | Scale 0.97 (keys 0.94) on press-in, 100ms | Feedback |
| PIN boxes | Dot pops in (scale 0.5→1, 140ms) as each digit lands; 160ms pause on the 4th | State |
| Wrong PIN, invalid number | Short horizontal shake + error haptic | Feedback |

Curve: `cubic-bezier(0.23, 1, 0.32, 1)` (strong ease-out), never ease-in. With
Reduce Motion on, entrances become a 200ms fade and nothing moves or shakes.
Entrances are Reanimated CSS animations, not `entering` layout animations (on web
those pin elements in place when the layout changes).

## States every data screen has

Loading (spinner), error (message + Try again), empty (icon, one line, next
action) and pull-to-refresh on lists.

## Accessibility

- Every icon-only button has a label. Chips and segments expose
  `selected`, radios expose `checked`.
- Touch targets are 44–48pt or larger.
- Text contrast is 4.5:1 or higher (muted grey `#6A665C` on mist passes).
- Haptics are used only for meaningful moments: sending a request, paying,
  success, PIN errors, and one tick per PIN key.
- The PIN keypad has 76pt round keys, registers a digit the moment a key is
  touched, never drops fast taps, and accepts a hardware keyboard.

## Photos

The marketing photos in `assets/images/` come from the web app's `public/`
folder, compressed to around 50–115 KB each.

## Price cards (`PackageGrid`)

Two columns; an odd last card spans the full width (12 hours). Each card, top to bottom:
duration (footnote, muted) → **total** (title2, the most prominent number) → hourly rate
(caption, muted) → **“Save ₹X”** in moss (caption, semibold) when there is a saving.
The 4-hour card carries a **“Popular choice”** pill. The selected card gets a 1.5 pt moss
border and the `green50` background; unselected cards are paper with a `line` border.
In companion mode the cards are multi-select with a checkbox and an extra line,
**“You get ₹X”** (their 80%). Cards are `accessibilityRole="radio"` (booking) or
`"checkbox"` (companion), labelled with duration, price and saving.

## Tap to advance

Onboarding choices (role, I am, Show me, visibility, city, area) are single taps that move
to the next step with no Confirm button. Only free text (name) has a Next button.
