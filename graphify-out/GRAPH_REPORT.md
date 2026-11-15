# Graph Report - prsnn-mobile  (2026-11-15)

## Corpus Check
- 168 files · ~298,044 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1507 nodes · 6933 edges · 72 communities (53 shown, 19 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 243 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1b298e5a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- demoAdmin.ts
- layout.tsx
- onboarding.tsx
- components/bookings.tsx
- expo
- session.ts
- index.ts
- Icon
- devDependencies
- dependencies
- states.tsx
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- setup-profile.tsx
- demo.ts
- types.ts
- app/_layout.tsx
- screens_v2.py
- booking.ts
- journey.py
- chat/[bookingId].tsx
- admin/booking/[id].tsx
- Text
- formatINR
- login.tsx
- landing.py
- bar
- body
- pay/[bookingId].tsx
- btn
- admin.tsx
- useSession
- brand_screens.py
- lib/chat.ts
- domain/pricing.ts
- ic
- @expo-google-fonts/outfit@^0.4.3
- home.tsx
- card_systems.py
- brand_directions.py
- expo-secure-store
- pathlib
- logo_concepts.py
- view_as.py
- logo_luxe.py
- preview.tsx
- wordmarks.py
- categories.py
- package.json
- m_book
- wordmark_dot.py
- push.ts
- react-native-url-polyfill
- @supabase/supabase-js
- zod@^4.6.7
- zustand
- expo-device
- chat_keyboard.py
- react-native-web@~0.21.4
- expo-constants
- expo-font
- expo-haptics
- expo-image-picker
- expo-notifications
- react-dom@19.3.0
- @react-native-async-storage/async-storage
- @react-native-community/netinfo
- react-native-screens@~4.30.0

## God Nodes (most connected - your core abstractions)
1. `Text()` - 196 edges
2. `body()` - 138 edges
3. `Icon` - 112 edges
4. `btn()` - 104 edges
5. `ic()` - 102 edges
6. `errorMessage()` - 99 edges
7. `Button()` - 96 edges
8. `react-native` - 93 edges
9. `Header()` - 87 edges
10. `colors` - 85 edges

## Surprising Connections (you probably didn't know these)
- `SessionState` --references--> `SessionUser`  [EXTRACTED]
  src/state/session.ts → src/domain/types.ts
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `Discover()` --calls--> `CompanionCard()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/companions.tsx
- `Discover()` --calls--> `Icon`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/ui/Icon.tsx
- `Discover()` --calls--> `BellButton()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/ui/layout.tsx

## Import Cycles
- None detected.

## Communities (72 total, 19 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.09
Nodes (26): BroadcastRecord, CityPlan, PanicAlert, Backend, activity, allDays, bk(), bookings (+18 more)

### Community 1 - "layout.tsx"
Cohesion: 0.07
Nodes (66): expo-image, expo-linear-gradient, expo-router, react, react-native, STARTS, styles, WHO (+58 more)

### Community 2 - "onboarding.tsx"
Cohesion: 0.15
Nodes (20): Availability(), AvailabilityForm(), initial(), INTERESTS, Options(), Step, STEPS, styles (+12 more)

### Community 3 - "components/bookings.tsx"
Cohesion: 0.23
Nodes (25): BookingDetail(), styles, Confirmed(), styles, OfferSummary(), BookingCard(), MetaLine(), PrepaidStatus() (+17 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption (+31 more)

### Community 5 - "session.ts"
Cohesion: 0.19
Nodes (19): loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), setApiToken(), checkLocalPin(), clearLocalPin(), forgetSavedSession() (+11 more)

### Community 6 - "index.ts"
Cohesion: 0.11
Nodes (47): react-native-safe-area-context, @tanstack/react-query, Activity(), AdminActivity(), priceDiff(), short(), styles, Approvals() (+39 more)

### Community 7 - "Icon"
Cohesion: 0.14
Nodes (33): SelectDateTime(), styles, WEEK, Checkout(), newKey(), RELATIONS, Step(), styles (+25 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/urbanist@^0.4.2, expo-image@~58.0.17, expo-linear-gradient@~58.0.3, expo-linking@~58.0.14, expo-router@~58.0.27, expo-splash-screen@~58.0.11 (+15 more)

### Community 10 - "states.tsx"
Cohesion: 0.14
Nodes (25): react-native-reanimated, PanicScreen(), PinCheck(), PULSE, styles, Pin(), styles, WEAK (+17 more)

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

### Community 15 - "setup-profile.tsx"
Cohesion: 0.09
Nodes (44): Privacy(), PrivacyForm(), COUNTRIES, MEET, Step, styles, identityComplete(), IdentityForm() (+36 more)

### Community 16 - "demo.ts"
Cohesion: 0.08
Nodes (24): SessionUser, AuthResult, allDays, bookings, companionStatus(), day(), demo, DemoCompanion (+16 more)

### Community 17 - "types.ts"
Cohesion: 0.07
Nodes (34): AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, ApprovalStatus, AuditEntry, Availability (+26 more)

### Community 19 - "app/_layout.tsx"
Cohesion: 0.17
Nodes (17): AppEffects(), RootLayout(), styles, tab(), TabsLayout(), connectOnlineManager(), setUnauthorizedHandler(), MAX_APP_WIDTH (+9 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "booking.ts"
Cohesion: 0.11
Nodes (35): BookingsTab(), styles, TABS, MessagesTab(), styles, amountDuePaise(), awaitingAnswer(), BookingTab (+27 more)

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "chat/[bookingId].tsx"
Cohesion: 0.23
Nodes (13): Chat(), styles, time(), ActiveAlert(), HoldButton(), PanicButton(), PULSE, styles (+5 more)

### Community 24 - "admin/booking/[id].tsx"
Cohesion: 0.13
Nodes (26): AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap(), InputField, rupeeField(), AdminAction (+18 more)

### Community 25 - "Text"
Cohesion: 0.11
Nodes (70): CompanionPicker(), Broadcast(), PanicDetail(), EMPTY, Plans(), Row(), styles, AdminPrices() (+62 more)

### Community 26 - "formatINR"
Cohesion: 0.12
Nodes (27): CategoryPage(), styles, a11y(), BigCard(), MAT, matFor(), Props, styles (+19 more)

### Community 27 - "login.tsx"
Cohesion: 0.19
Nodes (12): DOT_FADE, DOT_SETTLE, styles, BRAND_WORD, dotColorFor(), isLight(), Wordmark(), LINKS (+4 more)

### Community 28 - "landing.py"
Cohesion: 0.09
Nodes (43): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+35 more)

### Community 29 - "bar"
Cohesion: 0.12
Nodes (54): avatar(), bar(), card(), checkbox(), chips(), field(), label(), pill() (+46 more)

### Community 30 - "body"
Cohesion: 0.16
Nodes (43): body(), group(), h(), row(), s_admin(), s_admin_booking(), s_bookings(), s_dashboard() (+35 more)

### Community 31 - "pay/[bookingId].tsx"
Cohesion: 0.22
Nodes (15): METHODS, Pay(), styles, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props (+7 more)

### Community 32 - "btn"
Cohesion: 0.15
Nodes (39): btn(), foot(), notice(), s_book_time(), s_companion(), s_confirmed(), s_email(), s_otp() (+31 more)

### Community 33 - "admin.tsx"
Cohesion: 0.16
Nodes (18): AdminAdmins(), Admins(), styles, AdminOverview(), BLINK, Money(), PanicBanner(), styles (+10 more)

### Community 34 - "useSession"
Cohesion: 0.17
Nodes (19): Phase, styles, VerifyId(), HomeTab(), ProfileTab(), styles, CompanionDashboard(), Stat() (+11 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.14
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 37 - "lib/chat.ts"
Cohesion: 0.24
Nodes (9): mergeMessages(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status, toMessage(), useChat() (+1 more)

### Community 38 - "domain/pricing.ts"
Cohesion: 0.17
Nodes (17): perks(), applyPricing(), BASE_RATE, companionShareOf(), DEFAULT_PACKAGE_PRICES, DEFAULT_PRICING, HEADLINE_HOURS, listeners (+9 more)

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 41 - "home.tsx"
Cohesion: 0.24
Nodes (14): Splash(), Discover(), greeting(), styles, CategoryCard(), CommunityBanner(), HomeCategories(), styles (+6 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "brand_directions.py"
Cohesion: 0.33
Nodes (3): pair(), phone(), section()

### Community 45 - "pathlib"
Cohesion: 0.19
Nodes (5): letters(), monogram(), wordmark(), icon(), mark()

### Community 46 - "logo_concepts.py"
Cohesion: 0.19
Nodes (10): card(), diamond(), diamond_only(), face_to_face(), pin_p(), svg(), two_seats(), uid() (+2 more)

### Community 47 - "view_as.py"
Cohesion: 0.26
Nodes (10): s_action(), s_companion_dash(), s_companion_onb(), s_exit(), s_member_book(), s_member_home(), s_pick(), s_switch() (+2 more)

### Community 48 - "logo_luxe.py"
Cohesion: 0.29
Nodes (9): card(), cut(), gem(), linked(), signature(), svg(), uid(), word() (+1 more)

### Community 49 - "preview.tsx"
Cohesion: 0.27
Nodes (12): endPreview(), go(), PreviewAs, PreviewStart, PreviewStrip(), routeFor(), sampleUser(), startPreview() (+4 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 52 - "package.json"
Cohesion: 0.12
Nodes (16): expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/lora@^0.4.2, expo-system-ui@~58.0.6, react-native-gesture-handler@~3.3.0, react-native-worklets@0.13.0, main, name (+8 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "wordmark_dot.py"
Cohesion: 0.60
Nodes (3): font_card(), icon(), mark()

### Community 55 - "push.ts"
Cohesion: 0.25
Nodes (5): DEMO, SUPABASE_KEY, SUPABASE_URL, openFromPush(), registerForPush()

### Community 61 - "chat_keyboard.py"
Cohesion: 0.38
Nodes (3): composer(), header(), svg()

## Knowledge Gaps
- **2 isolated node(s):** `COMMUNITY_IMAGE`, `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 371 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `admin.tsx`, `layout.tsx`, `components/bookings.tsx`, `onboarding.tsx`, `useSession`, `index.ts`, `Icon`, `home.tsx`, `states.tsx`, `setup-profile.tsx`, `preview.tsx`, `booking.ts`, `chat/[bookingId].tsx`, `admin/booking/[id].tsx`, `formatINR`, `login.tsx`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `COMMUNITY_IMAGE`, `expo/tsconfig.base` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0896551724137931 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `onboarding.tsx`, `components/bookings.tsx`, `session.ts`, `index.ts`, `Icon`, `dependencies`, `states.tsx`, `setup-profile.tsx`, `app/_layout.tsx`, `booking.ts`, `chat/[bookingId].tsx`, `admin/booking/[id].tsx`, `Text`, `formatINR`, `login.tsx`, `pay/[bookingId].tsx`, `admin.tsx`, `useSession`, `home.tsx`, `preview.tsx`, `package.json`, `push.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0729312762973352 - nodes in this community are weakly interconnected._
- **Why does `react` connect `layout.tsx` to `onboarding.tsx`, `components/bookings.tsx`, `index.ts`, `Icon`, `dependencies`, `states.tsx`, `setup-profile.tsx`, `app/_layout.tsx`, `booking.ts`, `chat/[bookingId].tsx`, `admin/booking/[id].tsx`, `Text`, `formatINR`, `login.tsx`, `pay/[bookingId].tsx`, `admin.tsx`, `useSession`, `lib/chat.ts`, `domain/pricing.ts`, `home.tsx`, `package.json`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `onboarding.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14855072463768115 - nodes in this community are weakly interconnected._