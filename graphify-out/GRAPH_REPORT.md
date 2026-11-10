# Graph Report - prsnn-mobile  (2026-11-10)

## Corpus Check
- 114 files · ~86,761 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 839 nodes · 3822 edges · 31 communities (23 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `580bc258`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- demoAdmin.ts
- companion/[id].tsx
- layout.tsx
- booking.ts
- expo
- session.ts
- push.ts
- admin/booking/[id].tsx
- package.json
- dependencies
- app/_layout.tsx
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- errorMessage
- demo.ts
- types.ts
- chat.ts
- pay/[bookingId].tsx
- pin.ts
- flows.py
- eslint.config.js
- expo@~58.0.20
- @expo-google-fonts/dm-sans@^0.4.2
- expo-linear-gradient
- expo-system-ui@~58.0.6
- react-dom@19.3.0
- react-native-worklets@0.13.0
- @supabase/supabase-js

## God Nodes (most connected - your core abstractions)
1. `Text()` - 144 edges
2. `Icon` - 83 edges
3. `Header()` - 71 edges
4. `Button()` - 71 edges
5. `useSession` - 71 edges
6. `react-native` - 71 edges
7. `errorMessage()` - 70 edges
8. `colors` - 65 edges
9. `space` - 57 edges
10. `Loading()` - 56 edges

## Surprising Connections (you probably didn't know these)
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `HomeTab()` --calls--> `useSession`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/state/session.ts
- `Discover()` --calls--> `CompanionCard()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/companions.tsx
- `Discover()` --calls--> `Icon`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/ui/Icon.tsx
- `Discover()` --calls--> `Avatar()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/ui/layout.tsx

## Import Cycles
- None detected.

## Communities (31 total, 8 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.10
Nodes (24): AuditEntry, BroadcastRecord, backend, Backend, activity, allDays, bk(), bookings (+16 more)

### Community 1 - "companion/[id].tsx"
Cohesion: 0.08
Nodes (58): AdminPrices(), Draft, draftOf(), Pair(), Prices(), styles, Checkout(), newKey() (+50 more)

### Community 2 - "layout.tsx"
Cohesion: 0.05
Nodes (134): expo-haptics, expo-image, expo-router, react, react-native, AdminBroadcast(), Broadcast(), styles (+126 more)

### Community 3 - "booking.ts"
Cohesion: 0.06
Nodes (75): SelectDateTime(), styles, WEEK, BookingDetail(), styles, Chat(), time(), Confirmed() (+67 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (38): backgroundColor, foregroundImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption, typedRoutes (+30 more)

### Community 5 - "session.ts"
Cohesion: 0.21
Nodes (9): @react-native-async-storage/async-storage@2.2.0, @react-native-async-storage/async-storage, Role, SessionUser, setApiToken(), secure, AuthResult, Prefs (+1 more)

### Community 6 - "push.ts"
Cohesion: 0.29
Nodes (5): expo-constants@~58.0.13, expo-device@~58.0.5, expo-constants, expo-device, DEMO

### Community 7 - "admin/booking/[id].tsx"
Cohesion: 0.09
Nodes (55): AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap(), AdminLayout(), AdminUserDetail(), DAYS (+47 more)

### Community 8 - "package.json"
Cohesion: 0.12
Nodes (21): expo-crypto@~58.0.7, react-native-web@~0.21.4, devDependencies, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0, @types/jest@^30.0.0, @types/react@~19.3.0 (+13 more)

### Community 9 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @expo-google-fonts/lora@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-image-picker@~58.0.10, expo-linking@~58.0.14, expo-router@~58.0.27, expo-secure-store@~58.0.2 (+22 more)

### Community 10 - "app/_layout.tsx"
Cohesion: 0.12
Nodes (21): expo-font@~58.0.10, expo-notifications@~58.1.8, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-notifications, expo-splash-screen (+13 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, noEmit, paths, strict, types, exclude (+2 more)

### Community 12 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, export:web, graph, ios, lint, start, test (+2 more)

### Community 13 - "e2e-supabase.mjs"
Cohesion: 0.10
Nodes (13): book(), cand, card, [compId, memId], got, img, offer, rpc() (+5 more)

### Community 14 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

### Community 15 - "errorMessage"
Cohesion: 0.09
Nodes (63): react-native-safe-area-context, @tanstack/react-query, Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins() (+55 more)

### Community 16 - "demo.ts"
Cohesion: 0.09
Nodes (20): allDays, bookings, companionStatus(), day(), demo, DemoCompanion, demoIncoming, first() (+12 more)

### Community 17 - "types.ts"
Cohesion: 0.09
Nodes (26): BookingTab, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, Booking, BookingStatus (+18 more)

### Community 19 - "chat.ts"
Cohesion: 0.17
Nodes (11): ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status, toMessage(), useChat(), LINKS (+3 more)

### Community 20 - "pay/[bookingId].tsx"
Cohesion: 0.24
Nodes (13): METHODS, Pay(), styles, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props (+5 more)

### Community 21 - "pin.ts"
Cohesion: 0.40
Nodes (8): checkLocalPin(), clearLocalPin(), hasLocalPin(), key(), MAX_PIN_TRIES, setLocalPin(), triesKey(), sessionUser()

### Community 22 - "flows.py"
Cohesion: 0.14
Nodes (11): city_pill(), day_trips(), plan_rows(), b64(), bar(), dots(), page(), pk() (+3 more)

### Community 23 - "eslint.config.js"
Cohesion: 0.29
Nodes (6): { defineConfig }, expoConfig, eslint@^9.0.0, eslint-config-expo@~58.0.4, eslint, eslint-config-expo

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 250 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `layout.tsx` to `companion/[id].tsx`, `booking.ts`, `session.ts`, `push.ts`, `admin/booking/[id].tsx`, `package.json`, `dependencies`, `app/_layout.tsx`, `errorMessage`, `chat.ts`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09788359788359788 - nodes in this community are weakly interconnected._
- **Why does `Text()` connect `layout.tsx` to `companion/[id].tsx`, `booking.ts`, `admin/booking/[id].tsx`, `app/_layout.tsx`, `errorMessage`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `companion/[id].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07688828584350972 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `@supabase/supabase-js` to `package.json`, `chat.ts`, `e2e-supabase.mjs`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05339901477832512 - nodes in this community are weakly interconnected._