# Graph Report - prsnn-mobile  (2026-11-16)

## Corpus Check
- 186 files · ~308,746 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1625 nodes · 7395 edges · 63 communities (47 shown, 16 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 245 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0a08d56d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- home.tsx
- package.json
- motion.tsx
- expo
- session.ts
- landing.py
- dependencies
- devDependencies
- demoAdmin.ts
- layout.tsx
- compilerOptions
- scripts
- e2e-supabase.mjs
- admin.ts
- rules.ts
- demo.ts
- admin.tsx
- onboarding.tsx
- booking.ts
- screens_v2.py
- index.ts
- journey.py
- wallet_prices.py
- logo.py
- expo-crypto
- domain/pricing.ts
- @expo-google-fonts/dm-sans@^0.4.2
- wallet_variants.py
- bar
- body
- chat_keyboard.py
- btn
- expo-image-picker
- expo-linking@~58.0.14
- brand_screens.py
- errorMessage
- expo-notifications
- make_icons.py
- ic
- interest.ts
- pay/[bookingId].tsx
- card_systems.py
- wallet.tsx
- expo-status-bar
- react-native-url-polyfill
- logo_concepts.py
- view_as.py
- logo_luxe.py
- Text
- base64
- react-native-worklets@0.13.0
- states.tsx
- m_book
- preview.tsx
- jest
- expo@~58.0.20
- expo-constants
- expo-device
- @expo-google-fonts/urbanist@^0.4.2
- react-native-web@~0.21.4
- @supabase/supabase-js

## God Nodes (most connected - your core abstractions)
1. `Text()` - 206 edges
2. `body()` - 138 edges
3. `Icon` - 118 edges
4. `btn()` - 104 edges
5. `errorMessage()` - 103 edges
6. `ic()` - 102 edges
7. `Button()` - 98 edges
8. `react-native` - 96 edges
9. `colors` - 90 edges
10. `Header()` - 89 edges

## Surprising Connections (you probably didn't know these)
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `Chat()` --calls--> `whenOf()`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/bookings.tsx
- `Chat()` --calls--> `HoldButton()`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/PanicButton.tsx
- `Chat()` --calls--> `Icon`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/Icon.tsx
- `Chat()` --calls--> `Avatar()`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/layout.tsx

## Import Cycles
- None detected.

## Communities (63 total, 16 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.06
Nodes (42): BusyTime, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, Availability, BookingStatus (+34 more)

### Community 1 - "home.tsx"
Cohesion: 0.06
Nodes (55): open(), Discover(), greeting(), HomeTab(), styles, SignedOut(), tab(), TabsLayout() (+47 more)

### Community 2 - "package.json"
Cohesion: 0.11
Nodes (18): expo-font@~58.0.10, @expo-google-fonts/lora@^0.4.2, react-dom@19.3.0, @react-native-async-storage/async-storage@2.2.0, react-native-gesture-handler@~3.3.0, react-native-screens@~4.30.0, zustand@^5.0.16, main (+10 more)

### Community 3 - "motion.tsx"
Cohesion: 0.08
Nodes (31): Chat(), styles, time(), bob, EASE_OUT, easeOutQuart(), fadeOnly, fadeUp (+23 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (47): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+39 more)

### Community 5 - "session.ts"
Cohesion: 0.16
Nodes (22): expo-secure-store@~58.0.2, expo-secure-store, loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken() (+14 more)

### Community 6 - "landing.py"
Cohesion: 0.34
Nodes (17): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+9 more)

### Community 7 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, @expo-google-fonts/outfit@^0.4.3, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-linear-gradient@~58.0.3, expo-router@~58.0.27, expo-splash-screen@~58.0.11, expo-system-ui@~58.0.6 (+16 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (28): AuditEntry, BroadcastRecord, CityPlan, PanicAlert, Backend, activity, allDays, bk() (+20 more)

