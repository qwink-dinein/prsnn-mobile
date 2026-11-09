# Graph Report - prsnn-mobile  (2026-11-09)

## Corpus Check
- 71 files · ~31,330 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 505 nodes · 2109 edges · 20 communities (15 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `af52bbd8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- booking.ts
- pack-web.js
- layout.tsx
- booking.ts
- expo
- companion/[id].tsx
- package.json
- pay/[bookingId].tsx
- devDependencies
- dependencies
- app/_layout.tsx
- compilerOptions
- scripts
- expo-secure-store
- jest
- react-native-worklets@0.13.0
- zustand
- api.ts
- react-native-svg

## God Nodes (most connected - your core abstractions)
1. `Text()` - 93 edges
2. `Icon` - 55 edges
3. `useSession` - 51 edges
4. `Button()` - 50 edges
5. `react-native` - 45 edges
6. `Header()` - 43 edges
7. `Screen()` - 43 edges
8. `errorMessage()` - 43 edges
9. `colors` - 42 edges
10. `space` - 38 edges

## Surprising Connections (you probably didn't know these)
- `SessionState` --references--> `SessionUser`  [EXTRACTED]
  src/state/session.ts → src/domain/types.ts
- `Login()` --calls--> `Enter()`  [EXTRACTED]
  src/app/login.tsx → src/components/ui/motion.tsx
- `Login()` --calls--> `useShake()`  [EXTRACTED]
  src/app/login.tsx → src/components/ui/motion.tsx
- `Pin()` --calls--> `Icon`  [EXTRACTED]
  src/app/pin.tsx → src/components/ui/Icon.tsx
- `Pin()` --calls--> `Header()`  [EXTRACTED]
  src/app/pin.tsx → src/components/ui/layout.tsx

## Import Cycles
- None detected.

## Communities (20 total, 5 thin omitted)

### Community 0 - "booking.ts"
Cohesion: 0.08
Nodes (49): SelectDateTime(), styles, WEEK, Availability(), AvailabilityForm(), initial(), CompanionOnboarding(), EXTRA_TAGS (+41 more)

### Community 1 - "pack-web.js"
Cohesion: 0.25
Nodes (5): fs, html, js, mime, path

### Community 2 - "layout.tsx"
Cohesion: 0.07
Nodes (71): expo-haptics, expo-image, expo-router, react, react-native, react-native-reanimated, styles, styles (+63 more)

### Community 3 - "booking.ts"
Cohesion: 0.12
Nodes (81): Review(), styles, BookingDetail(), styles, Chat(), CompanionProfile(), Confirmed(), DeleteAccount() (+73 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (38): backgroundColor, foregroundImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption, typedRoutes (+30 more)

### Community 5 - "companion/[id].tsx"
Cohesion: 0.16
Nodes (15): @react-native-async-storage/async-storage@2.2.0, @react-native-async-storage/async-storage, styles, CompanionCard(), CompanionRow(), firstName(), HeartButton(), Photo() (+7 more)

### Community 6 - "package.json"
Cohesion: 0.12
Nodes (16): expo@~58.0.20, @expo-google-fonts/dm-sans@^0.4.2, expo-linear-gradient@~58.0.3, expo-linking@~58.0.14, react-dom@19.3.0, react-native-web@~0.21.4, main, name (+8 more)

### Community 7 - "pay/[bookingId].tsx"
Cohesion: 0.27
Nodes (10): METHODS, styles, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet() (+2 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, expo-constants@~58.0.13, @expo-google-fonts/lora@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-image-picker@~58.0.10, expo-router@~58.0.27, expo-system-ui@~58.0.6 (+15 more)

### Community 10 - "app/_layout.tsx"
Cohesion: 0.14
Nodes (14): expo-font@~58.0.10, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, react-native-safe-area-context@~5.10.1, @tanstack/react-query@^5.105.0, expo-font, expo-splash-screen (+6 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, noEmit, paths, strict, types, exclude (+2 more)

### Community 12 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, export:web, graph, ios, lint, start, test (+2 more)

### Community 14 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

### Community 17 - "api.ts"
Cohesion: 0.06
Nodes (46): styles, time(), Filter, ICON, inFilter(), styles, ago(), AppNotification (+38 more)

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 157 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `layout.tsx` to `booking.ts`, `booking.ts`, `companion/[id].tsx`, `package.json`, `pay/[bookingId].tsx`, `dependencies`, `api.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `booking.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07948568088836938 - nodes in this community are weakly interconnected._
- **Why does `expo-router` connect `layout.tsx` to `booking.ts`, `booking.ts`, `companion/[id].tsx`, `package.json`, `pay/[bookingId].tsx`, `dependencies`, `app/_layout.tsx`, `api.ts`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06534727408513816 - nodes in this community are weakly interconnected._
- **Why does `react` connect `layout.tsx` to `booking.ts`, `booking.ts`, `package.json`, `pay/[bookingId].tsx`, `dependencies`, `app/_layout.tsx`, `api.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `booking.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11585518102372035 - nodes in this community are weakly interconnected._