# Graph Report - prsnn-mobile  (2026-11-09)

## Corpus Check
- 67 files · ~28,129 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 478 nodes · 2066 edges · 25 communities (21 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `94a19fca`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Text
- chat/[bookingId].tsx
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
- session.ts
- jest
- types.ts
- react-native-webview
- demo.ts
- notifications.tsx
- index.ts
- api.ts
- eslint.config.js
- expo-system-ui@~58.0.6
- react-native-svg
- socket.io-client

## God Nodes (most connected - your core abstractions)
1. `Text()` - 92 edges
2. `Icon` - 55 edges
3. `useSession` - 51 edges
4. `Button()` - 49 edges
5. `react-native` - 44 edges
6. `Header()` - 43 edges
7. `Screen()` - 43 edges
8. `errorMessage()` - 43 edges
9. `colors` - 42 edges
10. `space` - 38 edges

## Surprising Connections (you probably didn't know these)
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `Login()` --calls--> `Logo()`  [EXTRACTED]
  src/app/login.tsx → src/components/ui/layout.tsx
- `Login()` --calls--> `displayPhone()`  [EXTRACTED]
  src/app/login.tsx → src/domain/phone.ts
- `Login()` --calls--> `normaliseIndianMobile()`  [EXTRACTED]
  src/app/login.tsx → src/domain/phone.ts
- `Otp()` --calls--> `displayPhone()`  [EXTRACTED]
  src/app/otp.tsx → src/domain/phone.ts

## Import Cycles
- None detected.

## Communities (25 total, 4 thin omitted)

### Community 0 - "Text"
Cohesion: 0.13
Nodes (54): DeleteAccount(), EditForm(), EditProfile(), styles, Apply(), Availability(), AvailabilityForm(), initial() (+46 more)

### Community 1 - "chat/[bookingId].tsx"
Cohesion: 0.29
Nodes (10): Chat(), styles, time(), idOf(), ChatMessage, getApiToken(), demoThread(), MAX_MESSAGE_LENGTH (+2 more)

### Community 2 - "layout.tsx"
Cohesion: 0.09
Nodes (52): expo-haptics, expo-image, expo-router, react, react-native, styles, PERKS, styles (+44 more)

### Community 3 - "booking.ts"
Cohesion: 0.12
Nodes (59): @tanstack/react-query, SelectDateTime(), styles, WEEK, Review(), styles, BookingDetail(), styles (+51 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (38): backgroundColor, foregroundImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption, typedRoutes (+30 more)

### Community 5 - "companion/[id].tsx"
Cohesion: 0.13
Nodes (29): CompanionProfile(), styles, Saved(), Discover(), HomeTab(), PLANS, styles, SearchTab() (+21 more)

### Community 6 - "package.json"
Cohesion: 0.12
Nodes (16): expo@~58.0.20, @expo-google-fonts/dm-sans@^0.4.2, expo-secure-store@~58.0.2, react-dom@19.3.0, react-native-screens@~4.30.0, zustand@^5.0.16, main, name (+8 more)

### Community 7 - "pay/[bookingId].tsx"
Cohesion: 0.27
Nodes (10): METHODS, styles, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet() (+2 more)

### Community 8 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0, @types/jest@^30.0.0, @types/react@~19.3.0, typescript@~6.0.3, jest (+5 more)

### Community 9 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, expo-constants@~58.0.13, @expo-google-fonts/lora@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-image-picker@~58.0.10, expo-linear-gradient@~58.0.3, expo-linking@~58.0.14 (+14 more)

### Community 10 - "app/_layout.tsx"
Cohesion: 0.17
Nodes (12): expo-font@~58.0.10, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, react-native-safe-area-context@~5.10.1, expo-font, expo-splash-screen, expo-status-bar (+4 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, noEmit, paths, strict, types, exclude (+2 more)

### Community 12 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, export:web, graph, ios, lint, start, test (+2 more)

### Community 13 - "session.ts"
Cohesion: 0.25
Nodes (7): @react-native-async-storage/async-storage, Role, SessionUser, secure, AuthResult, Prefs, SessionState

### Community 14 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

### Community 15 - "types.ts"
Cohesion: 0.21
Nodes (9): Availability, BookingStatus, Companion, DayKey, PaymentStatus, PersonRef, ProfileCheck, VerificationStatus (+1 more)

### Community 17 - "demo.ts"
Cohesion: 0.17
Nodes (8): allDays, bookings, companions, day(), demoIncoming, incoming, me, notifications

### Community 18 - "notifications.tsx"
Cohesion: 0.25
Nodes (9): Filter, ICON, inFilter(), Notifications(), styles, Segmented(), ago(), AppNotification (+1 more)

### Community 19 - "index.ts"
Cohesion: 0.22
Nodes (7): API_URL, DEMO, SOCKET_URL, backend, CompanionForm, PaymentIntent, demo

### Community 20 - "api.ts"
Cohesion: 0.29
Nodes (6): api, ApiError, Method, request(), setApiToken(), toForm()

### Community 21 - "eslint.config.js"
Cohesion: 0.29
Nodes (6): { defineConfig }, expoConfig, eslint@^9.0.0, eslint-config-expo@~58.0.4, eslint, eslint-config-expo

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 142 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `layout.tsx` to `Text`, `chat/[bookingId].tsx`, `booking.ts`, `companion/[id].tsx`, `package.json`, `pay/[bookingId].tsx`, `dependencies`, `session.ts`, `notifications.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `Text` be split into smaller, more focused modules?**
  _Cohesion score 0.12542372881355932 - nodes in this community are weakly interconnected._
- **Why does `react` connect `layout.tsx` to `Text`, `chat/[bookingId].tsx`, `booking.ts`, `companion/[id].tsx`, `package.json`, `pay/[bookingId].tsx`, `dependencies`, `app/_layout.tsx`, `notifications.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08858024691358024 - nodes in this community are weakly interconnected._
- **Why does `Text()` connect `Text` to `chat/[bookingId].tsx`, `layout.tsx`, `booking.ts`, `companion/[id].tsx`, `pay/[bookingId].tsx`, `notifications.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `booking.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11842650103519668 - nodes in this community are weakly interconnected._