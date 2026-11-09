# Graph Report - prsnn-mobile  (2026-11-09)

## Corpus Check
- 86 files · ~44,420 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 625 nodes · 2706 edges · 22 communities (19 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `512ab63d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.ts
- companion/[id].tsx
- layout.tsx
- components/bookings.tsx
- expo
- session.ts
- package.json
- Text
- devDependencies
- dependencies
- app/_layout.tsx
- compilerOptions
- scripts
- setup-profile.tsx
- jest
- booking.ts
- demo.ts
- types.ts
- api.ts
- expo-constants@~58.0.13
- react-native-worklets@0.13.0

## God Nodes (most connected - your core abstractions)
1. `Text()` - 113 edges
2. `Icon` - 73 edges
3. `useSession` - 56 edges
4. `Button()` - 55 edges
5. `react-native` - 53 edges
6. `colors` - 51 edges
7. `Header()` - 47 edges
8. `errorMessage()` - 47 edges
9. `Screen()` - 45 edges
10. `space` - 44 edges

## Surprising Connections (you probably didn't know these)
- `HOURS` --calls--> `fromMinutes()`  [EXTRACTED]
  src/components/fellow/AvailabilityEditor.tsx → src/domain/booking.ts
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `SelectDateTime()` --calls--> `PackageGrid()`  [EXTRACTED]
  src/app/book/[id].tsx → src/components/PackageGrid.tsx
- `SelectDateTime()` --calls--> `Button()`  [EXTRACTED]
  src/app/book/[id].tsx → src/components/ui/Button.tsx
- `SelectDateTime()` --calls--> `Header()`  [EXTRACTED]
  src/app/book/[id].tsx → src/components/ui/layout.tsx

## Import Cycles
- None detected.

## Communities (22 total, 3 thin omitted)

### Community 0 - "index.ts"
Cohesion: 0.21
Nodes (9): EditProfile(), styles, Profile, UploadFile, pickImage(), backend, CompanionForm, PaymentIntent (+1 more)

### Community 1 - "companion/[id].tsx"
Cohesion: 0.07
Nodes (48): fs, html, js, mime, path, Checkout(), newKey(), Step() (+40 more)

### Community 2 - "layout.tsx"
Cohesion: 0.06
Nodes (76): expo-haptics, expo-image, expo-linear-gradient, expo-router, react, react-native, react-native-reanimated, react-native-safe-area-context (+68 more)

### Community 3 - "components/bookings.tsx"
Cohesion: 0.14
Nodes (43): BookingDetail(), styles, Chat(), time(), Confirmed(), styles, METHODS, Pay() (+35 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (38): backgroundColor, foregroundImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption, typedRoutes (+30 more)

### Community 5 - "session.ts"
Cohesion: 0.25
Nodes (7): @react-native-async-storage/async-storage, Role, SessionUser, secure, AuthResult, Prefs, SessionState

### Community 6 - "package.json"
Cohesion: 0.11
Nodes (18): @expo-google-fonts/lora@^0.4.2, expo-image-picker@~58.0.10, expo-secure-store@~58.0.2, react-dom@19.3.0, react-native-screens@~4.30.0, react-native-svg@15.16.0, socket.io-client@^4.8.3, main (+10 more)

### Community 7 - "Text"
Cohesion: 0.10
Nodes (66): DeleteAccount(), EditForm(), Apply(), Availability(), AvailabilityForm(), initial(), CompanionOnboarding(), EXTRA_TAGS (+58 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, expo@~58.0.20, @expo-google-fonts/dm-sans@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-linear-gradient@~58.0.3, expo-linking@~58.0.14, expo-router@~58.0.27 (+18 more)

### Community 10 - "app/_layout.tsx"
Cohesion: 0.15
Nodes (15): expo-font@~58.0.10, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, @tanstack/react-query@^5.105.0, expo-font, expo-splash-screen, expo-status-bar (+7 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, noEmit, paths, strict, types, exclude (+2 more)

### Community 12 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, export:web, graph, ios, lint, start, test (+2 more)

### Community 13 - "setup-profile.tsx"
Cohesion: 0.13
Nodes (21): Step, styles, IdentityValue, styles, AREAS, areasFor(), ALL_PLACES, cityCount (+13 more)

### Community 14 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

### Community 15 - "booking.ts"
Cohesion: 0.08
Nodes (60): SelectDateTime(), styles, WEEK, Earnings(), styles, Filter, ICON, inFilter() (+52 more)

### Community 16 - "demo.ts"
Cohesion: 0.10
Nodes (18): allDays, bookings, day(), DemoCompanion, demoIncoming, first(), incoming, keys (+10 more)

### Community 17 - "types.ts"
Cohesion: 0.18
Nodes (12): AllocationState, AppNotification, Availability, BookingStatus, PaymentStatus, PersonRef, Policy, ProfileCheck (+4 more)

### Community 19 - "api.ts"
Cohesion: 0.14
Nodes (15): ChatMessage, api, ApiError, getApiToken(), Method, request(), setApiToken(), toForm() (+7 more)

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 187 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `layout.tsx` to `index.ts`, `companion/[id].tsx`, `components/bookings.tsx`, `session.ts`, `package.json`, `Text`, `dependencies`, `setup-profile.tsx`, `booking.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `companion/[id].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07380520266182698 - nodes in this community are weakly interconnected._
- **Why does `Text()` connect `Text` to `index.ts`, `companion/[id].tsx`, `layout.tsx`, `components/bookings.tsx`, `app/_layout.tsx`, `setup-profile.tsx`, `booking.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06348086757185682 - nodes in this community are weakly interconnected._
- **Why does `expo-router` connect `layout.tsx` to `index.ts`, `companion/[id].tsx`, `components/bookings.tsx`, `package.json`, `Text`, `dependencies`, `app/_layout.tsx`, `setup-profile.tsx`, `booking.ts`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `components/bookings.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13860544217687074 - nodes in this community are weakly interconnected._