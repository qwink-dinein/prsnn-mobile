# Graph Report - prsnn-mobile  (2026-11-09)

## Corpus Check
- 107 files · ~61,544 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 790 nodes · 3628 edges · 24 communities (22 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `13d54b12`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- demoAdmin.ts
- prices.tsx
- layout.tsx
- booking.ts
- expo
- storage.ts
- package.json
- Icon
- package.json
- dependencies
- app/_layout.tsx
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- Text
- demo.ts
- types.ts
- Screen
- pay/[bookingId].tsx
- pin.ts
- SessionUser
- expo-linking@~58.0.14

## God Nodes (most connected - your core abstractions)
1. `Text()` - 139 edges
2. `Icon` - 79 edges
3. `react-native` - 69 edges
4. `Button()` - 69 edges
5. `Header()` - 69 edges
6. `errorMessage()` - 68 edges
7. `useSession` - 67 edges
8. `colors` - 63 edges
9. `space` - 55 edges
10. `Loading()` - 54 edges

## Surprising Connections (you probably didn't know these)
- `HOURS` --calls--> `fromMinutes()`  [EXTRACTED]
  src/components/fellow/AvailabilityEditor.tsx → src/domain/booking.ts
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `BookingsTab()` --calls--> `BookingCard()`  [EXTRACTED]
  src/app/(tabs)/bookings.tsx → src/components/bookings.tsx
- `BookingsTab()` --calls--> `RequestCard()`  [EXTRACTED]
  src/app/(tabs)/bookings.tsx → src/components/fellow/RequestCard.tsx
- `BookingsTab()` --calls--> `Text()`  [EXTRACTED]
  src/app/(tabs)/bookings.tsx → src/components/ui/Text.tsx

## Import Cycles
- None detected.

## Communities (24 total, 2 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.12
Nodes (20): Role, activity, allDays, bk(), bookings, broadcasts, chats, day() (+12 more)

### Community 1 - "prices.tsx"
Cohesion: 0.13
Nodes (23): AdminPrices(), Draft, draftOf(), Pair(), Prices(), styles, ALL_HOURS, applyPricing() (+15 more)

### Community 2 - "layout.tsx"
Cohesion: 0.07
Nodes (89): expo-image, expo-router, react, react-native, styles, CompanionProfile(), styles, styles (+81 more)

### Community 3 - "booking.ts"
Cohesion: 0.08
Nodes (79): SelectDateTime(), styles, WEEK, Checkout(), newKey(), Step(), styles, BookingDetail() (+71 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (38): backgroundColor, foregroundImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption, typedRoutes (+30 more)

### Community 5 - "storage.ts"
Cohesion: 0.33
Nodes (5): expo-secure-store@~58.0.2, @react-native-async-storage/async-storage@2.2.0, expo-secure-store, @react-native-async-storage/async-storage, secure

### Community 6 - "package.json"
Cohesion: 0.09
Nodes (22): expo-constants@~58.0.13, expo-crypto@~58.0.7, expo-system-ui@~58.0.6, react-native-screens@~4.30.0, react-native-svg@15.16.0, react-native-url-polyfill@^4.0.0, react-native-webview@14.0.1, react-native-worklets@0.13.0 (+14 more)

### Community 7 - "Icon"
Cohesion: 0.07
Nodes (66): EditForm(), EditProfile(), Availability(), AvailabilityForm(), initial(), CompanionOnboarding(), EXTRA_TAGS, Review() (+58 more)

### Community 8 - "package.json"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "dependencies"
Cohesion: 0.07
Nodes (29): dependencies, expo@~58.0.20, expo-device@~58.0.5, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-image-picker@~58.0.10 (+21 more)

### Community 10 - "app/_layout.tsx"
Cohesion: 0.10
Nodes (23): expo-font@~58.0.10, expo-notifications@~58.1.8, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-notifications, expo-splash-screen (+15 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, noEmit, paths, strict, types, exclude (+2 more)

### Community 12 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, export:web, graph, ios, lint, start, test (+2 more)

### Community 13 - "e2e-supabase.mjs"
Cohesion: 0.10
Nodes (11): cand, card, [compId, memId], got, img, offer, fs, html (+3 more)

### Community 14 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

### Community 15 - "Text"
Cohesion: 0.08
Nodes (92): react-native-safe-area-context, @tanstack/react-query, Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins() (+84 more)

### Community 16 - "demo.ts"
Cohesion: 0.08
Nodes (21): allDays, bookings, day(), demo, DemoCompanion, demoIncoming, first(), incoming (+13 more)

### Community 17 - "types.ts"
Cohesion: 0.09
Nodes (25): AdminBooking, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, AuditEntry, Availability (+17 more)

### Community 19 - "Screen"
Cohesion: 0.07
Nodes (39): react-native-reanimated@4.7.1, react-native-reanimated, Login(), Wordmark(), Otp(), Pin(), styles, WEAK (+31 more)

### Community 20 - "pay/[bookingId].tsx"
Cohesion: 0.27
Nodes (10): METHODS, styles, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet() (+2 more)

### Community 21 - "pin.ts"
Cohesion: 0.40
Nodes (8): checkLocalPin(), clearLocalPin(), hasLocalPin(), key(), MAX_PIN_TRIES, setLocalPin(), triesKey(), sessionUser()

### Community 22 - "SessionUser"
Cohesion: 0.67
Nodes (3): SessionUser, AuthResult, SessionState

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 240 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `layout.tsx` to `prices.tsx`, `booking.ts`, `storage.ts`, `package.json`, `Icon`, `dependencies`, `app/_layout.tsx`, `Text`, `Screen`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11956521739130435 - nodes in this community are weakly interconnected._
- **Why does `Text()` connect `Icon` to `prices.tsx`, `layout.tsx`, `booking.ts`, `app/_layout.tsx`, `Text`, `Screen`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `prices.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13230769230769232 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `dependencies` to `Screen`, `e2e-supabase.mjs`, `package.json`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06668307086614174 - nodes in this community are weakly interconnected._