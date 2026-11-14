# Graph Report - prsnn-mobile  (2026-11-14)

## Corpus Check
- 159 files · ~293,236 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1464 nodes · 6729 edges · 58 communities (56 shown, 2 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 243 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5820c2b1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- demoAdmin.ts
- domain/pricing.ts
- admin.tsx
- verify-id.tsx
- expo
- session.ts
- space
- Text
- devDependencies
- package.json
- errorMessage
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- onboarding.tsx
- demo.ts
- types.ts
- app/_layout.tsx
- screens_v2.py
- booking.ts
- journey.py
- layout.tsx
- chat.ts
- plans.tsx
- formatINR
- places.ts
- landing.py
- bar
- body
- pay/[bookingId].tsx
- btn
- prepaid-privacy.test.ts
- verification.ts
- brand_screens.py
- push.ts
- edit-profile.tsx
- ic
- LocationFields.tsx
- Button
- card_systems.py
- round2.test.ts
- Checkout
- pathlib
- logo_concepts.py
- view_as.py
- logo_luxe.py
- admin.ts
- wordmarks.py
- categories.py
- supabase.ts
- m_book
- chat_keyboard.py
- CategoryTiles.tsx
- logo.py
- lib/pricing.ts

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
- `AdminLayout()` --calls--> `AdminGate()`  [EXTRACTED]
  src/app/admin/_layout.tsx → src/components/admin.tsx
- `usePricing()` --indirect_call--> `pricing()`  [INFERRED]
  src/lib/pricing.ts → src/domain/pricing.ts
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `Discover()` --calls--> `HomeCategories()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/HomeCategories.tsx

## Import Cycles
- None detected.

## Communities (58 total, 2 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.09
Nodes (26): BroadcastRecord, CityPlan, PanicAlert, Backend, activity, allDays, bk(), bookings (+18 more)

### Community 1 - "domain/pricing.ts"
Cohesion: 0.16
Nodes (16): Availability(), AvailabilityForm(), initial(), refundIfCancelledNow(), BASE_RATE, companionShareOf(), DEFAULT_PACKAGE_PRICES, DEFAULT_PRICING (+8 more)

### Community 2 - "admin.tsx"
Cohesion: 0.14
Nodes (40): AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap(), PanicDetail(), styles, tel() (+32 more)

### Community 3 - "verify-id.tsx"
Cohesion: 0.25
Nodes (22): BookingDetail(), Confirmed(), OfferSummary(), VerifyId(), BookingCard(), MetaLine(), PrepaidStatus(), STAGE_LABEL (+14 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption (+31 more)

### Community 5 - "session.ts"
Cohesion: 0.22
Nodes (17): loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), checkLocalPin(), clearLocalPin(), forgetSavedSession(), hash() (+9 more)

### Community 6 - "space"
Cohesion: 0.14
Nodes (25): expo-router, react, @tanstack/react-query, BLINK, styles, RELATIONS, styles, styles (+17 more)

### Community 7 - "Text"
Cohesion: 0.12
Nodes (42): PanicBanner(), CategoryPage(), CompanionProfile(), Apply(), Options(), inFilter(), Notifications(), Otp() (+34 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "package.json"
Cohesion: 0.05
Nodes (54): dependencies, expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/outfit@^0.4.3, @expo-google-fonts/urbanist@^0.4.2, expo-haptics@~58.0.7 (+46 more)

### Community 10 - "errorMessage"
Cohesion: 0.13
Nodes (43): react-native-safe-area-context, Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Admins() (+35 more)

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

### Community 15 - "onboarding.tsx"
Cohesion: 0.13
Nodes (30): CompanionOnboarding(), INTERESTS, Line(), Step, STEPS, styles, Splash(), Chip() (+22 more)

### Community 16 - "demo.ts"
Cohesion: 0.08
Nodes (22): Policy, Profile, allDays, bookings, companionStatus(), day(), demo, DemoCompanion (+14 more)

### Community 17 - "types.ts"
Cohesion: 0.07
Nodes (32): AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, ApprovalStatus, AuditEntry, Availability (+24 more)

### Community 19 - "app/_layout.tsx"
Cohesion: 0.13
Nodes (21): expo-font@~58.0.10, expo-splash-screen@~58.0.11, react-native-gesture-handler@~3.3.0, expo-font, expo-splash-screen, react-native-gesture-handler, AppEffects(), RootLayout() (+13 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "booking.ts"
Cohesion: 0.12
Nodes (24): SelectDateTime(), styles, WEEK, amountDuePaise(), availableDayNames(), BookingTab, CATEGORIES, CategoryKey (+16 more)

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "layout.tsx"
Cohesion: 0.06
Nodes (78): expo-haptics, expo-image, expo-linear-gradient, react-native, react-native-reanimated, AdminLayout(), styles, styles (+70 more)

### Community 24 - "chat.ts"
Cohesion: 0.28
Nodes (8): ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status, toMessage(), useChat(), supabase

### Community 25 - "plans.tsx"
Cohesion: 0.11
Nodes (19): EMPTY, styles, AdminPrices(), Draft, draftOf(), Pair(), Prices(), styles (+11 more)

### Community 26 - "formatINR"
Cohesion: 0.16
Nodes (26): Money(), perks(), HomeCategories(), a11y(), BigCard(), MAT, matFor(), PackageGrid() (+18 more)

### Community 27 - "places.ts"
Cohesion: 0.14
Nodes (16): PrivacyForm(), identityComplete(), AreaPicker(), CityPicker(), CitySheet(), PickerField(), SearchSheet(), areasFor() (+8 more)

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
Cohesion: 0.27
Nodes (10): METHODS, styles, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet() (+2 more)

### Community 32 - "btn"
Cohesion: 0.15
Nodes (39): btn(), foot(), notice(), s_book_time(), s_companion(), s_confirmed(), s_email(), s_otp() (+31 more)

### Community 33 - "prepaid-privacy.test.ts"
Cohesion: 0.17
Nodes (17): Earnings(), BookingsTab(), MessagesTab(), awaitingAnswer(), canChat(), earningsFor(), isMineAsCompanion(), MIN_LEAD_MINUTES (+9 more)

### Community 34 - "verification.ts"
Cohesion: 0.29
Nodes (9): VerificationStatus, companionStatusLine(), ID_TYPES, idCheckValue(), idTypeLabel(), idUploadError(), isLiveCompanion(), needsBack() (+1 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 37 - "push.ts"
Cohesion: 0.18
Nodes (10): expo-constants@~58.0.13, expo-device@~58.0.5, expo-notifications@~58.1.8, expo-constants, expo-device, expo-notifications, DEMO, openFromPush() (+2 more)

### Community 38 - "edit-profile.tsx"
Cohesion: 0.25
Nodes (13): EditForm(), EditProfile(), styles, Verification(), Fix(), styles, CategoryTiles(), styles (+5 more)

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 40 - "LocationFields.tsx"
Cohesion: 0.30
Nodes (15): Plans(), Row(), AreaSheet(), CitySheet(), Dropdown(), fold(), LocationFields(), NoMatch() (+7 more)

### Community 41 - "Button"
Cohesion: 0.24
Nodes (15): DeleteAccount(), LoginEmail(), Login(), Wordmark(), PanicScreen(), PinCheck(), Pin(), SheetBody() (+7 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "round2.test.ts"
Cohesion: 0.18
Nodes (10): Chat(), time(), HoldButton(), PanicButton(), idOf(), savingPercent(), PANIC_AFTER_END_MS, panicWindow() (+2 more)

### Community 44 - "Checkout"
Cohesion: 0.20
Nodes (15): Checkout(), newKey(), Step(), adminWhen(), formatDate(), AvailabilityEditor(), AvailabilityValue, HOURS (+7 more)

### Community 45 - "pathlib"
Cohesion: 0.13
Nodes (8): pair(), phone(), section(), icon(), mark(), font_card(), icon(), mark()

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
Cohesion: 0.16
Nodes (19): AdminAction, BookingTab, canActOn(), isStaff(), refundableAmount(), STAFF_ROLES, SUPER_ONLY, hasIdentity() (+11 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 52 - "supabase.ts"
Cohesion: 0.20
Nodes (8): @react-native-async-storage/async-storage@2.2.0, react-native-url-polyfill@^4.0.0, @supabase/supabase-js@^2.119.0, @react-native-async-storage/async-storage, react-native-url-polyfill, @supabase/supabase-js, SUPABASE_KEY, SUPABASE_URL

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "chat_keyboard.py"
Cohesion: 0.38
Nodes (3): composer(), header(), svg()

### Community 55 - "CategoryTiles.tsx"
Cohesion: 0.43
Nodes (5): styles, Category, CategoryKey, categoryOf(), categoryTitle()

### Community 56 - "logo.py"
Cohesion: 0.47
Nodes (3): letters(), monogram(), wordmark()

### Community 57 - "lib/pricing.ts"
Cohesion: 0.47
Nodes (5): applyPricing(), PricingSettings, subscribePricing(), usePricing(), usePricingSync()

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 357 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `domain/pricing.ts`, `admin.tsx`, `verify-id.tsx`, `space`, `errorMessage`, `onboarding.tsx`, `app/_layout.tsx`, `booking.ts`, `layout.tsx`, `plans.tsx`, `formatINR`, `places.ts`, `pay/[bookingId].tsx`, `prepaid-privacy.test.ts`, `edit-profile.tsx`, `LocationFields.tsx`, `Button`, `round2.test.ts`, `Checkout`, `CategoryTiles.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0896551724137931 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `admin.tsx`, `verify-id.tsx`, `push.ts`, `space`, `edit-profile.tsx`, `LocationFields.tsx`, `package.json`, `errorMessage`, `session.ts`, `Checkout`, `onboarding.tsx`, `app/_layout.tsx`, `supabase.ts`, `booking.ts`, `CategoryTiles.tsx`, `plans.tsx`, `formatINR`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `admin.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14431082331174838 - nodes in this community are weakly interconnected._
- **Why does `react` connect `space` to `admin.tsx`, `verify-id.tsx`, `edit-profile.tsx`, `LocationFields.tsx`, `package.json`, `errorMessage`, `onboarding.tsx`, `app/_layout.tsx`, `booking.ts`, `layout.tsx`, `chat.ts`, `plans.tsx`, `formatINR`, `lib/pricing.ts`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `expo` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._