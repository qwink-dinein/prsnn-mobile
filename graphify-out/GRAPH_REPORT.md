# Graph Report - prsnn-mobile  (2026-11-14)

## Corpus Check
- 136 files · ~134,008 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 998 nodes · 4877 edges · 44 communities (28 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bf6efc1e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- demoAdmin.ts
- onboarding.tsx
- colors
- booking.ts
- expo
- session.ts
- profile.tsx
- plans.tsx
- devDependencies
- dependencies
- expo-status-bar
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- Text
- demo.ts
- types.ts
- package.json
- verification.ts
- LocationFields.tsx
- journey.py
- space
- chat.ts
- IdentityForm.tsx
- layout.tsx
- react-native
- expo-system-ui@~58.0.6
- states.tsx
- @react-native-community/netinfo
- pay/[bookingId].tsx
- expo@~58.0.20
- expo-crypto
- expo-font
- expo-image-picker
- expo-linking@~58.0.14
- expo-notifications
- expo-secure-store
- react-native-gesture-handler
- react-native-webview
- react-native-worklets@0.13.0
- @supabase/supabase-js
- zod@^4.6.7

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

## Communities (44 total, 16 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.11
Nodes (22): BroadcastRecord, activity, allDays, bk(), bookings, broadcasts, chats, day() (+14 more)

### Community 1 - "onboarding.tsx"
Cohesion: 0.06
Nodes (91): expo-linear-gradient, Row(), CategoryPage(), styles, CompanionProfile(), styles, INTERESTS, Step (+83 more)

### Community 2 - "colors"
Cohesion: 0.14
Nodes (19): expo-haptics, styles, DOT_FADE, DOT_SETTLE, styles, PULSE, styles, PULSE (+11 more)

### Community 3 - "booking.ts"
Cohesion: 0.08
Nodes (75): SelectDateTime(), BookingDetail(), styles, Chat(), time(), Confirmed(), styles, initial() (+67 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (38): backgroundColor, foregroundImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption, typedRoutes (+30 more)

### Community 5 - "session.ts"
Cohesion: 0.17
Nodes (21): @react-native-async-storage/async-storage, loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken(), checkLocalPin() (+13 more)

### Community 6 - "profile.tsx"
Cohesion: 0.14
Nodes (17): AppEffects(), RootLayout(), styles, styles, Ask, ConfirmOptions, ConfirmProvider(), Ctx (+9 more)

### Community 7 - "plans.tsx"
Cohesion: 0.13
Nodes (17): react-native-safe-area-context, AdminActivity(), styles, AdminAdmins(), styles, Tab, AdminBroadcast(), AdminLayout() (+9 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, expo-constants@~58.0.13, expo-device@~58.0.5, @expo-google-fonts/lora@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-linear-gradient@~58.0.3, expo-router@~58.0.27 (+14 more)

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
Nodes (147): Activity(), priceDiff(), short(), Admins(), Approvals(), AdminBookingDetail(), CompanionPicker(), PersonLink() (+139 more)

### Community 16 - "demo.ts"
Cohesion: 0.07
Nodes (28): AppNotification, Policy, Profile, SessionUser, AuthResult, Backend, allDays, bookings (+20 more)

### Community 17 - "types.ts"
Cohesion: 0.07
Nodes (37): BookingTab, AdminBooking, AdminChatMessage, AdminOverview, AdminPerson, AdminUser, AllocationState, ApprovalStatus (+29 more)

### Community 19 - "package.json"
Cohesion: 0.12
Nodes (16): @expo-google-fonts/dm-sans@^0.4.2, expo-splash-screen@~58.0.11, react-native-screens@~4.30.0, react-native-svg@15.16.0, react-native-url-polyfill@^4.0.0, zustand@^5.0.16, main, name (+8 more)

### Community 20 - "verification.ts"
Cohesion: 0.29
Nodes (9): VerificationStatus, companionStatusLine(), ID_TYPES, idCheckValue(), idTypeLabel(), idUploadError(), isLiveCompanion(), needsBack() (+1 more)

### Community 21 - "LocationFields.tsx"
Cohesion: 0.13
Nodes (27): AreaSheet(), CitySheet(), Dropdown(), fold(), LocationFields(), NoMatch(), Row(), Sheet() (+19 more)

### Community 22 - "journey.py"
Cohesion: 0.07
Nodes (31): city_pill(), day_trips(), plan_rows(), b64(), bar(), chat_screen(), dots(), keypad() (+23 more)

### Community 23 - "space"
Cohesion: 0.15
Nodes (22): expo-router, react, @tanstack/react-query, styles, EMPTY, styles, styles, styles (+14 more)

### Community 24 - "chat.ts"
Cohesion: 0.17
Nodes (12): ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status, toMessage(), useChat(), DEMO (+4 more)

### Community 25 - "IdentityForm.tsx"
Cohesion: 0.26
Nodes (11): identityComplete(), IdentityValue, styles, GENDER_OPTIONS, hasIdentity(), SEE_OPTIONS, VISIBILITY_COPY, needsSetup() (+3 more)

### Community 26 - "layout.tsx"
Cohesion: 0.14
Nodes (18): expo-image, PERKS, styles, PHOTOS, Splash(), styles, OPTIONS, R (+10 more)

### Community 27 - "react-native"
Cohesion: 0.13
Nodes (18): react-native, Draft, styles, ID_COPY, styles, styles, Props, styles (+10 more)

### Community 29 - "states.tsx"
Cohesion: 0.12
Nodes (14): Filter, ICON, styles, connectOnlineManager(), LIVE_INTERVAL, OfflineBanner(), POP, ProgressBar() (+6 more)

### Community 31 - "pay/[bookingId].tsx"
Cohesion: 0.27
Nodes (10): METHODS, styles, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet() (+2 more)

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 291 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `onboarding.tsx`, `colors`, `booking.ts`, `profile.tsx`, `plans.tsx`, `LocationFields.tsx`, `space`, `IdentityForm.tsx`, `layout.tsx`, `react-native`, `states.tsx`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `onboarding.tsx`, `colors`, `booking.ts`, `session.ts`, `profile.tsx`, `plans.tsx`, `dependencies`, `Text`, `package.json`, `LocationFields.tsx`, `space`, `chat.ts`, `IdentityForm.tsx`, `layout.tsx`, `states.tsx`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `onboarding.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.056251102098395345 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `@supabase/supabase-js` to `chat.ts`, `package.json`, `e2e-supabase.mjs`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `colors` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._