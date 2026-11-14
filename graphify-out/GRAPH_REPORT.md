# Graph Report - prsnn-mobile  (2026-11-14)

## Corpus Check
- 159 files · ~292,567 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1463 nodes · 6711 edges · 50 communities (48 shown, 2 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 243 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `641df809`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- demoAdmin.ts
- domain/pricing.ts
- admin.tsx
- verify-id.tsx
- expo
- session.ts
- Loading
- useSession
- devDependencies
- package.json
- errorMessage
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- Text
- demo.ts
- types.ts
- app/_layout.tsx
- screens_v2.py
- booking.ts
- journey.py
- tokens.ts
- chat.ts
- plans.tsx
- formatINR
- layout.tsx
- landing.py
- bar
- body
- pay/[bookingId].tsx
- btn
- CompanionDashboard
- verification.ts
- brand_screens.py
- push.ts
- ic
- card_systems.py
- review.tsx
- pathlib
- logo_concepts.py
- view_as.py
- logo_luxe.py
- admin.ts
- wordmarks.py
- categories.py
- m_book
- chat_keyboard.py

## God Nodes (most connected - your core abstractions)
1. `Text()` - 188 edges
2. `body()` - 138 edges
3. `Icon` - 110 edges
4. `btn()` - 104 edges
5. `ic()` - 102 edges
6. `errorMessage()` - 95 edges
7. `Button()` - 94 edges
8. `react-native` - 88 edges
9. `bar()` - 84 edges
10. `Header()` - 83 edges

## Surprising Connections (you probably didn't know these)
- `CompanionOnboarding()` --indirect_call--> `categoryTitle()`  [INFERRED]
  src/app/fellow/onboarding.tsx → src/domain/categories.ts
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `HomeTab()` --calls--> `useSession`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/state/session.ts
- `Discover()` --calls--> `BellButton()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/ui/layout.tsx
- `Discover()` --calls--> `EmptyState()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/ui/layout.tsx

## Import Cycles
- None detected.

## Communities (50 total, 2 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.09
Nodes (27): AuditEntry, BroadcastRecord, CityPlan, PanicAlert, Backend, activity, allDays, bk() (+19 more)

### Community 1 - "domain/pricing.ts"
Cohesion: 0.21
Nodes (14): applyPricing(), BASE_RATE, companionShareOf(), DEFAULT_PRICING, HEADLINE_HOURS, listeners, PACKAGE_PRICES, platformShareOf() (+6 more)

### Community 2 - "admin.tsx"
Cohesion: 0.12
Nodes (48): AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap(), AdminOverview(), BLINK, styles (+40 more)

### Community 3 - "verify-id.tsx"
Cohesion: 0.15
Nodes (39): BookingDetail(), styles, Chat(), time(), Confirmed(), OfferSummary(), Phase, styles (+31 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption (+31 more)

### Community 5 - "session.ts"
Cohesion: 0.21
Nodes (18): loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), checkLocalPin(), clearLocalPin(), forgetSavedSession(), hash() (+10 more)

### Community 6 - "Loading"
Cohesion: 0.12
Nodes (17): Availability(), Privacy(), Loading(), EASE_OUT, EASE_OUT_CSS, fadeOnly, fadeUp, ScaleProps (+9 more)

### Community 7 - "useSession"
Cohesion: 0.14
Nodes (17): react-native-safe-area-context, styles, OPTIONS, R, Role(), styles, Saved(), SearchTab() (+9 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "package.json"
Cohesion: 0.05
Nodes (53): dependencies, expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/outfit@^0.4.3, @expo-google-fonts/urbanist@^0.4.2, expo-haptics@~58.0.7 (+45 more)

### Community 10 - "errorMessage"
Cohesion: 0.14
Nodes (37): Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Admins(), styles (+29 more)

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
Cohesion: 0.05
Nodes (121): PanicBanner(), Plans(), Row(), CategoryPage(), CompanionProfile(), EditForm(), EditProfile(), styles (+113 more)

### Community 16 - "demo.ts"
Cohesion: 0.09
Nodes (21): backend, allDays, bookings, companionStatus(), day(), demo, DemoCompanion, demoIncoming (+13 more)

### Community 17 - "types.ts"
Cohesion: 0.07
Nodes (32): AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, ApprovalStatus, Availability, BookingStatus (+24 more)

### Community 19 - "app/_layout.tsx"
Cohesion: 0.13
Nodes (21): expo-font@~58.0.10, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-splash-screen, expo-status-bar, react-native-gesture-handler (+13 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "booking.ts"
Cohesion: 0.11
Nodes (32): SelectDateTime(), styles, WEEK, adminWhen(), AvailabilityValue, HOURS, styles, WEEK_DAYS (+24 more)

### Community 22 - "journey.py"
Cohesion: 0.09
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "tokens.ts"
Cohesion: 0.10
Nodes (46): expo-haptics, expo-router, react, react-native-reanimated, @tanstack/react-query, EMPTY, styles, FILTERS (+38 more)

### Community 24 - "chat.ts"
Cohesion: 0.32
Nodes (7): ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status, toMessage(), useChat()

### Community 25 - "plans.tsx"
Cohesion: 0.16
Nodes (13): EMPTY, styles, AdminPrices(), Draft, draftOf(), Pair(), Prices(), styles (+5 more)

### Community 26 - "formatINR"
Cohesion: 0.17
Nodes (23): Money(), styles, TAB_MATS, a11y(), BigCard(), MAT, matFor(), Props (+15 more)

### Community 27 - "layout.tsx"
Cohesion: 0.09
Nodes (35): expo-image, react-native, styles, PERKS, styles, ID_COPY, styles, PHOTOS (+27 more)

### Community 28 - "landing.py"
Cohesion: 0.10
Nodes (41): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+33 more)

### Community 29 - "bar"
Cohesion: 0.12
Nodes (54): avatar(), bar(), card(), checkbox(), chips(), field(), label(), pill() (+46 more)

### Community 30 - "body"
Cohesion: 0.16
Nodes (43): body(), group(), h(), row(), s_admin(), s_admin_booking(), s_bookings(), s_dashboard() (+35 more)

### Community 31 - "pay/[bookingId].tsx"
Cohesion: 0.27
Nodes (10): METHODS, styles, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet() (+2 more)

### Community 32 - "btn"
Cohesion: 0.15
Nodes (39): btn(), foot(), notice(), s_book_time(), s_companion(), s_confirmed(), s_email(), s_otp() (+31 more)

### Community 33 - "CompanionDashboard"
Cohesion: 0.20
Nodes (14): Earnings(), BookingsTab(), HomeTab(), CompanionDashboard(), Stat(), awaitingAnswer(), earningsFor(), isMineAsCompanion() (+6 more)

### Community 34 - "verification.ts"
Cohesion: 0.32
Nodes (6): VerificationStatus, companionStatusLine(), ID_TYPES, idCheckValue(), idTypeLabel(), isLiveCompanion()

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 37 - "push.ts"
Cohesion: 0.09
Nodes (19): expo-constants@~58.0.13, expo-device@~58.0.5, expo-notifications@~58.1.8, @react-native-async-storage/async-storage@2.2.0, react-native-url-polyfill@^4.0.0, @supabase/supabase-js@^2.119.0, expo-constants, expo-device (+11 more)

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 44 - "review.tsx"
Cohesion: 0.13
Nodes (21): Checkout(), newKey(), RELATIONS, Step(), styles, formatDate(), amountDuePaise(), rupees() (+13 more)

### Community 45 - "pathlib"
Cohesion: 0.14
Nodes (8): letters(), monogram(), wordmark(), icon(), mark(), font_card(), icon(), mark()

### Community 46 - "logo_concepts.py"
Cohesion: 0.19
Nodes (10): card(), diamond(), diamond_only(), face_to_face(), pin_p(), svg(), two_seats(), uid() (+2 more)

### Community 47 - "view_as.py"
Cohesion: 0.26
Nodes (10): s_action(), s_companion_dash(), s_companion_onb(), s_exit(), s_member_book(), s_member_home(), s_pick(), s_switch() (+2 more)

### Community 48 - "logo_luxe.py"
Cohesion: 0.29
Nodes (9): card(), cut(), gem(), linked(), signature(), svg(), uid(), word() (+1 more)

### Community 49 - "admin.ts"
Cohesion: 0.14
Nodes (21): AdminAction, BookingTab, canActOn(), isStaff(), refundableAmount(), STAFF_ROLES, SUPER_ONLY, DEFAULT_PACKAGE_PRICES (+13 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.14
Nodes (7): pair(), phone(), section(), bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.19
Nodes (7): city_pill(), day_trips(), plan_rows(), pk(), profile(), row(), screen()

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "chat_keyboard.py"
Cohesion: 0.38
Nodes (3): composer(), header(), svg()

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 357 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `CompanionDashboard`, `admin.tsx`, `verify-id.tsx`, `Loading`, `useSession`, `errorMessage`, `review.tsx`, `app/_layout.tsx`, `booking.ts`, `tokens.ts`, `plans.tsx`, `formatINR`, `layout.tsx`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08602150537634409 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `admin.tsx`, `verify-id.tsx`, `push.ts`, `Loading`, `useSession`, `session.ts`, `package.json`, `errorMessage`, `review.tsx`, `Text`, `app/_layout.tsx`, `booking.ts`, `tokens.ts`, `plans.tsx`, `formatINR`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `admin.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11842105263157894 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `push.ts` to `package.json`, `e2e-supabase.mjs`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Should `verify-id.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1461794019933555 - nodes in this community are weakly interconnected._