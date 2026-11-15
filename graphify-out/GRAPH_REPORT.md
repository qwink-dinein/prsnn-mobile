# Graph Report - prsnn-mobile  (2026-11-15)

## Corpus Check
- 170 files · ~301,058 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1541 nodes · 7038 edges · 68 communities (53 shown, 15 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 244 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a7306bf4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- demoAdmin.ts
- admin.tsx
- onboarding.tsx
- Icon
- expo
- session.ts
- layout.tsx
- companion/[id].tsx
- devDependencies
- package.json
- login.tsx
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- Icon
- demo.ts
- types.ts
- setup-profile.tsx
- screens_v2.py
- booking.ts
- journey.py
- [key].tsx
- IdentityForm.tsx
- Text
- formatINR
- onboarding.tsx
- landing.py
- bar
- body
- pay/[bookingId].tsx
- btn
- motion.tsx
- verification.ts
- brand_screens.py
- prices.tsx
- app/_layout.tsx
- domain/pricing.ts
- ic
- admin.ts
- home.tsx
- card_systems.py
- interest.ts
- expo@~58.0.20
- pathlib
- logo_concepts.py
- view_as.py
- logo_luxe.py
- profile.tsx
- wordmarks.py
- categories.py
- expo-font
- m_book
- @expo-google-fonts/lora@^0.4.2
- dependencies
- @expo-google-fonts/outfit@^0.4.3
- expo-image
- expo-image-picker
- expo-linear-gradient
- expo-linking@~58.0.14
- chat_keyboard.py
- expo-system-ui@~58.0.6
- @react-native-community/netinfo
- react-native-svg
- react-native-url-polyfill
- zustand

## God Nodes (most connected - your core abstractions)
1. `Text()` - 198 edges
2. `body()` - 138 edges
3. `Icon` - 112 edges
4. `btn()` - 104 edges
5. `ic()` - 102 edges
6. `errorMessage()` - 100 edges
7. `Button()` - 96 edges
8. `react-native` - 93 edges
9. `Header()` - 87 edges
10. `colors` - 86 edges

## Surprising Connections (you probably didn't know these)
- `Chat()` --calls--> `typing`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/motion.tsx
- `Chat()` --calls--> `IconButton()`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/layout.tsx
- `Chat()` --calls--> `RiseIn()`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/motion.tsx
- `Chat()` --calls--> `TypingDots()`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/motion.tsx
- `Chat()` --calls--> `Text()`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/Text.tsx

## Import Cycles
- None detected.

## Communities (68 total, 15 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (29): AuditEntry, BroadcastRecord, CityPlan, PanicAlert, backend, Backend, activity, allDays (+21 more)

### Community 1 - "admin.tsx"
Cohesion: 0.12
Nodes (43): AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap(), PanicDetail(), styles, tel() (+35 more)

### Community 2 - "onboarding.tsx"
Cohesion: 0.22
Nodes (15): Availability(), AvailabilityForm(), initial(), AvailabilityEditor(), AvailabilityValue, emptyAvailability(), HOURS, styles (+7 more)

### Community 3 - "Icon"
Cohesion: 0.13
Nodes (55): BookingDetail(), styles, Chat(), time(), Confirmed(), styles, DeleteAccount(), EditForm() (+47 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption (+31 more)

### Community 5 - "session.ts"
Cohesion: 0.17
Nodes (21): @react-native-async-storage/async-storage, loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken(), checkLocalPin() (+13 more)

### Community 6 - "layout.tsx"
Cohesion: 0.08
Nodes (72): expo-router, react, react-native, @tanstack/react-query, styles, EMPTY, styles, styles (+64 more)

### Community 7 - "companion/[id].tsx"
Cohesion: 0.32
Nodes (15): CompanionProfile(), styles, CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton(), Photo() (+7 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): expo-constants@~58.0.13, expo-crypto@~58.0.7, @expo-google-fonts/urbanist@^0.4.2, expo-secure-store@~58.0.2, expo-splash-screen@~58.0.11, react-native-reanimated@4.7.1, react-native-worklets@0.13.0, zod@^4.6.7 (+12 more)

### Community 10 - "login.tsx"
Cohesion: 0.16
Nodes (18): STARTS, styles, ViewAs(), WHO, DOT_FADE, DOT_SETTLE, LoginEmail(), Login() (+10 more)

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
Cohesion: 0.14
Nodes (23): AreaSheet(), CitySheet(), Dropdown(), fold(), LocationFields(), LocationValue, NoMatch(), Row() (+15 more)

### Community 16 - "demo.ts"
Cohesion: 0.08
Nodes (25): toDateKey(), AppNotification, Profile, allDays, bookings, companionStatus(), day(), demo (+17 more)

### Community 17 - "types.ts"
Cohesion: 0.07
Nodes (34): PANIC_AFTER_END_MS, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, Booking, BookingStatus, BroadcastAudience (+26 more)

### Community 19 - "setup-profile.tsx"
Cohesion: 0.17
Nodes (21): Chip(), COUNTRIES, MEET, Options(), SetupProfile(), Step, styles, isStaff() (+13 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "booking.ts"
Cohesion: 0.12
Nodes (25): amountDuePaise(), awaitingAnswer(), BookingTab, canComplete(), canHomeVisit(), canPay(), CATEGORIES, CategoryKey (+17 more)

### Community 22 - "journey.py"
Cohesion: 0.09
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "[key].tsx"
Cohesion: 0.17
Nodes (19): CategoryPage(), styles, SearchTab(), styles, CitySheet(), IconButton(), useLiveCompanions(), AREAS (+11 more)

### Community 24 - "IdentityForm.tsx"
Cohesion: 0.29
Nodes (11): identityComplete(), IdentityValue, styles, GENDER_OPTIONS, SEE_OPTIONS, VISIBILITY_COPY, ApprovalStatus, Gender (+3 more)

### Community 25 - "Text"
Cohesion: 0.11
Nodes (60): react-native-safe-area-context, Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Admins() (+52 more)

### Community 26 - "formatINR"
Cohesion: 0.18
Nodes (26): Row(), SelectDateTime(), Checkout(), newKey(), Step(), perks(), a11y(), BigCard() (+18 more)

### Community 27 - "onboarding.tsx"
Cohesion: 0.15
Nodes (19): CompanionOnboarding(), INTERESTS, Line(), Options(), Step, STEPS, styles, CategoryCard() (+11 more)

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

### Community 33 - "motion.tsx"
Cohesion: 0.12
Nodes (19): bob, EASE_OUT, EASE_OUT_CSS, easeOutQuart(), fadeOnly, fadeUp, FillLine(), fromLeft (+11 more)

### Community 34 - "verification.ts"
Cohesion: 0.29
Nodes (9): VerificationStatus, companionStatusLine(), ID_TYPES, idCheckValue(), idTypeLabel(), idUploadError(), isLiveCompanion(), needsBack() (+1 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 36 - "prices.tsx"
Cohesion: 0.19
Nodes (15): AdminPrices(), Draft, draftOf(), Pair(), Prices(), styles, Privacy(), PrivacyForm() (+7 more)

### Community 37 - "app/_layout.tsx"
Cohesion: 0.05
Nodes (52): @supabase/supabase-js@^2.119.0, @supabase/supabase-js, AppEffects(), RootLayout(), styles, tab(), TabsLayout(), ConfirmProvider() (+44 more)

### Community 38 - "domain/pricing.ts"
Cohesion: 0.18
Nodes (16): refundIfCancelledNow(), applyPricing(), BASE_RATE, DEFAULT_PACKAGE_PRICES, DEFAULT_PRICING, HEADLINE_HOURS, listeners, PACKAGE_PRICES (+8 more)

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 40 - "admin.ts"
Cohesion: 0.23
Nodes (11): AdminAction, BookingTab, can(), canActOn(), describeAction(), isSuperadmin(), refundableAmount(), STAFF_ROLES (+3 more)

### Community 41 - "home.tsx"
Cohesion: 0.13
Nodes (26): PHOTOS, Splash(), styles, Discover(), greeting(), HomeTab(), styles, CommunityBanner() (+18 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "interest.ts"
Cohesion: 0.31
Nodes (8): APPROVAL, categoryTitle(), MEET, roleLabel(), SignupChoices, signupDetails(), topCategories(), base

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

### Community 49 - "profile.tsx"
Cohesion: 0.22
Nodes (9): AdminOverview(), BLINK, Money(), PanicBanner(), styles, styles, StatTile(), ListRow() (+1 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.14
Nodes (7): pair(), phone(), section(), bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.19
Nodes (7): city_pill(), day_trips(), plan_rows(), pk(), profile(), row(), screen()

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 55 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, expo-device@~58.0.5, @expo-google-fonts/dm-sans@^0.4.2, expo-haptics@~58.0.7, expo-notifications@~58.1.8, expo-router@~58.0.27, expo-status-bar@~58.0.4, react@19.3.0 (+17 more)

### Community 61 - "chat_keyboard.py"
Cohesion: 0.38
Nodes (3): composer(), header(), svg()

## Knowledge Gaps
- **2 isolated node(s):** `expo/tsconfig.base`, `COMMUNITY_IMAGE`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 380 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `admin.tsx`, `onboarding.tsx`, `Icon`, `prices.tsx`, `app/_layout.tsx`, `layout.tsx`, `companion/[id].tsx`, `home.tsx`, `login.tsx`, `Icon`, `profile.tsx`, `setup-profile.tsx`, `[key].tsx`, `IdentityForm.tsx`, `formatINR`, `onboarding.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base`, `COMMUNITY_IMAGE` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07954545454545454 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `admin.tsx`, `onboarding.tsx`, `Icon`, `session.ts`, `companion/[id].tsx`, `package.json`, `login.tsx`, `Icon`, `setup-profile.tsx`, `[key].tsx`, `IdentityForm.tsx`, `Text`, `formatINR`, `onboarding.tsx`, `pay/[bookingId].tsx`, `motion.tsx`, `prices.tsx`, `app/_layout.tsx`, `home.tsx`, `profile.tsx`, `dependencies`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `admin.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11529411764705882 - nodes in this community are weakly interconnected._
- **Why does `react` connect `layout.tsx` to `admin.tsx`, `onboarding.tsx`, `Icon`, `prices.tsx`, `app/_layout.tsx`, `motion.tsx`, `domain/pricing.ts`, `package.json`, `login.tsx`, `home.tsx`, `Icon`, `setup-profile.tsx`, `[key].tsx`, `dependencies`, `Text`, `formatINR`, `onboarding.tsx`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `Icon` be split into smaller, more focused modules?**
  _Cohesion score 0.13442622950819672 - nodes in this community are weakly interconnected._