# Graph Report - prsnn-mobile  (2026-11-09)

## Corpus Check
- 105 files · ~58,931 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 758 nodes · 3599 edges · 20 communities (19 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `53b915d4`
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
- Icon
- package.json
- dependencies
- app/_layout.tsx
- compilerOptions
- scripts
- pack-web.js
- jest
- Text
- demo.ts
- types.ts
- chat.ts

## God Nodes (most connected - your core abstractions)
1. `Text()` - 141 edges
2. `Icon` - 79 edges
3. `Button()` - 71 edges
4. `Header()` - 71 edges
5. `errorMessage()` - 70 edges
6. `react-native` - 69 edges
7. `useSession` - 66 edges
8. `colors` - 64 edges
9. `space` - 56 edges
10. `Screen()` - 55 edges

## Surprising Connections (you probably didn't know these)
- `tab()` --calls--> `Icon`  [EXTRACTED]
  src/app/(tabs)/_layout.tsx → src/components/ui/Icon.tsx
- `TabsLayout()` --calls--> `useSession`  [EXTRACTED]
  src/app/(tabs)/_layout.tsx → src/state/session.ts
- `HomeTab()` --calls--> `CompanionDashboard()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/fellow/Dashboard.tsx
- `Discover()` --calls--> `CompanionCard()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/companions.tsx
- `Discover()` --calls--> `Icon`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/ui/Icon.tsx

## Import Cycles
- None detected.

## Communities (20 total, 1 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.11
Nodes (21): backend, activity, allDays, bk(), bookings, broadcasts, chats, day() (+13 more)

### Community 1 - "companion/[id].tsx"
Cohesion: 0.08
Nodes (48): AdminPrices(), Draft, draftOf(), Pair(), Prices(), styles, CompanionProfile(), styles (+40 more)

### Community 2 - "layout.tsx"
Cohesion: 0.08
Nodes (76): expo-image, expo-linear-gradient, expo-router, react, react-native, react-native-safe-area-context, @tanstack/react-query, styles (+68 more)

### Community 3 - "booking.ts"
Cohesion: 0.07
Nodes (92): Checkout(), newKey(), Step(), styles, BookingDetail(), styles, Chat(), time() (+84 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (38): backgroundColor, foregroundImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption, typedRoutes (+30 more)

### Community 5 - "session.ts"
Cohesion: 0.21
Nodes (9): @react-native-async-storage/async-storage@2.2.0, @react-native-async-storage/async-storage, Role, SessionUser, setApiToken(), secure, AuthResult, Prefs (+1 more)

### Community 6 - "push.ts"
Cohesion: 0.29
Nodes (5): expo-constants@~58.0.13, expo-device@~58.0.5, expo-constants, expo-device, DEMO

### Community 7 - "Icon"
Cohesion: 0.06
Nodes (63): Availability(), AvailabilityForm(), initial(), CompanionOnboarding(), EXTRA_TAGS, Review(), STEPS, Steps() (+55 more)

### Community 8 - "package.json"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "dependencies"
Cohesion: 0.06
Nodes (46): dependencies, expo@~58.0.20, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-image-picker@~58.0.10, expo-linear-gradient@~58.0.3 (+38 more)

### Community 10 - "app/_layout.tsx"
Cohesion: 0.12
Nodes (20): expo-font@~58.0.10, expo-notifications@~58.1.8, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-notifications, expo-splash-screen (+12 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, noEmit, paths, strict, types, exclude (+2 more)

### Community 12 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, export:web, graph, ios, lint, start, test (+2 more)

### Community 13 - "pack-web.js"
Cohesion: 0.25
Nodes (5): fs, html, js, mime, path

### Community 14 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

### Community 15 - "Text"
Cohesion: 0.07
Nodes (104): Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Admins(), AdminBookingDetail() (+96 more)

### Community 16 - "demo.ts"
Cohesion: 0.09
Nodes (20): toDateKey(), allDays, bookings, day(), demo, DemoCompanion, demoIncoming, first() (+12 more)

### Community 17 - "types.ts"
Cohesion: 0.11
Nodes (26): BookingTab, AdminBooking, AdminChatMessage, AdminOverview, AdminPerson, AdminUser, AllocationState, AppNotification (+18 more)

### Community 19 - "chat.ts"
Cohesion: 0.14
Nodes (15): socket.io-client@^4.8.3, socket.io-client, ChatMessage, api, ApiError, getApiToken(), Method, request() (+7 more)

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 220 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `companion/[id].tsx`, `layout.tsx`, `booking.ts`, `Icon`, `app/_layout.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11333333333333333 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `companion/[id].tsx`, `booking.ts`, `session.ts`, `push.ts`, `Icon`, `dependencies`, `app/_layout.tsx`, `Text`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `companion/[id].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Why does `useSession` connect `Text` to `demoAdmin.ts`, `companion/[id].tsx`, `layout.tsx`, `booking.ts`, `session.ts`, `Icon`, `app/_layout.tsx`, `demo.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07654090979661543 - nodes in this community are weakly interconnected._