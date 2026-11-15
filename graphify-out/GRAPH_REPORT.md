# Graph Report - prsnn-mobile  (2026-11-15)

## Corpus Check
- 166 files · ~297,196 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1498 nodes · 6902 edges · 63 communities (49 shown, 14 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 243 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c0b65db6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- demoAdmin.ts
- layout.tsx
- book/[id].tsx
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
- onboarding.tsx
- demo.ts
- types.ts
- profile.tsx
- screens_v2.py
- booking.ts
- journey.py
- layout.tsx
- review.tsx
- Text
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
- lib/chat.ts
- prices.tsx
- ic
- @expo-google-fonts/outfit@^0.4.3
- categories.ts
- card_systems.py
- brand_directions.py
- expo-secure-store
- pathlib
- logo_concepts.py
- view_as.py
- logo_luxe.py
- make_icons.py
- wordmarks.py
- categories.py
- package.json
- m_book
- wordmark_dot.py
- expo-status-bar
- react-native-url-polyfill
- @supabase/supabase-js
- zod@^4.6.7
- zustand
- expo-device
- expo-splash-screen
- react-native-web@~0.21.4

## God Nodes (most connected - your core abstractions)
1. `Text()` - 194 edges
2. `body()` - 138 edges
3. `Icon` - 112 edges
4. `btn()` - 104 edges
5. `ic()` - 102 edges
6. `errorMessage()` - 99 edges
7. `Button()` - 96 edges
8. `react-native` - 91 edges
9. `Header()` - 87 edges
10. `bar()` - 84 edges

## Surprising Connections (you probably didn't know these)
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `CompanionOnboarding()` --indirect_call--> `categoryTitle()`  [INFERRED]
  src/app/fellow/onboarding.tsx → src/domain/categories.ts
- `Enquiries()` --calls--> `Text()`  [EXTRACTED]
  src/app/admin/enquiries.tsx → src/components/ui/Text.tsx
- `AdminOverview()` --calls--> `ErrorState()`  [EXTRACTED]
  src/app/admin/index.tsx → src/components/ui/layout.tsx
- `AdminOverview()` --calls--> `Header()`  [EXTRACTED]
  src/app/admin/index.tsx → src/components/ui/layout.tsx

## Import Cycles
- None detected.

## Communities (63 total, 14 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (28): priceCurveError(), AdminBooking, AuditEntry, CityPlan, PanicAlert, backend, activity, allDays (+20 more)

### Community 1 - "layout.tsx"
Cohesion: 0.07
Nodes (45): expo-image, expo-linear-gradient, STARTS, styles, WHO, styles, Filter, ICON (+37 more)

### Community 2 - "book/[id].tsx"
Cohesion: 0.19
Nodes (18): SelectDateTime(), styles, WEEK, adminWhen(), AvailabilityEditor(), AvailabilityValue, HOURS, styles (+10 more)

### Community 3 - "components/bookings.tsx"
Cohesion: 0.17
Nodes (35): BookingDetail(), styles, Chat(), styles, time(), Confirmed(), OfferSummary(), PanicScreen() (+27 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption (+31 more)

### Community 5 - "session.ts"
Cohesion: 0.16
Nodes (23): @react-native-async-storage/async-storage, loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken(), checkLocalPin() (+15 more)

### Community 6 - "errorMessage"
Cohesion: 0.11
Nodes (67): Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Admins(), Approvals() (+59 more)

### Community 7 - "companion/[id].tsx"
Cohesion: 0.17
Nodes (27): Row(), CompanionProfile(), styles, perks(), Earnings(), CompanionCard(), CompanionRow(), firstName() (+19 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "dependencies"
Cohesion: 0.07
Nodes (27): dependencies, expo-constants@~58.0.13, @expo-google-fonts/dm-sans@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-linear-gradient@~58.0.3, expo-notifications@~58.1.8, expo-router@~58.0.27 (+19 more)

### Community 10 - "states.tsx"
Cohesion: 0.14
Nodes (24): expo-haptics, react-native-reanimated, DOT_FADE, DOT_SETTLE, LoginEmail(), Login(), styles, Wordmark() (+16 more)

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
Cohesion: 0.06
Nodes (70): initial(), CompanionOnboarding(), INTERESTS, Line(), Options(), Step, STEPS, styles (+62 more)

### Community 16 - "demo.ts"
Cohesion: 0.07
Nodes (26): AppNotification, SessionUser, AuthResult, allDays, bookings, companionStatus(), day(), demo (+18 more)

### Community 17 - "types.ts"
Cohesion: 0.07
Nodes (32): AdminChatMessage, AdminOverview, AdminPerson, AllocationState, ApprovalStatus, Availability, BookingStatus, BroadcastAudience (+24 more)

### Community 19 - "profile.tsx"
Cohesion: 0.06
Nodes (53): PHOTOS, Splash(), styles, AppEffects(), RootLayout(), styles, HomeTab(), tab() (+45 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "booking.ts"
Cohesion: 0.13
Nodes (25): BookingsTab(), styles, TABS, CompanionDashboard(), awaitingAnswer(), BookingTab, canPay(), CATEGORIES (+17 more)

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "layout.tsx"
Cohesion: 0.11
Nodes (51): expo-router, react, react-native, react-native-safe-area-context, @tanstack/react-query, styles, EMPTY, styles (+43 more)

### Community 24 - "review.tsx"
Cohesion: 0.22
Nodes (13): Checkout(), newKey(), RELATIONS, Step(), styles, formatDate(), amountDuePaise(), canHomeVisit() (+5 more)

### Community 25 - "Text"
Cohesion: 0.12
Nodes (44): AdminOverview(), BLINK, Money(), PanicBanner(), styles, ViewAs(), DeleteAccount(), EditForm() (+36 more)

### Community 26 - "formatINR"
Cohesion: 0.11
Nodes (36): CategoryPage(), a11y(), BigCard(), MAT, matFor(), PackageGrid(), Props, styles (+28 more)

### Community 27 - "PlacePicker.tsx"
Cohesion: 0.29
Nodes (11): SearchTab(), styles, AreaPicker(), CityPicker(), CitySheet(), PickerField(), SearchSheet(), styles (+3 more)

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
Cohesion: 0.24
Nodes (10): react-native-webview@14.0.1, react-native-webview, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet() (+2 more)

### Community 32 - "btn"
Cohesion: 0.15
Nodes (39): btn(), foot(), notice(), s_book_time(), s_companion(), s_confirmed(), s_email(), s_otp() (+31 more)

### Community 34 - "verification.ts"
Cohesion: 0.33
Nodes (8): VerificationStatus, companionStatusLine(), ID_TYPES, idTypeLabel(), idUploadError(), isLiveCompanion(), needsBack(), needsIdToAccept()

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 37 - "lib/chat.ts"
Cohesion: 0.27
Nodes (8): mergeMessages(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status, toMessage(), useChat()

### Community 38 - "prices.tsx"
Cohesion: 0.36
Nodes (7): AdminPrices(), Draft, draftOf(), Pair(), Prices(), styles, ALL_HOURS

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 41 - "categories.ts"
Cohesion: 0.25
Nodes (9): Category, CategoryKey, categoryOf(), categoryTitle(), offersCategory(), filterCompanions(), Sort, SORTS (+1 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "brand_directions.py"
Cohesion: 0.33
Nodes (3): pair(), phone(), section()

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

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 52 - "package.json"
Cohesion: 0.10
Nodes (20): expo-crypto@~58.0.7, expo-font@~58.0.10, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/urbanist@^0.4.2, expo-image-picker@~58.0.10, expo-linking@~58.0.14, react-dom@19.3.0, react-native-screens@~4.30.0 (+12 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "wordmark_dot.py"
Cohesion: 0.60
Nodes (3): font_card(), icon(), mark()

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 366 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `layout.tsx`, `book/[id].tsx`, `components/bookings.tsx`, `prices.tsx`, `companion/[id].tsx`, `errorMessage`, `states.tsx`, `onboarding.tsx`, `profile.tsx`, `booking.ts`, `layout.tsx`, `review.tsx`, `formatINR`, `PlacePicker.tsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08266129032258064 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `layout.tsx`, `book/[id].tsx`, `components/bookings.tsx`, `session.ts`, `prices.tsx`, `errorMessage`, `companion/[id].tsx`, `dependencies`, `states.tsx`, `onboarding.tsx`, `profile.tsx`, `package.json`, `booking.ts`, `review.tsx`, `Text`, `formatINR`, `PlacePicker.tsx`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0677555958862674 - nodes in this community are weakly interconnected._
- **Why does `react` connect `layout.tsx` to `layout.tsx`, `book/[id].tsx`, `components/bookings.tsx`, `lib/chat.ts`, `prices.tsx`, `errorMessage`, `dependencies`, `states.tsx`, `onboarding.tsx`, `profile.tsx`, `package.json`, `booking.ts`, `review.tsx`, `Text`, `formatINR`, `PlacePicker.tsx`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `expo` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._