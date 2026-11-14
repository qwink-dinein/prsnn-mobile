# Graph Report - prsnn-mobile  (2026-11-14)

## Corpus Check
- 164 files · ~296,149 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1490 nodes · 6858 edges · 60 communities (47 shown, 13 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 243 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `75187216`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- demoAdmin.ts
- domain/pricing.ts
- admin.ts
- components/bookings.tsx
- expo
- session.ts
- errorMessage
- companion/[id].tsx
- devDependencies
- dependencies
- states.tsx
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- Icon
- demo.ts
- types.ts
- profile.tsx
- screens_v2.py
- booking.ts
- journey.py
- layout.tsx
- IdentityForm.tsx
- confirm.tsx
- formatINR
- PlacePicker.tsx
- landing.py
- bar
- body
- pay/[bookingId].tsx
- btn
- expo@~58.0.20
- verification.ts
- brand_screens.py
- expo-constants
- expo-crypto
- ic
- @expo-google-fonts/outfit@^0.4.3
- review.tsx
- card_systems.py
- expo-notifications
- expo-secure-store
- pathlib
- logo_concepts.py
- view_as.py
- logo_luxe.py
- flow.ts
- wordmarks.py
- categories.py
- package.json
- m_book
- chat_keyboard.py
- expo-status-bar
- react-native-url-polyfill
- @supabase/supabase-js
- zod@^4.6.7
- zustand

## God Nodes (most connected - your core abstractions)
1. `Text()` - 192 edges
2. `body()` - 138 edges
3. `Icon` - 112 edges
4. `btn()` - 104 edges
5. `ic()` - 102 edges
6. `errorMessage()` - 97 edges
7. `Button()` - 96 edges
8. `react-native` - 90 edges
9. `Header()` - 85 edges
10. `bar()` - 84 edges

## Surprising Connections (you probably didn't know these)
- `CompanionOnboarding()` --indirect_call--> `categoryTitle()`  [INFERRED]
  src/app/fellow/onboarding.tsx → src/domain/categories.ts
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `Chat()` --calls--> `Icon`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/Icon.tsx
- `Chat()` --calls--> `IconButton()`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/layout.tsx
- `Chat()` --calls--> `Text()`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/Text.tsx

## Import Cycles
- None detected.

## Communities (60 total, 13 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (28): AuditEntry, BroadcastRecord, CityPlan, PanicAlert, backend, Backend, activity, allDays (+20 more)

### Community 1 - "domain/pricing.ts"
Cohesion: 0.18
Nodes (16): applyPricing(), BASE_RATE, companionShareOf(), DEFAULT_PACKAGE_PRICES, DEFAULT_PRICING, HEADLINE_HOURS, listeners, PACKAGE_PRICES (+8 more)

### Community 2 - "admin.ts"
Cohesion: 0.19
Nodes (15): PersonLink(), AdminBookingRow(), AdminAction, adminBookingState(), BookingTab, can(), canActOn(), describeAction() (+7 more)

### Community 3 - "components/bookings.tsx"
Cohesion: 0.16
Nodes (39): BookingDetail(), styles, Chat(), styles, time(), Confirmed(), OfferSummary(), VerifyId() (+31 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption (+31 more)

### Community 5 - "session.ts"
Cohesion: 0.16
Nodes (23): @react-native-async-storage/async-storage@2.2.0, @react-native-async-storage/async-storage, loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken() (+15 more)

### Community 6 - "errorMessage"
Cohesion: 0.10
Nodes (84): Activity(), AdminActivity(), priceDiff(), short(), AdminAdmins(), Admins(), Approvals(), AdminBookingDetail() (+76 more)

### Community 7 - "companion/[id].tsx"
Cohesion: 0.26
Nodes (18): CompanionProfile(), styles, perks(), CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton() (+10 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/urbanist@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-linear-gradient@~58.0.3, expo-router@~58.0.27, expo-splash-screen@~58.0.11 (+18 more)

### Community 10 - "states.tsx"
Cohesion: 0.08
Nodes (34): expo-haptics, react-native-reanimated, DOT_FADE, DOT_SETTLE, styles, Wordmark(), PinCheck(), PULSE (+26 more)

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

### Community 15 - "Icon"
Cohesion: 0.08
Nodes (78): expo-image, AdminOverview(), BLINK, Money(), PanicBanner(), styles, EditForm(), EditProfile() (+70 more)

### Community 16 - "demo.ts"
Cohesion: 0.08
Nodes (23): Policy, allDays, bookings, companionStatus(), day(), demo, DemoCompanion, demoIncoming (+15 more)

### Community 17 - "types.ts"
Cohesion: 0.07
Nodes (33): PANIC_AFTER_END_MS, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, ApprovalStatus, Availability (+25 more)

### Community 19 - "profile.tsx"
Cohesion: 0.05
Nodes (56): AppEffects(), RootLayout(), styles, tab(), TabsLayout(), ProfileTab(), styles, ConfirmProvider() (+48 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "booking.ts"
Cohesion: 0.10
Nodes (36): SelectDateTime(), BookingsTab(), adminWhen(), formatDate(), AvailabilityEditor(), AvailabilityValue, HOURS, styles (+28 more)

### Community 22 - "journey.py"
Cohesion: 0.09
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "layout.tsx"
Cohesion: 0.08
Nodes (73): expo-linear-gradient, expo-router, react, react-native, react-native-safe-area-context, @tanstack/react-query, styles, styles (+65 more)

### Community 24 - "IdentityForm.tsx"
Cohesion: 0.35
Nodes (9): identityComplete(), IdentityValue, styles, GENDER_OPTIONS, SEE_OPTIONS, VISIBILITY_COPY, Gender, SeeGender (+1 more)

### Community 25 - "confirm.tsx"
Cohesion: 0.22
Nodes (9): Availability(), AvailabilityForm(), initial(), emptyAvailability(), Ask, ConfirmOptions, Ctx, styles (+1 more)

### Community 26 - "formatINR"
Cohesion: 0.16
Nodes (26): CategoryPage(), styles, TAB_MATS, a11y(), BigCard(), MAT, matFor(), PackageGrid() (+18 more)

### Community 27 - "PlacePicker.tsx"
Cohesion: 0.18
Nodes (15): AreaPicker(), CityPicker(), CitySheet(), PickerField(), SearchSheet(), styles, AREAS, areasFor() (+7 more)

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
Cohesion: 0.24
Nodes (10): react-native-webview@14.0.1, react-native-webview, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet() (+2 more)

### Community 32 - "btn"
Cohesion: 0.15
Nodes (39): btn(), foot(), notice(), s_book_time(), s_companion(), s_confirmed(), s_email(), s_otp() (+31 more)

### Community 34 - "verification.ts"
Cohesion: 0.39
Nodes (7): VerificationStatus, companionStatusLine(), ID_TYPES, idUploadError(), isLiveCompanion(), needsBack(), needsIdToAccept()

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 41 - "review.tsx"
Cohesion: 0.13
Nodes (23): Row(), Checkout(), newKey(), RELATIONS, Step(), styles, SearchTab(), styles (+15 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

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

### Community 49 - "flow.ts"
Cohesion: 0.32
Nodes (10): isStaff(), hasIdentity(), needsSetup(), SessionUser, afterAuth(), afterPin(), goHome(), resetTo() (+2 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.14
Nodes (7): pair(), phone(), section(), bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.19
Nodes (7): city_pill(), day_trips(), plan_rows(), pk(), profile(), row(), screen()

### Community 52 - "package.json"
Cohesion: 0.10
Nodes (20): expo-device@~58.0.5, expo-font@~58.0.10, @expo-google-fonts/dm-sans@^0.4.2, expo-image-picker@~58.0.10, expo-linking@~58.0.14, @react-native-community/netinfo@^12.0.1, react-native-screens@~4.30.0, react-native-svg@15.16.0 (+12 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "chat_keyboard.py"
Cohesion: 0.38
Nodes (3): composer(), header(), svg()

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 363 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Icon` to `admin.ts`, `components/bookings.tsx`, `errorMessage`, `companion/[id].tsx`, `review.tsx`, `states.tsx`, `profile.tsx`, `booking.ts`, `layout.tsx`, `IdentityForm.tsx`, `confirm.tsx`, `formatINR`, `PlacePicker.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08266129032258064 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `components/bookings.tsx`, `session.ts`, `errorMessage`, `companion/[id].tsx`, `dependencies`, `review.tsx`, `states.tsx`, `Icon`, `profile.tsx`, `package.json`, `booking.ts`, `IdentityForm.tsx`, `confirm.tsx`, `formatINR`, `PlacePicker.tsx`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `expo` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `@supabase/supabase-js` to `profile.tsx`, `package.json`, `e2e-supabase.mjs`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `errorMessage` be split into smaller, more focused modules?**
  _Cohesion score 0.09671052631578947 - nodes in this community are weakly interconnected._