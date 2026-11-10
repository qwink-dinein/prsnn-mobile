# Graph Report - prsnn-mobile  (2026-11-10)

## Corpus Check
- 134 files · ~132,704 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 985 nodes · 4822 edges · 23 communities (22 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d85e06d5`
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
- app/_layout.tsx
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- search.tsx
- demo.ts
- types.ts
- chat.ts
- AreaSheet
- pin.ts
- journey.py

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
- `restep()` --calls--> `dots()`  [EXTRACTED]
  scripts/design/journey.py → scripts/design/flows.py
- `mobile_screen()` --calls--> `ticks()`  [EXTRACTED]
  scripts/design/journey.py → scripts/design/flows.py
- `area_sheet()` --calls--> `bar()`  [EXTRACTED]
  scripts/design/journey.py → scripts/design/flows.py

## Import Cycles
- None detected.

## Communities (23 total, 1 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.09
Nodes (26): AdminUser, AuditEntry, BroadcastRecord, CityPlan, backend, activity, allDays, bk() (+18 more)

### Community 1 - "companion/[id].tsx"
Cohesion: 0.07
Nodes (75): Row(), SelectDateTime(), styles, WEEK, Checkout(), newKey(), RELATIONS, Step() (+67 more)

### Community 2 - "layout.tsx"
Cohesion: 0.05
Nodes (135): expo-haptics, expo-image, expo-linear-gradient, expo-router, react, react-native, react-native-reanimated, react-native-safe-area-context (+127 more)

### Community 3 - "booking.ts"
Cohesion: 0.06
Nodes (81): BookingDetail(), styles, Chat(), time(), Confirmed(), Earnings(), styles, METHODS (+73 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (38): backgroundColor, foregroundImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption, typedRoutes (+30 more)

### Community 5 - "session.ts"
Cohesion: 0.19
Nodes (9): expo-secure-store@~58.0.2, expo-secure-store, Role, SessionUser, setApiToken(), secure, AuthResult, Prefs (+1 more)

### Community 6 - "push.ts"
Cohesion: 0.20
Nodes (9): expo-constants@~58.0.13, expo-device@~58.0.5, expo-notifications@~58.1.8, expo-constants, expo-device, expo-notifications, DEMO, openFromPush() (+1 more)

### Community 7 - "Text"
Cohesion: 0.06
Nodes (127): Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Admins(), Approvals() (+119 more)

### Community 8 - "package.json"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "dependencies"
Cohesion: 0.06
Nodes (48): dependencies, expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-image-picker@~58.0.10 (+40 more)

### Community 10 - "app/_layout.tsx"
Cohesion: 0.13
Nodes (20): expo-font@~58.0.10, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-status-bar, react-native-gesture-handler, Splash(), AppEffects() (+12 more)

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

### Community 15 - "search.tsx"
Cohesion: 0.07
Nodes (51): Pin(), Privacy(), PrivacyForm(), styles, identityComplete(), IdentityForm(), IdentityValue, styles (+43 more)

### Community 16 - "demo.ts"
Cohesion: 0.08
Nodes (22): Backend, allDays, bookings, companionStatus(), day(), demo, DemoCompanion, demoIncoming (+14 more)

### Community 17 - "types.ts"
Cohesion: 0.07
Nodes (31): AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, ApprovalStatus, Availability, BookingStatus (+23 more)

### Community 19 - "chat.ts"
Cohesion: 0.12
Nodes (17): @react-native-async-storage/async-storage@2.2.0, react-native-url-polyfill@^4.0.0, @supabase/supabase-js@^2.119.0, @react-native-async-storage/async-storage, react-native-url-polyfill, @supabase/supabase-js, ChatMessage, demoThread() (+9 more)

### Community 20 - "AreaSheet"
Cohesion: 0.46
Nodes (8): AreaSheet(), CitySheet(), fold(), NoMatch(), Row(), Sheet(), StateSheet(), titleCase()

### Community 21 - "pin.ts"
Cohesion: 0.29
Nodes (13): PanicScreen(), PinCheck(), checkLocalPin(), clearLocalPin(), hash(), hasLocalPin(), key(), MAX_PIN_TRIES (+5 more)

### Community 22 - "journey.py"
Cohesion: 0.07
Nodes (31): city_pill(), day_trips(), plan_rows(), b64(), bar(), chat_screen(), dots(), keypad() (+23 more)

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 290 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `companion/[id].tsx`, `layout.tsx`, `booking.ts`, `app/_layout.tsx`, `search.tsx`, `AreaSheet`, `pin.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0896551724137931 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `companion/[id].tsx`, `booking.ts`, `session.ts`, `push.ts`, `Text`, `dependencies`, `app/_layout.tsx`, `search.tsx`, `chat.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `companion/[id].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06942053930005737 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `chat.ts` to `dependencies`, `e2e-supabase.mjs`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.051867443868739205 - nodes in this community are weakly interconnected._