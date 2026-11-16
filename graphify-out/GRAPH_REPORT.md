# Graph Report - prsnn-mobile  (2026-11-16)

## Corpus Check
- 179 files · ~306,251 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1594 nodes · 7241 edges · 56 communities (55 shown, 1 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 244 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4881ee08`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- layout.tsx
- components/bookings.tsx
- expo
- session.ts
- radius
- package.json
- devDependencies
- demoAdmin.ts
- home.tsx
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- flow.ts
- demo.ts
- errorMessage
- formatINR
- booking.ts
- screens_v2.py
- admin/index.tsx
- journey.py
- privacy.tsx
- setup-profile.tsx
- review.tsx
- formatINR
- onboarding.tsx
- landing.py
- bar
- body
- chat_keyboard.py
- btn
- [key].tsx
- admin.ts
- brand_screens.py
- pack-web.js
- lib/chat.ts
- pathlib
- ic
- interest.ts
- pay/[bookingId].tsx
- card_systems.py
- wallet.tsx
- logo.py
- confirm.tsx
- logo_concepts.py
- view_as.py
- logo_luxe.py
- Text
- wordmarks.py
- categories.py
- app/_layout.tsx
- m_book
- preview.tsx
- push.ts

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
- `CompanionOnboarding()` --indirect_call--> `categoryTitle()`  [INFERRED]
  src/app/fellow/onboarding.tsx → src/domain/categories.ts
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `a_admins()` --calls--> `ic()`  [EXTRACTED]
  scripts/design/screens_v2.py → scripts/design/all_screens.py
- `a_approvals()` --calls--> `ic()`  [EXTRACTED]
  scripts/design/screens_v2.py → scripts/design/all_screens.py
- `a_plans()` --calls--> `ic()`  [EXTRACTED]
  scripts/design/screens_v2.py → scripts/design/all_screens.py

## Import Cycles
- None detected.

## Communities (56 total, 1 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.06
Nodes (41): BusyTime, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, Availability, BookingStatus (+33 more)

### Community 1 - "layout.tsx"
Cohesion: 0.07
Nodes (80): expo-haptics, expo-router, react, react-native, react-native-reanimated, react-native-safe-area-context, @tanstack/react-query, styles (+72 more)

### Community 3 - "components/bookings.tsx"
Cohesion: 0.07
Nodes (75): BookingDetail(), styles, Chat(), styles, time(), Confirmed(), OfferSummary(), Phase (+67 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (47): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+39 more)

### Community 5 - "session.ts"
Cohesion: 0.17
Nodes (22): @react-native-async-storage/async-storage@2.2.0, @react-native-async-storage/async-storage, loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken() (+14 more)

### Community 6 - "radius"
Cohesion: 0.09
Nodes (35): DOT_FADE, DOT_SETTLE, Login(), styles, Wordmark(), PinCheck(), PULSE, styles (+27 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (41): dependencies, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/urbanist@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-image-picker@~58.0.10, expo-linear-gradient@~58.0.3 (+33 more)

### Community 8 - "devDependencies"
Cohesion: 0.07
Nodes (35): { defineConfig }, expoConfig, expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/outfit@^0.4.3, expo-linking@~58.0.14, expo-splash-screen@~58.0.11, @react-native-community/netinfo@^12.0.1 (+27 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (29): AuditEntry, BroadcastRecord, CityPlan, PanicAlert, backend, Backend, activity, allDays (+21 more)

### Community 10 - "home.tsx"
Cohesion: 0.11
Nodes (30): PHOTOS, Splash(), styles, Discover(), greeting(), HomeTab(), styles, CommunityBanner() (+22 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, noEmit, paths, strict, types, exclude (+2 more)

### Community 12 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, export:web, graph, ios, lint, start, test (+2 more)

### Community 13 - "e2e-supabase.mjs"
Cohesion: 0.13
Nodes (10): @supabase/supabase-js@^2.119.0, @supabase/supabase-js, book(), cand, card, [compId, memId], got, img (+2 more)

### Community 14 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

### Community 15 - "flow.ts"
Cohesion: 0.28
Nodes (10): hasIdentity(), ConsentKind, needsSetup(), SessionUser, afterAuth(), afterPin(), goHome(), resetTo() (+2 more)

### Community 16 - "demo.ts"
Cohesion: 0.07
Nodes (32): agreedAt(), Consent, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents(), Policy (+24 more)

### Community 17 - "errorMessage"
Cohesion: 0.10
Nodes (55): Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Approvals(), CompanionPicker() (+47 more)

### Community 18 - "formatINR"
Cohesion: 0.24
Nodes (17): expo-image, CompanionProfile(), styles, CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton() (+9 more)

### Community 19 - "booking.ts"
Cohesion: 0.11
Nodes (33): BookingChoice, BookingPicker(), styles, WEEK, AvailabilityEditor(), AvailabilityValue, HOURS, styles (+25 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "admin/index.tsx"
Cohesion: 0.39
Nodes (7): AdminOverview(), BLINK, Money(), PanicBanner(), styles, StatTile(), ListRow()

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "privacy.tsx"
Cohesion: 0.13
Nodes (26): AreaSheet(), CitySheet(), Dropdown(), fold(), LocationFields(), LocationValue, NoMatch(), Row() (+18 more)

### Community 24 - "setup-profile.tsx"
Cohesion: 0.18
Nodes (18): Chip(), COUNTRIES, MEET, Options(), Step, styles, identityComplete(), IdentityValue (+10 more)

### Community 25 - "review.tsx"
Cohesion: 0.26
Nodes (11): Checkout(), newKey(), RELATIONS, Step(), styles, amountDuePaise(), canHomeVisit(), meetingPlaceError() (+3 more)

### Community 26 - "formatINR"
Cohesion: 0.13
Nodes (29): Row(), perks(), CategoryCard(), styles, a11y(), PackageGrid(), Props, styles (+21 more)

### Community 27 - "onboarding.tsx"
Cohesion: 0.18
Nodes (20): initial(), CompanionOnboarding(), INTERESTS, Line(), Options(), Step, STEPS, styles (+12 more)

### Community 28 - "landing.py"
Cohesion: 0.09
Nodes (43): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+35 more)

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

### Community 33 - "[key].tsx"
Cohesion: 0.21
Nodes (13): CategoryPage(), styles, CATEGORIES, CategoryKey, categoryOf(), categoryTitle(), offersCategory(), durationLine() (+5 more)

### Community 34 - "admin.ts"
Cohesion: 0.24
Nodes (11): AdminAction, adminBookingState(), BookingTab, can(), canActOn(), describeAction(), isSuperadmin(), refundableAmount() (+3 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 36 - "pack-web.js"
Cohesion: 0.20
Nodes (6): fs, fs, html, js, mime, path

### Community 37 - "lib/chat.ts"
Cohesion: 0.14
Nodes (14): mergeMessages(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status, toMessage(), useChat() (+6 more)

### Community 38 - "pathlib"
Cohesion: 0.13
Nodes (8): pair(), phone(), section(), icon(), mark(), font_card(), icon(), mark()

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

### Community 44 - "logo.py"
Cohesion: 0.47
Nodes (3): letters(), monogram(), wordmark()

### Community 45 - "confirm.tsx"
Cohesion: 0.40
Nodes (4): Ask, ConfirmOptions, Ctx, styles

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
Nodes (66): Admins(), AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap(), PanicDetail(), styles (+58 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 52 - "app/_layout.tsx"
Cohesion: 0.11
Nodes (26): expo-font@~58.0.10, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-status-bar, react-native-gesture-handler, AppEffects(), RootLayout() (+18 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "preview.tsx"
Cohesion: 0.20
Nodes (19): ProfileTab(), styles, isStaff(), seeLabel(), companionStatusLine(), idCheckValue(), endPreview(), go() (+11 more)

### Community 55 - "push.ts"
Cohesion: 0.22
Nodes (8): expo-constants@~58.0.13, expo-device@~58.0.5, expo-notifications@~58.1.8, expo-constants, expo-device, expo-notifications, openFromPush(), registerForPush()

## Knowledge Gaps
- **2 isolated node(s):** `expo/tsconfig.base`, `COMMUNITY_IMAGE`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 395 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `layout.tsx`, `[key].tsx`, `components/bookings.tsx`, `radius`, `home.tsx`, `confirm.tsx`, `errorMessage`, `formatINR`, `booking.ts`, `app/_layout.tsx`, `admin/index.tsx`, `preview.tsx`, `privacy.tsx`, `setup-profile.tsx`, `review.tsx`, `formatINR`, `onboarding.tsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base`, `COMMUNITY_IMAGE` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06183574879227053 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `components/bookings.tsx`, `session.ts`, `radius`, `package.json`, `devDependencies`, `home.tsx`, `errorMessage`, `formatINR`, `booking.ts`, `admin/index.tsx`, `privacy.tsx`, `setup-profile.tsx`, `review.tsx`, `formatINR`, `onboarding.tsx`, `[key].tsx`, `lib/chat.ts`, `pay/[bookingId].tsx`, `wallet.tsx`, `confirm.tsx`, `Text`, `app/_layout.tsx`, `preview.tsx`, `push.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07238394964594808 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `e2e-supabase.mjs` to `devDependencies`, `lib/chat.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `components/bookings.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06626506024096386 - nodes in this community are weakly interconnected._