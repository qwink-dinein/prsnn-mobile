# Graph Report - prsnn-mobile  (2026-11-09)

## Corpus Check
- 104 files · ~58,194 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 752 nodes · 3567 edges · 23 communities (21 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3879f805`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- demoAdmin.ts
- booking.ts
- layout.tsx
- components/bookings.tsx
- expo
- storage.ts
- RazorpaySheet.tsx
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
- eslint.config.js
- react-native-worklets@0.13.0
- flow.ts

## God Nodes (most connected - your core abstractions)
1. `Text()` - 141 edges
2. `Icon` - 79 edges
3. `Button()` - 71 edges
4. `Header()` - 71 edges
5. `errorMessage()` - 70 edges
6. `react-native` - 66 edges
7. `useSession` - 66 edges
8. `colors` - 64 edges
9. `space` - 56 edges
10. `Screen()` - 55 edges

## Surprising Connections (you probably didn't know these)
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `usePricing()` --indirect_call--> `pricing()`  [INFERRED]
  src/lib/pricing.ts → src/domain/pricing.ts
- `TabsLayout()` --calls--> `useSession`  [EXTRACTED]
  src/app/(tabs)/_layout.tsx → src/state/session.ts
- `BookingsTab()` --calls--> `BookingCard()`  [EXTRACTED]
  src/app/(tabs)/bookings.tsx → src/components/bookings.tsx
- `BookingsTab()` --calls--> `RequestCard()`  [EXTRACTED]
  src/app/(tabs)/bookings.tsx → src/components/fellow/RequestCard.tsx

## Import Cycles
- None detected.

## Communities (23 total, 2 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.10
Nodes (23): BroadcastRecord, Role, activity, allDays, bk(), bookings, broadcasts, chats (+15 more)

### Community 1 - "booking.ts"
Cohesion: 0.06
Nodes (85): SelectDateTime(), styles, WEEK, Checkout(), newKey(), Step(), styles, CompanionProfile() (+77 more)

### Community 2 - "layout.tsx"
Cohesion: 0.06
Nodes (96): expo-haptics, expo-image, expo-router, react, react-native, react-native-safe-area-context, @tanstack/react-query, styles (+88 more)

### Community 3 - "components/bookings.tsx"
Cohesion: 0.14
Nodes (42): BookingDetail(), styles, Chat(), time(), Confirmed(), MessagesTab(), ProfileTab(), styles (+34 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (38): backgroundColor, foregroundImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption, typedRoutes (+30 more)

### Community 5 - "storage.ts"
Cohesion: 0.33
Nodes (5): expo-secure-store@~58.0.2, @react-native-async-storage/async-storage@2.2.0, expo-secure-store, @react-native-async-storage/async-storage, secure

### Community 6 - "RazorpaySheet.tsx"
Cohesion: 0.31
Nodes (8): baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet(), RazorpaySuccess, styles

### Community 7 - "Icon"
Cohesion: 0.08
Nodes (58): CompanionOnboarding(), EXTRA_TAGS, Review(), STEPS, Steps(), styles, Upload(), Pin() (+50 more)

### Community 8 - "package.json"
Cohesion: 0.11
Nodes (23): @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, expo-image-picker@~58.0.10, devDependencies, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0, @types/jest@^30.0.0 (+15 more)

### Community 9 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, expo@~58.0.20, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-linear-gradient@~58.0.3, expo-linking@~58.0.14, expo-router@~58.0.27, expo-system-ui@~58.0.6 (+24 more)

### Community 10 - "app/_layout.tsx"
Cohesion: 0.14
Nodes (16): expo-font@~58.0.10, expo-notifications@~58.1.8, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-notifications, expo-splash-screen (+8 more)

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
Cohesion: 0.08
Nodes (100): Activity(), AdminActivity(), short(), styles, AdminAdmins(), Admins(), AdminBookingDetail(), CompanionPicker() (+92 more)

### Community 16 - "demo.ts"
Cohesion: 0.09
Nodes (19): allDays, bookings, day(), demo, DemoCompanion, demoIncoming, first(), incoming (+11 more)

### Community 17 - "types.ts"
Cohesion: 0.10
Nodes (27): AdminBooking, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, AuditEntry, Booking (+19 more)

### Community 19 - "chat.ts"
Cohesion: 0.13
Nodes (15): expo-constants@~58.0.13, expo-device@~58.0.5, socket.io-client@^4.8.3, expo-constants, expo-device, socket.io-client, ChatMessage, getApiToken() (+7 more)

### Community 20 - "eslint.config.js"
Cohesion: 0.29
Nodes (6): { defineConfig }, expoConfig, eslint@^9.0.0, eslint-config-expo@~58.0.4, eslint, eslint-config-expo

### Community 22 - "flow.ts"
Cohesion: 0.67
Nodes (3): SessionUser, AuthResult, SessionState

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 218 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `booking.ts`, `layout.tsx`, `components/bookings.tsx`, `Icon`, `app/_layout.tsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10256410256410256 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `booking.ts`, `components/bookings.tsx`, `storage.ts`, `RazorpaySheet.tsx`, `Icon`, `package.json`, `dependencies`, `Text`, `chat.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `booking.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05595959595959596 - nodes in this community are weakly interconnected._
- **Why does `react` connect `layout.tsx` to `booking.ts`, `components/bookings.tsx`, `RazorpaySheet.tsx`, `Icon`, `package.json`, `dependencies`, `app/_layout.tsx`, `Text`, `chat.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05989607935758148 - nodes in this community are weakly interconnected._