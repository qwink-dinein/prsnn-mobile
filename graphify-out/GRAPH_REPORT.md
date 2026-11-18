# Graph Report - prsnn-mobile  (2026-11-18)

## Corpus Check
- 191 files · ~313,971 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1659 nodes · 7596 edges · 67 communities (52 shown, 15 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 247 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9bae0619`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- home.tsx
- package.json
- chat/[bookingId].tsx
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
- Icon
- rules.ts
- demo.ts
- admin.tsx
- onboarding.tsx
- booking.ts
- screens_v2.py
- components/bookings.tsx
- journey.py
- wallet_prices.py
- pathlib
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
- formatINR
- ic
- interest.ts
- pay/[bookingId].tsx
- card_systems.py
- wallet.tsx
- prepaid-privacy.test.ts
- react-native-url-polyfill
- logo_concepts.py
- view_as.py
- logo_luxe.py
- Text
- wordmarks.py
- react-native-worklets@0.13.0
- motion.tsx
- m_book
- Checkout
- fellow/earnings.tsx
- jest
- verification.ts
- brand_directions.py
- expo-splash-screen
- expo@~58.0.20
- expo-constants
- expo-device
- @expo-google-fonts/urbanist@^0.4.2
- react-native-web@~0.21.4
- @supabase/supabase-js

## God Nodes (most connected - your core abstractions)
1. `Text()` - 213 edges
2. `body()` - 138 edges
3. `Icon` - 122 edges
4. `btn()` - 104 edges
5. `errorMessage()` - 103 edges
6. `ic()` - 102 edges
7. `Button()` - 102 edges
8. `react-native` - 100 edges
9. `colors` - 93 edges
10. `Header()` - 89 edges

## Surprising Connections (you probably didn't know these)
- `Chat()` --calls--> `typing`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/motion.tsx
- `CompanionOnboarding()` --indirect_call--> `categoryTitle()`  [INFERRED]
  src/app/fellow/onboarding.tsx → src/domain/categories.ts
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `normaliseCompanion()` --calls--> `areaName()`  [EXTRACTED]
  src/services/backend.ts → src/domain/places.ts
- `toProfile()` --calls--> `areaName()`  [EXTRACTED]
  src/services/backend.ts → src/domain/places.ts

## Import Cycles
- None detected.

## Communities (67 total, 15 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.06
Nodes (44): AdminChatMessage, AdminOverview, AdminPerson, AllocationState, ApprovalStatus, AuditEntry, Availability, BookingStatus (+36 more)

### Community 1 - "home.tsx"
Cohesion: 0.05
Nodes (78): AppEffects(), RootLayout(), styles, open(), BookingsTab(), styles, TABS, HomeTab() (+70 more)

### Community 2 - "package.json"
Cohesion: 0.11
Nodes (18): @expo-google-fonts/lora@^0.4.2, expo-system-ui@~58.0.6, expo-video@~58.0.13, react-dom@19.3.0, @react-native-community/netinfo@^12.0.1, react-native-gesture-handler@~3.3.0, react-native-webview@14.0.1, main (+10 more)

### Community 3 - "chat/[bookingId].tsx"
Cohesion: 0.09
Nodes (34): Chat(), isDivider(), Row, styles, time(), HoldButton(), PanicButton(), RiseIn() (+26 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (47): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+39 more)

### Community 5 - "session.ts"
Cohesion: 0.16
Nodes (23): @react-native-async-storage/async-storage@2.2.0, @react-native-async-storage/async-storage, loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken() (+15 more)

### Community 6 - "landing.py"
Cohesion: 0.34
Nodes (17): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+9 more)

### Community 7 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, expo-font@~58.0.10, @expo-google-fonts/outfit@^0.4.3, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-linear-gradient@~58.0.3, expo-router@~58.0.27, expo-secure-store@~58.0.2 (+16 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (30): priceCurveError(), AdminBooking, BroadcastRecord, CityPlan, PanicAlert, backend, Backend, activity (+22 more)

### Community 10 - "layout.tsx"
Cohesion: 0.07
Nodes (81): expo-haptics, expo-router, react, react-native, @tanstack/react-query, styles, Tab, styles (+73 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, noEmit, paths, strict, types, exclude (+2 more)

### Community 12 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, export:web, graph, ios, lint, start, test (+2 more)

### Community 13 - "e2e-supabase.mjs"
Cohesion: 0.08
Nodes (15): fs, book(), cand, card, [compId, memId], got, img, offer (+7 more)

### Community 14 - "Icon"
Cohesion: 0.08
Nodes (50): expo-image, expo-linear-gradient, react-native-safe-area-context, EMPTY, Row(), styles, CategoryPage(), styles (+42 more)

### Community 15 - "rules.ts"
Cohesion: 0.33
Nodes (8): agreedAt(), Consent, ConsentKind, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

### Community 16 - "demo.ts"
Cohesion: 0.07
Nodes (28): BusyTime, AppNotification, SessionUser, AuthResult, allDays, bookings, companionStatus(), day() (+20 more)

### Community 17 - "admin.tsx"
Cohesion: 0.16
Nodes (31): AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap(), AdminUserDetail(), Agreements(), CONSENT_LABEL (+23 more)

### Community 18 - "onboarding.tsx"
Cohesion: 0.05
Nodes (85): CompanionOnboarding(), INTERESTS, Line(), Options(), Step, STEPS, styles, Privacy() (+77 more)

### Community 19 - "booking.ts"
Cohesion: 0.11
Nodes (39): CompanionProfile(), styles, adminWhen(), BookingChoice, BookingPicker(), styles, WEEK, AvailabilityEditor() (+31 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "components/bookings.tsx"
Cohesion: 0.22
Nodes (28): BookingDetail(), styles, Confirmed(), OfferSummary(), Pay(), BookingCard(), formatDate(), MetaLine() (+20 more)

### Community 22 - "journey.py"
Cohesion: 0.07
Nodes (31): city_pill(), day_trips(), plan_rows(), b64(), bar(), chat_screen(), dots(), keypad() (+23 more)

### Community 23 - "wallet_prices.py"
Cohesion: 0.25
Nodes (13): big_card(), cta(), header(), ic(), p_companion(), p_lift(), p_stack(), p_swipe() (+5 more)

### Community 24 - "pathlib"
Cohesion: 0.12
Nodes (10): letters(), monogram(), wordmark(), icon(), mark(), row(), screen(), font_card() (+2 more)

### Community 26 - "domain/pricing.ts"
Cohesion: 0.12
Nodes (28): perks(), a11y(), PackageGrid(), Props, styles, tagFor(), applyPricing(), BASE_RATE (+20 more)

### Community 28 - "wallet_variants.py"
Cohesion: 0.31
Nodes (11): bell(), card(), head(), logo(), tabs(), v_grid(), v_lifted(), v_passes() (+3 more)

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
Cohesion: 0.14
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 36 - "errorMessage"
Cohesion: 0.10
Nodes (61): Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Admins(), styles (+53 more)

### Community 38 - "formatINR"
Cohesion: 0.25
Nodes (17): CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton(), Photo(), placeOf(), styles (+9 more)

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 40 - "interest.ts"
Cohesion: 0.31
Nodes (8): APPROVAL, categoryTitle(), MEET, roleLabel(), SignupChoices, signupDetails(), topCategories(), base

### Community 41 - "pay/[bookingId].tsx"
Cohesion: 0.26
Nodes (9): baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet(), RazorpaySuccess, styles (+1 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "wallet.tsx"
Cohesion: 0.29
Nodes (7): react-native-svg@15.16.0, react-native-svg, Guilloche, Material, MaterialCard(), MATERIALS, styles

### Community 44 - "prepaid-privacy.test.ts"
Cohesion: 0.22
Nodes (11): MIN_LEAD_MINUTES, refundIfCancelledNow(), tabOf(), offersCategory(), filterCompanions(), hasVisiblePhoto(), photosFirst(), Sort (+3 more)

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
Cohesion: 0.09
Nodes (54): react-native-reanimated, AdminOverview(), BLINK, Money(), PanicBanner(), Person(), styles, DeleteAccount() (+46 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 52 - "motion.tsx"
Cohesion: 0.13
Nodes (16): bob, EASE_OUT, EASE_OUT_CSS, easeOutQuart(), fadeOnly, fadeUp, fromLeft, fromRight (+8 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "Checkout"
Cohesion: 0.28
Nodes (8): Checkout(), newKey(), Step(), amountDuePaise(), canHomeVisit(), meetingPlaceError(), rupees(), totalOfBooking()

### Community 56 - "fellow/earnings.tsx"
Cohesion: 0.42
Nodes (7): Earnings(), EarningsScreen(), styles, EarningsTab(), Brand(), earningsFor(), parseDateKey()

### Community 57 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

### Community 58 - "verification.ts"
Cohesion: 0.36
Nodes (7): VerificationStatus, ID_TYPES, idTypeLabel(), idUploadError(), isLiveCompanion(), needsBack(), needsIdToAccept()

### Community 59 - "brand_directions.py"
Cohesion: 0.33
Nodes (3): pair(), phone(), section()

## Knowledge Gaps
- **2 isolated node(s):** `COMMUNITY_IMAGE`, `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 410 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `home.tsx`, `chat/[bookingId].tsx`, `errorMessage`, `formatINR`, `layout.tsx`, `Icon`, `admin.tsx`, `onboarding.tsx`, `booking.ts`, `components/bookings.tsx`, `Checkout`, `fellow/earnings.tsx`, `domain/pricing.ts`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `COMMUNITY_IMAGE`, `expo/tsconfig.base` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06037414965986394 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `home.tsx`, `package.json`, `chat/[bookingId].tsx`, `errorMessage`, `session.ts`, `formatINR`, `dependencies`, `pay/[bookingId].tsx`, `wallet.tsx`, `Icon`, `admin.tsx`, `Text`, `booking.ts`, `onboarding.tsx`, `components/bookings.tsx`, `motion.tsx`, `fellow/earnings.tsx`, `domain/pricing.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `home.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05029890744176459 - nodes in this community are weakly interconnected._
- **Why does `react` connect `layout.tsx` to `home.tsx`, `package.json`, `chat/[bookingId].tsx`, `errorMessage`, `formatINR`, `dependencies`, `pay/[bookingId].tsx`, `wallet.tsx`, `Icon`, `admin.tsx`, `onboarding.tsx`, `booking.ts`, `Text`, `components/bookings.tsx`, `motion.tsx`, `fellow/earnings.tsx`, `domain/pricing.ts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._