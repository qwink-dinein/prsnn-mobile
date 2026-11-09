# In-app admin: approved spec (owner, 2026-11-09)

> **Status: built** (2026-11-09). App: `src/app/admin/*` (Profile → Admin for staff), rules in
> `src/domain/admin.ts`. Backend: `/api/admin/app/*`, `/api/settings/pricing`,
> `/api/admin/settings/pricing`, `/api/admin/broadcast`, `/api/profile/push-token` on branch
> `claude/adoring-euler-w8jj3h`. Routes in API.md §Admin. Owner to do: set `SUPERADMIN_PHONES`
> on Render, `eas init` (push needs the project id). Notes: a sub-admin cancel of a paid
> booking flags it for a superadmin refund decision (Refunds tab) instead of moving money;
> deleting a user is refused while they have an open paid booking.

Mock-ups approved: https://claude.ai/artifact/7cz4LvKLuv852ZknbsujtQ (Overview, Verify, Bookings & refunds, Dispute, plus a Users tab).
Build in `prsnn-mobile` (screens under `src/app/admin/*`, shown only to admin roles) and `prsnn-backend` (routes + tests). Document every new route in API.md.

## Roles

| Role | Who | Can |
|---|---|---|
| `superadmin` | Phones in backend env `SUPERADMIN_PHONES` (comma-separated, 10-digit). Owner's two numbers go there on Render; never in the repo. On login with OTP/PIN, a matching phone is promoted to `superadmin`. | Everything below, plus all money and price actions and push broadcasts. Add/remove sub-admins. |
| `subadmin` | Added by a superadmin (by phone number) | All operational actions: verify/reject companions; edit/suspend/delete users and companions; edit/cancel/reassign bookings (no money moves); view/answer/close disputes; view chats for disputes; edit profiles, packages offered, availability, visibility. |

Sub-admins can NOT: issue or retry refunds, change amounts, mark paid, change prices or the 80/20 split, see payout totals, add admins, send push broadcasts. Enforce on the server (middleware `requireRole('superadmin')` on every money/price/push route); the app only hides the buttons.

Every admin action writes an `AuditLog` { actorId, role, action, target, before, after, at }. Superadmin sees it in an "Activity" list.

## Full edit rights (superadmin)
Create, edit and delete: users, companions, bookings, disputes, notifications, sub-admins. Booking money actions: full or partial refund, retry failed refund, mark paid (simulated), override cancellation fee.

## Prices (superadmin)
- Move the package table and settings out of code into a `Settings` document: `packagePrices {1..12}`, `platformShare` (0.2), `cancellationFee` (0.15), `cancellationCutoffMinutes` (15), `offerMinMinutes` (15), `offerMaxMinutes` (300), `dayStart` '07:00', `dayEnd` '22:00', `headlineHours` [1,2,4,6,12].
- `GET /api/settings/pricing` (public, cached 60 s); `PUT /api/admin/settings/pricing` (superadmin, validated: prices rise with hours, per-hour falls).
- App reads prices from the API (React Query, fallback to the bundled table). Replace the "table matches backend file" test with one against the defaults.
- Changing prices affects new bookings only. Existing bookings keep `packagePrice`. Optional checkbox "re-price unpaid bookings" (awaiting_payment only).

## Push notifications (superadmin)
- Add `expo-notifications`; save `pushToken` on User at login (`PUT /api/profile/push-token`).
- `POST /api/admin/broadcast` { audience: 'members' | 'companions', title, body } → Expo push API in batches of 100; store a `Broadcast` record with counts.
- Screen: two tabs, Members and Companions, preview, send with confirm. Needs a real build (not Expo Go) and the EAS project id.

## Screens
Overview · Verify · Bookings (Live / Refunds / Done) · Disputes · Users (search, edit, suspend, delete, make sub-admin) · Prices (superadmin) · Broadcast (superadmin) · Activity log (superadmin). Same theme and components as the member app; every list has loading, error and empty states.