### Community 10 - "layout.tsx"
Cohesion: 0.07
Nodes (71): expo-haptics, expo-image, expo-linear-gradient, react, react-native, react-native-reanimated, react-native-safe-area-context, FILTERS (+63 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, noEmit, paths, strict, types, exclude (+2 more)

### Community 12 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, export:web, graph, ios, lint, start, test (+2 more)

### Community 13 - "e2e-supabase.mjs"
Cohesion: 0.09
Nodes (14): fs, book(), cand, card, [compId, memId], got, img, offer (+6 more)

### Community 14 - "admin.ts"
Cohesion: 0.24
Nodes (13): AdminAction, adminBookingState(), BookingTab, can(), canActOn(), describeAction(), isStaff(), isSuperadmin() (+5 more)

### Community 15 - "rules.ts"
Cohesion: 0.33
Nodes (8): agreedAt(), Consent, ConsentKind, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

### Community 16 - "demo.ts"
Cohesion: 0.07
Nodes (26): SessionUser, AuthResult, allDays, bookings, companionStatus(), day(), demo, DemoCompanion (+18 more)

### Community 17 - "admin.tsx"
Cohesion: 0.10
Nodes (35): AdminAdmins(), Admins(), styles, AdminBookingDetail(), CompanionPicker(), PersonLink(), Sheet, styles (+27 more)

### Community 18 - "onboarding.tsx"
Cohesion: 0.06
Nodes (71): Row(), initial(), CompanionOnboarding(), INTERESTS, Line(), Options(), Step, STEPS (+63 more)

### Community 19 - "booking.ts"
Cohesion: 0.05
Nodes (110): BookingDetail(), styles, CompanionProfile(), styles, Confirmed(), styles, Earnings(), EarningsScreen() (+102 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "index.ts"
Cohesion: 0.10
Nodes (33): expo-router, @tanstack/react-query, EMPTY, styles, styles, AdminOverview(), BLINK, Money() (+25 more)

### Community 22 - "journey.py"
Cohesion: 0.07
Nodes (31): city_pill(), day_trips(), plan_rows(), b64(), bar(), chat_screen(), dots(), keypad() (+23 more)

### Community 23 - "wallet_prices.py"
Cohesion: 0.29
Nodes (12): big_card(), cta(), header(), ic(), p_companion(), p_lift(), p_stack(), p_swipe() (+4 more)

### Community 24 - "logo.py"
Cohesion: 0.47
Nodes (3): letters(), monogram(), wordmark()

### Community 26 - "domain/pricing.ts"
Cohesion: 0.06
Nodes (56): CategoryPage(), perks(), styles, DeckCard(), Dot(), HomeCategories(), styles, a11y() (+48 more)

### Community 28 - "wallet_variants.py"
Cohesion: 0.20
Nodes (14): row(), screen(), bell(), card(), guilloche(), head(), logo(), tabs() (+6 more)

### Community 29 - "bar"
Cohesion: 0.12
Nodes (54): avatar(), bar(), card(), checkbox(), chips(), field(), label(), pill() (+46 more)

### Community 30 - "body"
Cohesion: 0.16
Nodes (43): body(), group(), h(), row(), s_admin(), s_admin_booking(), s_bookings(), s_dashboard() (+35 more)

### Community 31 - "chat_keyboard.py"
Cohesion: 0.38
Nodes (3): composer(), header(), svg()

### Community 32 - "btn"
Cohesion: 0.15
Nodes (39): btn(), foot(), notice(), s_book_time(), s_companion(), s_confirmed(), s_email(), s_otp() (+31 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 36 - "errorMessage"
Cohesion: 0.13
Nodes (40): Activity(), AdminActivity(), priceDiff(), short(), styles, Approvals(), styles, Tab (+32 more)

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 40 - "interest.ts"
Cohesion: 0.27
Nodes (10): AppSignups(), Counts(), APPROVAL, categoryTitle(), MEET, roleLabel(), SignupChoices, signupDetails() (+2 more)

### Community 41 - "pay/[bookingId].tsx"
Cohesion: 0.25
Nodes (8): baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySuccess, styles, externalTarget()

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "wallet.tsx"
Cohesion: 0.29
Nodes (7): react-native-svg@15.16.0, react-native-svg, Guilloche, Material, MaterialCard(), MATERIALS, styles

### Community 46 - "logo_concepts.py"
Cohesion: 0.19
Nodes (10): card(), diamond(), diamond_only(), face_to_face(), pin_p(), svg(), two_seats(), uid() (+2 more)

### Community 47 - "view_as.py"
Cohesion: 0.26
Nodes (10): s_action(), s_companion_dash(), s_companion_onb(), s_exit(), s_member_book(), s_member_home(), s_pick(), s_switch() (+2 more)

### Community 48 - "logo_luxe.py"
Cohesion: 0.29
Nodes (9): card(), cut(), gem(), linked(), signature(), svg(), uid(), word() (+1 more)

### Community 49 - "Text"
Cohesion: 0.11
Nodes (68): Prices(), ReviewCompanion(), AdminUserDetail(), Agreements(), ViewAs(), SelectDateTime(), Checkout(), newKey() (+60 more)

### Community 50 - "base64"
Cohesion: 0.11
Nodes (10): pair(), phone(), section(), font_card(), icon(), mark(), bodoni_italic(), gem() (+2 more)

### Community 52 - "states.tsx"
Cohesion: 0.10
Nodes (18): Data, DATA, STARTS, styles, WHO, REASONS, styles, EASE_OUT_CSS (+10 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "preview.tsx"
Cohesion: 0.24
Nodes (14): DEMO, endPreview(), go(), PreviewAs, PreviewStart, routeFor(), sampleUser(), startLivePreview() (+6 more)

### Community 57 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

## Knowledge Gaps
- **2 isolated node(s):** `COMMUNITY_IMAGE`, `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 399 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `home.tsx`, `motion.tsx`, `errorMessage`, `interest.ts`, `layout.tsx`, `admin.tsx`, `onboarding.tsx`, `booking.ts`, `states.tsx`, `index.ts`, `preview.tsx`, `domain/pricing.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `COMMUNITY_IMAGE`, `expo/tsconfig.base` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.061979648473635525 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `home.tsx`, `package.json`, `motion.tsx`, `errorMessage`, `session.ts`, `dependencies`, `pay/[bookingId].tsx`, `wallet.tsx`, `admin.tsx`, `Text`, `booking.ts`, `states.tsx`, `index.ts`, `onboarding.tsx`, `preview.tsx`, `domain/pricing.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `home.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06298904538341157 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `@supabase/supabase-js` to `home.tsx`, `package.json`, `motion.tsx`, `e2e-supabase.mjs`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._