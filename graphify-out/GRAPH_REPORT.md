# Graph Report - prsnn-mobile  (2026-11-09)

## Corpus Check
- 66 files · ~27,403 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 470 nodes · 2039 edges · 17 communities (15 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Text
- session.ts
- layout.tsx
- booking.ts
- expo
- companion/[id].tsx
- dependencies
- onboarding.tsx
- devDependencies
- package.json
- app/_layout.tsx
- compilerOptions
- scripts
- storage.ts
- jest
- react-native-screens@~4.30.0
- react-native-webview

## God Nodes (most connected - your core abstractions)
1. `Text()` - 90 edges
2. `Icon` - 53 edges
3. `useSession` - 51 edges
4. `Button()` - 47 edges
5. `react-native` - 43 edges
6. `Screen()` - 43 edges
7. `Header()` - 43 edges
8. `errorMessage()` - 43 edges
9. `colors` - 41 edges
10. `space` - 37 edges

## Surprising Connections (you probably didn't know these)
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `tab()` --calls--> `Icon`  [EXTRACTED]
  src/app/(tabs)/_layout.tsx → src/components/ui/Icon.tsx
- `TabsLayout()` --calls--> `useSession`  [EXTRACTED]
  src/app/(tabs)/_layout.tsx → src/state/session.ts
- `BookingsTab()` --calls--> `EmptyState()`  [EXTRACTED]
  src/app/(tabs)/bookings.tsx → src/components/ui/layout.tsx
- `BookingsTab()` --calls--> `ErrorState()`  [EXTRACTED]
  src/app/(tabs)/bookings.tsx → src/components/ui/layout.tsx

## Import Cycles
- None detected.

## Communities (17 total, 2 thin omitted)

### Community 0 - "Text"
Cohesion: 0.13
Nodes (52): expo-router, react, DeleteAccount(), EditForm(), EditProfile(), styles, Apply(), COPY (+44 more)

### Community 1 - "session.ts"
Cohesion: 0.05
Nodes (49): Chat(), styles, time(), idOf(), AppNotification, Availability, Booking, BookingStatus (+41 more)

### Community 2 - "layout.tsx"
Cohesion: 0.08
Nodes (50): expo-image, react-native, react-native-safe-area-context, PERKS, styles, PHOTOS, Splash(), styles (+42 more)

### Community 3 - "booking.ts"
Cohesion: 0.11
Nodes (54): @tanstack/react-query, SelectDateTime(), styles, WEEK, Review(), styles, BookingDetail(), styles (+46 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (37): backgroundColor, foregroundImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption, typedRoutes (+29 more)

### Community 5 - "companion/[id].tsx"
Cohesion: 0.15
Nodes (31): CompanionProfile(), styles, Earnings(), styles, Saved(), Discover(), HomeTab(), PLANS (+23 more)

### Community 6 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, expo@~58.0.20, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, expo-image@~58.0.17, expo-image-picker@~58.0.10, expo-router@~58.0.27, expo-system-ui@~58.0.6 (+15 more)

### Community 7 - "onboarding.tsx"
Cohesion: 0.20
Nodes (18): Availability(), AvailabilityForm(), initial(), CompanionOnboarding(), EXTRA_TAGS, Review(), STEPS, Steps() (+10 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "package.json"
Cohesion: 0.11
Nodes (18): expo-constants@~58.0.13, expo-haptics@~58.0.7, expo-linear-gradient@~58.0.3, expo-linking@~58.0.14, react-native-web@~0.21.4, socket.io-client@^4.8.3, zod@^4.6.7, main (+10 more)

### Community 10 - "app/_layout.tsx"
Cohesion: 0.18
Nodes (11): expo-font@~58.0.10, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-splash-screen, expo-status-bar, react-native-gesture-handler (+3 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, noEmit, paths, strict, types, exclude (+2 more)

### Community 12 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, export:web, graph, ios, lint, start, test (+2 more)

### Community 13 - "storage.ts"
Cohesion: 0.33
Nodes (5): expo-secure-store@~58.0.2, @react-native-async-storage/async-storage@2.2.0, expo-secure-store, @react-native-async-storage/async-storage, secure

### Community 14 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 137 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `layout.tsx` to `Text`, `session.ts`, `booking.ts`, `companion/[id].tsx`, `dependencies`, `onboarding.tsx`, `package.json`, `storage.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `Text` be split into smaller, more focused modules?**
  _Cohesion score 0.1347806422433288 - nodes in this community are weakly interconnected._
- **Why does `expo-router` connect `Text` to `session.ts`, `layout.tsx`, `booking.ts`, `companion/[id].tsx`, `dependencies`, `onboarding.tsx`, `package.json`, `app/_layout.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `session.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05472636815920398 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Text` to `session.ts`, `layout.tsx`, `booking.ts`, `companion/[id].tsx`, `dependencies`, `onboarding.tsx`, `package.json`, `app/_layout.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07740384615384616 - nodes in this community are weakly interconnected._