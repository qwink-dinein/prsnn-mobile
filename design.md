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

`prsnn` in Lora SemiBold, then a **clay** full stop: `prsnn.` (component:
`<Logo/>`). The app icon is a cream "p" and a clay "." on moss.

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
| 10 | Booking summary | `/book/review` | Sends the request |
| 11 | Payment | `/pay/[bookingId]` | Razorpay Checkout |
| 12 | Booking confirmed | `/confirmed?kind=request\|paid` | |
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

## States every data screen has

Loading (spinner), error (message + Try again), empty (icon, one line, next
action) and pull-to-refresh on lists.

## Accessibility

- Every icon-only button has a label. Chips and segments expose
  `selected`, radios expose `checked`.
- Touch targets are 44–48pt or larger.
- Text contrast is 4.5:1 or higher (muted grey `#6A665C` on mist passes).
- Haptics are used only for meaningful moments: sending a request, paying,
  success, and PIN errors.

## Photos

The marketing photos in `assets/images/` come from the web app's `public/`
folder, compressed to around 50–115 KB each.
