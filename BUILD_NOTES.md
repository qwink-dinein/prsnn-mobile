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

## 2. Bugs (owner, 2026-11-14)
- **Text must never spill out of its card.** Seen in the mock-ups:
  - My bookings: the price "₹1,299" on the "Paid · awaiting companion" card runs past the card's right edge.
  - Become a companion: the last note runs under the "Apply now" button.
  - Category page: the first tick line sits tight under the photo header.
  Fix across **all** screens: every row wraps or shrinks text instead of overflowing (flex rows with `minWidth: 0`, `flexShrink`, `numberOfLines` where a single line is required), prices and pills never squeezed off the edge, footers never cover content (scroll padding = footer height), and long names, translated text and large Dynamic Type sizes still fit.
- **Fit every device.** Small phones (iPhone SE 375×667, small Android 360 wide), large phones (Pro Max 430 wide), foldables, and tablets (iPad / Android tablets, portrait and landscape): content width capped and centred on tablets, grids add columns on wide screens, no fixed heights that clip text, safe areas respected. Check every screen at 360, 375, 430, 768 and 1024 wide before shipping.
