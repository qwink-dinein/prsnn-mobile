# Graph Report - prsnn-mobile  (2026-11-10)

## Corpus Check
- 134 files · ~132,853 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 987 nodes · 4830 edges · 31 communities (25 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a2b4055c`
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
- Text
- package.json
- dependencies
- expo-status-bar
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- Text
- demo.ts
- types.ts
- chat.ts
- verify-id.tsx
- pin.ts
- journey.py
- availability.tsx
- chat/[bookingId].tsx
- flow.ts
- eslint.config.js
- @expo-google-fonts/dm-sans@^0.4.2
- expo-system-ui@~58.0.6
- react-dom@19.3.0
- @react-native-community/netinfo

## God Nodes (most connected - your core abstractions)
1. `Text()` - 185 edges
2. `Icon` - 108 edges
3. `errorMessage()` - 95 edges
4. `Button()` - 94 edges
5. `react-native` - 85 edges
6. `Header()` - 83 edges
7. `colors` - 78 edges
8. `useSession` - 77 edges
9. `space` - 71 edges
10. `ErrorState()` - 64 edges

## Surprising Connections (you probably didn't know these)
- `CompanionOnboarding()` --indirect_call--> `categoryTitle()`  [INFERRED]
  src/app/fellow/onboarding.tsx → src/domain/categories.ts
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `HomeTab()` --calls--> `useSession`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/state/session.ts
- `Discover()` --calls--> `Icon`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/ui/Icon.tsx
- `Discover()` --calls--> `EmptyState()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/ui/layout.tsx

## Import Cycles
- None detected.

## Communities (31 total, 6 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.09
Nodes (26): BroadcastRecord, CityPlan, PanicAlert, backend, activity, allDays, bk(), bookings (+18 more)

### Community 1 - "companion/[id].tsx"
Cohesion: 0.06
Nodes (78): expo-linear-gradient, Row(), CategoryPage(), styles, CompanionProfile(), styles, Discover(), HomeTab() (+70 more)

### Community 2 - "layout.tsx"
Cohesion: 0.05
Nodes (98): expo-haptics, expo-image, expo-router, react, react-native, react-native-reanimated, styles, PERKS (+90 more)

### Community 3 - "booking.ts"
Cohesion: 0.10
Nodes (63): SelectDateTime(), styles, WEEK, BookingDetail(), styles, Confirmed(), styles, Earnings() (+55 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (38): backgroundColor, foregroundImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption, typedRoutes (+30 more)

### Community 5 - "session.ts"
Cohesion: 0.24
Nodes (6): expo-secure-store@~58.0.2, expo-secure-store, Role, setApiToken(), secure, Prefs

### Community 6 - "push.ts"
Cohesion: 0.20
Nodes (9): expo-constants@~58.0.13, expo-device@~58.0.5, expo-notifications@~58.1.8, expo-constants, expo-device, expo-notifications, DEMO, openFromPush() (+1 more)

### Community 7 - "Text"
Cohesion: 0.06
Nodes (101): react-native-safe-area-context, @tanstack/react-query, Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins() (+93 more)

### Community 8 - "package.json"
Cohesion: 0.11
Nodes (23): expo-font@~58.0.10, react-native-gesture-handler@~3.3.0, zustand@^5.0.16, devDependencies, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0, @types/jest@^30.0.0 (+15 more)

### Community 9 - "dependencies"
Cohesion: 0.06
Nodes (34): dependencies, expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/lora@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-image-picker@~58.0.10, expo-linear-gradient@~58.0.3 (+26 more)

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

### Community 15 - "Text"
Cohesion: 0.06
Nodes (122): CompanionPicker(), Broadcast(), AdminOverview(), BLINK, Money(), PanicBanner(), styles, Plans() (+114 more)

### Community 16 - "demo.ts"
Cohesion: 0.08
Nodes (22): Profile, Backend, allDays, bookings, companionStatus(), day(), demo, DemoCompanion (+14 more)

### Community 17 - "types.ts"
Cohesion: 0.07
Nodes (32): BookingTab, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, ApprovalStatus, AuditEntry (+24 more)

### Community 19 - "chat.ts"
Cohesion: 0.18
Nodes (9): @react-native-async-storage/async-storage@2.2.0, react-native-url-polyfill@^4.0.0, @supabase/supabase-js@^2.119.0, @react-native-async-storage/async-storage, react-native-url-polyfill, @supabase/supabase-js, SUPABASE_KEY, SUPABASE_URL (+1 more)

### Community 20 - "verify-id.tsx"
Cohesion: 0.20
Nodes (15): Phase, styles, ProfileTab(), styles, seeLabel(), IdType, companionStatusLine(), ID_TYPES (+7 more)

### Community 21 - "pin.ts"
Cohesion: 0.44
Nodes (9): checkLocalPin(), clearLocalPin(), hash(), hasLocalPin(), key(), MAX_PIN_TRIES, norm(), setLocalPin() (+1 more)

### Community 22 - "journey.py"
Cohesion: 0.07
Nodes (31): city_pill(), day_trips(), plan_rows(), b64(), bar(), chat_screen(), dots(), keypad() (+23 more)

### Community 23 - "availability.tsx"
Cohesion: 0.26
Nodes (12): Availability(), AvailabilityForm(), initial(), AvailabilityEditor(), AvailabilityValue, emptyAvailability(), HOURS, styles (+4 more)

### Community 24 - "chat/[bookingId].tsx"
Cohesion: 0.27
Nodes (10): Chat(), styles, time(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status (+2 more)

### Community 25 - "flow.ts"
Cohesion: 0.36
Nodes (8): hasIdentity(), needsSetup(), SessionUser, afterAuth(), afterPin(), goHome(), AuthResult, SessionState

### Community 26 - "eslint.config.js"
Cohesion: 0.29
Nodes (6): { defineConfig }, expoConfig, eslint@^9.0.0, eslint-config-expo@~58.0.4, eslint, eslint-config-expo

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 291 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `companion/[id].tsx`, `layout.tsx`, `booking.ts`, `Text`, `verify-id.tsx`, `availability.tsx`, `chat/[bookingId].tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0896551724137931 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `companion/[id].tsx`, `booking.ts`, `session.ts`, `push.ts`, `Text`, `package.json`, `dependencies`, `Text`, `chat.ts`, `verify-id.tsx`, `availability.tsx`, `chat/[bookingId].tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `companion/[id].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06108442004118051 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `chat.ts` to `package.json`, `e2e-supabase.mjs`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05005049938278532 - nodes in this community are weakly interconnected._