# Graph Report - prsnn-mobile  (2026-11-09)

## Corpus Check
- 83 files · ~41,313 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 592 nodes · 2547 edges · 26 communities (21 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `919cf954`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- availability.tsx
- pack-web.js
- layout.tsx
- booking.ts
- expo
- session.ts
- package.json
- Text
- devDependencies
- dependencies
- app/_layout.tsx
- compilerOptions
- scripts
- Icon
- jest
- useSession
- demo.ts
- types.ts
- api.ts
- chat/[bookingId].tsx
- eslint.config.js
- react-native-screens@~4.30.0
- react-native-web@~0.21.4
- react-native-webview
- zod@^4.6.7

## God Nodes (most connected - your core abstractions)
1. `Text()` - 107 edges
2. `Icon` - 67 edges
3. `Button()` - 56 edges
4. `useSession` - 56 edges
5. `react-native` - 52 edges
6. `colors` - 50 edges
7. `Header()` - 49 edges
8. `Screen()` - 47 edges
9. `errorMessage()` - 47 edges
10. `space` - 43 edges

## Surprising Connections (you probably didn't know these)
- `BookingsTab()` --calls--> `BookingCard()`  [EXTRACTED]
  src/app/(tabs)/bookings.tsx → src/components/bookings.tsx
- `BookingsTab()` --calls--> `RequestCard()`  [EXTRACTED]
  src/app/(tabs)/bookings.tsx → src/components/fellow/RequestCard.tsx
- `BookingsTab()` --calls--> `Text()`  [EXTRACTED]
  src/app/(tabs)/bookings.tsx → src/components/ui/Text.tsx
- `Discover()` --calls--> `Icon`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/ui/Icon.tsx
- `Discover()` --calls--> `Avatar()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/ui/layout.tsx

## Import Cycles
- None detected.

## Communities (26 total, 5 thin omitted)

### Community 0 - "availability.tsx"
Cohesion: 0.25
Nodes (12): Availability(), AvailabilityForm(), initial(), AvailabilityEditor(), AvailabilityValue, emptyAvailability(), HOURS, styles (+4 more)

### Community 1 - "pack-web.js"
Cohesion: 0.25
Nodes (5): fs, html, js, mime, path

### Community 2 - "layout.tsx"
Cohesion: 0.08
Nodes (69): expo-haptics, expo-image, expo-linear-gradient, expo-router, react, react-native, react-native-safe-area-context, @tanstack/react-query (+61 more)

### Community 3 - "booking.ts"
Cohesion: 0.08
Nodes (69): SelectDateTime(), styles, WEEK, Checkout(), newKey(), Step(), styles, BookingDetail() (+61 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (38): backgroundColor, foregroundImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption, typedRoutes (+30 more)

### Community 5 - "session.ts"
Cohesion: 0.25
Nodes (7): @react-native-async-storage/async-storage, Role, SessionUser, setApiToken(), secure, Prefs, SessionState

### Community 6 - "package.json"
Cohesion: 0.12
Nodes (16): expo@~58.0.20, expo-image-picker@~58.0.10, expo-linking@~58.0.14, expo-secure-store@~58.0.2, react-native-svg@15.16.0, socket.io-client@^4.8.3, main, name (+8 more)

### Community 7 - "Text"
Cohesion: 0.09
Nodes (49): react-native-reanimated@4.7.1, react-native-reanimated, DeleteAccount(), EditForm(), EditProfile(), Apply(), Verification(), DOT_FADE (+41 more)

### Community 8 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0, @types/jest@^30.0.0, @types/react@~19.3.0, typescript@~6.0.3, jest (+5 more)

### Community 9 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, expo-constants@~58.0.13, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-linear-gradient@~58.0.3, expo-router@~58.0.27 (+16 more)

### Community 10 - "app/_layout.tsx"
Cohesion: 0.20
Nodes (11): expo-font@~58.0.10, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-splash-screen, expo-status-bar, react-native-gesture-handler (+3 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, noEmit, paths, strict, types, exclude (+2 more)

### Community 12 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, export:web, graph, ios, lint, start, test (+2 more)

### Community 13 - "Icon"
Cohesion: 0.10
Nodes (43): CompanionOnboarding(), EXTRA_TAGS, Review(), STEPS, Steps(), styles, Upload(), Privacy() (+35 more)

### Community 14 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

### Community 15 - "useSession"
Cohesion: 0.12
Nodes (42): CompanionProfile(), Earnings(), styles, inFilter(), Notifications(), Saved(), BookingsTab(), styles (+34 more)

### Community 16 - "demo.ts"
Cohesion: 0.10
Nodes (17): allDays, bookings, DemoCompanion, demoIncoming, first(), incoming, keys, me (+9 more)

### Community 17 - "types.ts"
Cohesion: 0.14
Nodes (17): AllocationState, AppNotification, BookingStatus, Companion, NotificationType, PaymentStatus, Policy, ProfileCheck (+9 more)

### Community 19 - "api.ts"
Cohesion: 0.18
Nodes (9): api, ApiError, Method, request(), toForm(), API_URL, DEMO, LINKS (+1 more)

### Community 20 - "chat/[bookingId].tsx"
Cohesion: 0.29
Nodes (10): Chat(), styles, time(), idOf(), ChatMessage, getApiToken(), demoThread(), MAX_MESSAGE_LENGTH (+2 more)

### Community 21 - "eslint.config.js"
Cohesion: 0.29
Nodes (6): { defineConfig }, expoConfig, eslint@^9.0.0, eslint-config-expo@~58.0.4, eslint, eslint-config-expo

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 181 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `layout.tsx` to `availability.tsx`, `booking.ts`, `session.ts`, `package.json`, `Text`, `dependencies`, `Icon`, `useSession`, `chat/[bookingId].tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07555555555555556 - nodes in this community are weakly interconnected._
- **Why does `Text()` connect `Text` to `availability.tsx`, `layout.tsx`, `booking.ts`, `app/_layout.tsx`, `Icon`, `useSession`, `chat/[bookingId].tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Should `booking.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08069620253164557 - nodes in this community are weakly interconnected._
- **Why does `react` connect `layout.tsx` to `availability.tsx`, `booking.ts`, `package.json`, `Text`, `dependencies`, `app/_layout.tsx`, `Icon`, `useSession`, `chat/[bookingId].tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `expo` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._