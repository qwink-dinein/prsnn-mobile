# Graph Report - prsnn-mobile  (2026-11-15)

## Corpus Check
- 175 files · ~303,689 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1571 nodes · 7167 edges · 66 communities (51 shown, 15 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 244 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0786242c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- admin.tsx
- layout.tsx
- components/bookings.tsx
- expo
- session.ts
- package.json
- devDependencies
- demoAdmin.ts
- Header
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- admin.ts
- demo.ts
- chat/[bookingId].tsx
- useSession
- screens_v2.py
- booking.ts
- journey.py
- search.tsx
- RequestCard.tsx
- errorMessage
- companion/[id].tsx
- Text
- landing.py
- bar
- body
- brand_directions.py
- btn
- motion.tsx
- make_icons.py
- brand_screens.py
- expo@~58.0.20
- Text.tsx
- wordmark_dot.py
- ic
- profile.tsx
- pay/[bookingId].tsx
- card_systems.py
- @expo-google-fonts/dm-sans@^0.4.2
- @expo-google-fonts/lora@^0.4.2
- pathlib
- logo_concepts.py
- view_as.py
- logo_luxe.py
- formatINR
- wordmarks.py
- categories.py
- app/_layout.tsx
- m_book
- states.tsx
- dependencies
- rules.ts
- expo-haptics
- expo-image-picker
- expo-notifications
- expo-secure-store
- react-native-reanimated
- react-native-url-polyfill
- react-native-web@~0.21.4
- @supabase/supabase-js
- zustand

## God Nodes (most connected - your core abstractions)
1. `Text()` - 203 edges
2. `body()` - 138 edges
3. `Icon` - 116 edges
4. `btn()` - 104 edges
5. `errorMessage()` - 103 edges
6. `ic()` - 102 edges
7. `Button()` - 98 edges
8. `react-native` - 95 edges
9. `Header()` - 89 edges
10. `colors` - 89 edges

## Surprising Connections (you probably didn't know these)
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `Chat()` --calls--> `typing`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/motion.tsx
- `HomeTab()` --calls--> `useSession`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/state/session.ts
- `Discover()` --calls--> `CompanionCard()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/companions.tsx
- `Discover()` --calls--> `HomeCategories()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/HomeCategories.tsx

## Import Cycles
- None detected.

## Communities (66 total, 15 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.07
Nodes (39): IdentityValue, SEE_OPTIONS, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, ApprovalStatus, Availability (+31 more)

### Community 1 - "admin.tsx"
Cohesion: 0.10
Nodes (52): AdminAdmins(), Admins(), styles, AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap() (+44 more)

### Community 2 - "layout.tsx"
Cohesion: 0.08
Nodes (64): expo-image, expo-linear-gradient, expo-router, react, react-native, styles, Tab, STARTS (+56 more)

### Community 3 - "components/bookings.tsx"
Cohesion: 0.23
Nodes (23): BookingDetail(), styles, Confirmed(), styles, OfferSummary(), PanicScreen(), BookingCard(), MetaLine() (+15 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (44): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+36 more)

### Community 5 - "session.ts"
Cohesion: 0.17
Nodes (22): @react-native-async-storage/async-storage@2.2.0, @react-native-async-storage/async-storage, loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken() (+14 more)

### Community 7 - "package.json"
Cohesion: 0.10
Nodes (20): expo-constants@~58.0.13, expo-font@~58.0.10, expo-linking@~58.0.14, expo-splash-screen@~58.0.11, react-native-screens@~4.30.0, react-native-svg@15.16.0, react-native-worklets@0.13.0, zod@^4.6.7 (+12 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (28): AuditEntry, BroadcastRecord, CityPlan, PanicAlert, Backend, activity, allDays, bk() (+20 more)

### Community 10 - "Header"
Cohesion: 0.13
Nodes (25): AdminPrices(), Draft, draftOf(), Pair(), Prices(), styles, DeleteAccount(), Availability() (+17 more)

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

### Community 15 - "admin.ts"
Cohesion: 0.13
Nodes (25): AdminAction, adminBookingState(), BookingTab, can(), canActOn(), describeAction(), isStaff(), isSuperadmin() (+17 more)

### Community 16 - "demo.ts"
Cohesion: 0.07
Nodes (25): AppNotification, Policy, allDays, bookings, companionStatus(), day(), demo, DemoCompanion (+17 more)

### Community 17 - "chat/[bookingId].tsx"
Cohesion: 0.12
Nodes (15): mergeMessages(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status, toMessage(), useChat() (+7 more)

### Community 19 - "useSession"
Cohesion: 0.25
Nodes (16): AppEffects(), tab(), TabsLayout(), MessagesTab(), styles, Avatar(), canChat(), isMineAsCompanion() (+8 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "booking.ts"
Cohesion: 0.10
Nodes (34): SelectDateTime(), HomeTab(), AvailabilityEditor(), AvailabilityValue, HOURS, styles, WEEK_DAYS, CompanionDashboard() (+26 more)

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "search.tsx"
Cohesion: 0.05
Nodes (59): SearchTab(), styles, Dot(), HomeCategories(), styles, AreaSheet(), CitySheet(), fold() (+51 more)

### Community 24 - "RequestCard.tsx"
Cohesion: 0.33
Nodes (10): BookingsTab(), styles, TABS, RequestCard(), styles, useNow(), canComplete(), startsAt() (+2 more)

### Community 25 - "errorMessage"
Cohesion: 0.10
Nodes (56): react-native-safe-area-context, @tanstack/react-query, Activity(), AdminActivity(), priceDiff(), short(), styles, Approvals() (+48 more)

### Community 26 - "companion/[id].tsx"
Cohesion: 0.07
Nodes (61): CompanionProfile(), styles, perks(), CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton() (+53 more)

### Community 27 - "Text"
Cohesion: 0.10
Nodes (63): EMPTY, Plans(), Row(), styles, ViewAs(), Checkout(), newKey(), RELATIONS (+55 more)

### Community 28 - "landing.py"
Cohesion: 0.09
Nodes (43): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+35 more)

### Community 29 - "bar"
Cohesion: 0.12
Nodes (54): avatar(), bar(), card(), checkbox(), chips(), field(), label(), pill() (+46 more)

### Community 30 - "body"
Cohesion: 0.16
Nodes (43): body(), group(), h(), row(), s_admin(), s_admin_booking(), s_bookings(), s_dashboard() (+35 more)

### Community 31 - "brand_directions.py"
Cohesion: 0.33
Nodes (3): pair(), phone(), section()

### Community 32 - "btn"
Cohesion: 0.15
Nodes (39): btn(), foot(), notice(), s_book_time(), s_companion(), s_confirmed(), s_email(), s_otp() (+31 more)

### Community 33 - "motion.tsx"
Cohesion: 0.13
Nodes (16): bob, EASE_OUT, EASE_OUT_CSS, easeOutQuart(), fadeOnly, fadeUp, FillLine(), fromLeft (+8 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 37 - "Text.tsx"
Cohesion: 0.18
Nodes (17): Chat(), styles, time(), ActiveAlert(), HoldButton(), PanicButton(), PULSE, styles (+9 more)

### Community 38 - "wordmark_dot.py"
Cohesion: 0.60
Nodes (3): font_card(), icon(), mark()

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 40 - "profile.tsx"
Cohesion: 0.13
Nodes (23): ProfileTab(), styles, VerificationStatus, companionStatusLine(), ID_TYPES, idCheckValue(), idTypeLabel(), idUploadError() (+15 more)

### Community 41 - "pay/[bookingId].tsx"
Cohesion: 0.24
Nodes (10): react-native-webview@14.0.1, react-native-webview, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet() (+2 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 45 - "pathlib"
Cohesion: 0.19
Nodes (6): composer(), header(), svg(), letters(), monogram(), wordmark()

### Community 46 - "logo_concepts.py"
Cohesion: 0.19
Nodes (10): card(), diamond(), diamond_only(), face_to_face(), pin_p(), svg(), two_seats(), uid() (+2 more)

### Community 47 - "view_as.py"
Cohesion: 0.26
Nodes (10): s_action(), s_companion_dash(), s_companion_onb(), s_exit(), s_member_book(), s_member_home(), s_pick(), s_switch() (+2 more)

### Community 48 - "logo_luxe.py"
Cohesion: 0.29
Nodes (9): card(), cut(), gem(), linked(), signature(), svg(), uid(), word() (+1 more)

### Community 49 - "formatINR"
Cohesion: 0.16
Nodes (17): AdminOverview(), BLINK, Money(), PanicBanner(), styles, Phase, styles, VerifyId() (+9 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 52 - "app/_layout.tsx"
Cohesion: 0.24
Nodes (10): Splash(), RootLayout(), styles, ConfirmProvider(), connectOnlineManager(), setUnauthorizedHandler(), MAX_APP_WIDTH, useAppWidth() (+2 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "states.tsx"
Cohesion: 0.20
Nodes (10): LIVE_INTERVAL, OfflineBanner(), POP, ProgressBar(), PULSE, RING, SLIDE, styles (+2 more)

### Community 55 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, expo-crypto@~58.0.7, expo-device@~58.0.5, @expo-google-fonts/outfit@^0.4.3, @expo-google-fonts/urbanist@^0.4.2, expo-image@~58.0.17, expo-linear-gradient@~58.0.3, expo-router@~58.0.27 (+18 more)

### Community 56 - "rules.ts"
Cohesion: 0.33
Nodes (8): agreedAt(), Consent, ConsentKind, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

## Knowledge Gaps
- **2 isolated node(s):** `expo/tsconfig.base`, `COMMUNITY_IMAGE`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 387 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `admin.tsx`, `layout.tsx`, `components/bookings.tsx`, `Text.tsx`, `profile.tsx`, `Header`, `formatINR`, `useSession`, `app/_layout.tsx`, `booking.ts`, `states.tsx`, `search.tsx`, `RequestCard.tsx`, `errorMessage`, `companion/[id].tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base`, `COMMUNITY_IMAGE` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07053140096618357 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `admin.tsx`, `components/bookings.tsx`, `session.ts`, `package.json`, `Header`, `chat/[bookingId].tsx`, `useSession`, `booking.ts`, `search.tsx`, `RequestCard.tsx`, `errorMessage`, `companion/[id].tsx`, `Text`, `motion.tsx`, `Text.tsx`, `profile.tsx`, `pay/[bookingId].tsx`, `formatINR`, `app/_layout.tsx`, `states.tsx`, `dependencies`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `admin.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10445468509984639 - nodes in this community are weakly interconnected._
- **Why does `expo-router` connect `layout.tsx` to `admin.tsx`, `components/bookings.tsx`, `+not-found.tsx`, `package.json`, `Header`, `admin.ts`, `chat/[bookingId].tsx`, `useSession`, `search.tsx`, `RequestCard.tsx`, `errorMessage`, `companion/[id].tsx`, `Text`, `Text.tsx`, `profile.tsx`, `formatINR`, `app/_layout.tsx`, `states.tsx`, `dependencies`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07961564859299931 - nodes in this community are weakly interconnected._