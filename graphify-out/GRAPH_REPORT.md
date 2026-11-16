# Graph Report - prsnn-mobile  (2026-11-16)

## Corpus Check
- 179 files · ~306,081 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1592 nodes · 7231 edges · 58 communities (55 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 244 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e73de361`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- layout.tsx
- components/bookings.tsx
- expo
- session.ts
- states.tsx
- package.json
- devDependencies
- demoAdmin.ts
- search.tsx
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
- Text
- journey.py
- privacy.tsx
- home.tsx
- (tabs)/bookings.tsx
- formatINR
- react-native
- landing.py
- bar
- body
- pathlib
- btn
- plans.tsx
- config.ts
- brand_screens.py
- make_icons.py
- lib/chat.ts
- brand_directions.py
- ic
- wordmark_dot.py
- pay/[bookingId].tsx
- card_systems.py
- wallet.tsx
- view-as.tsx
- Chat
- logo_concepts.py
- view_as.py
- logo_luxe.py
- admin.tsx
- wordmarks.py
- categories.py
- app/_layout.tsx
- m_book
- verification.ts
- push.ts
- rules.ts
- externalTarget

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
- `CompanionOnboarding()` --indirect_call--> `categoryTitle()`  [INFERRED]
  src/app/fellow/onboarding.tsx → src/domain/categories.ts
- `AdminBookingDetail()` --calls--> `Button()`  [EXTRACTED]
  src/app/admin/booking/[id].tsx → src/components/ui/Button.tsx
- `AdminBookingDetail()` --calls--> `ErrorState()`  [EXTRACTED]
  src/app/admin/booking/[id].tsx → src/components/ui/layout.tsx
- `AdminBookingDetail()` --calls--> `Header()`  [EXTRACTED]
  src/app/admin/booking/[id].tsx → src/components/ui/layout.tsx

## Import Cycles
- None detected.

## Communities (58 total, 3 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.06
Nodes (44): BookingTab, BusyTime, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, ApprovalStatus (+36 more)

### Community 1 - "layout.tsx"
Cohesion: 0.09
Nodes (63): expo-haptics, expo-router, react, react-native, react-native-safe-area-context, @tanstack/react-query, styles, EMPTY (+55 more)

### Community 3 - "components/bookings.tsx"
Cohesion: 0.17
Nodes (33): BookingDetail(), styles, Confirmed(), OfferSummary(), Phase, styles, PanicScreen(), MessagesTab() (+25 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (47): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+39 more)

### Community 5 - "session.ts"
Cohesion: 0.17
Nodes (22): @react-native-async-storage/async-storage, loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken(), checkLocalPin() (+14 more)

### Community 6 - "states.tsx"
Cohesion: 0.06
Nodes (39): react-native-reanimated, DOT_FADE, DOT_SETTLE, styles, PinCheck(), Pin(), styles, WEAK (+31 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (51): dependencies, expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/outfit@^0.4.3, @expo-google-fonts/urbanist@^0.4.2, expo-haptics@~58.0.7 (+43 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (28): AuditEntry, CityPlan, PanicAlert, backend, Backend, activity, allDays, bk() (+20 more)

### Community 10 - "search.tsx"
Cohesion: 0.07
Nodes (38): AppSignups(), Counts(), CategoryPage(), styles, DeckCard(), Dot(), HomeCategories(), styles (+30 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, noEmit, paths, strict, types, exclude (+2 more)

### Community 12 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, export:web, graph, ios, lint, start, test (+2 more)

### Community 13 - "e2e-supabase.mjs"
Cohesion: 0.09
Nodes (14): fs, book(), cand, card, [compId, memId], got, img, offer (+6 more)

### Community 14 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

### Community 15 - "flow.ts"
Cohesion: 0.28
Nodes (10): hasIdentity(), ConsentKind, needsSetup(), SessionUser, afterAuth(), afterPin(), goHome(), resetTo() (+2 more)

### Community 16 - "demo.ts"
Cohesion: 0.08
Nodes (24): Policy, allDays, bookings, companionStatus(), day(), demo, DemoCompanion, demoConsents (+16 more)

### Community 17 - "errorMessage"
Cohesion: 0.12
Nodes (40): Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Approvals(), styles (+32 more)

### Community 18 - "formatINR"
Cohesion: 0.27
Nodes (18): CompanionProfile(), styles, BookingPicker(), CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton() (+10 more)

### Community 19 - "booking.ts"
Cohesion: 0.10
Nodes (31): Checkout(), newKey(), RELATIONS, Step(), styles, AvailabilityValue, HOURS, styles (+23 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "Text"
Cohesion: 0.11
Nodes (64): AdminOverview(), BLINK, Money(), PanicBanner(), styles, Plans(), AdminPrices(), Draft (+56 more)

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "privacy.tsx"
Cohesion: 0.14
Nodes (19): AreaSheet(), CitySheet(), fold(), NoMatch(), Row(), Sheet(), StateSheet(), titleCase() (+11 more)

### Community 24 - "home.tsx"
Cohesion: 0.17
Nodes (18): expo-linear-gradient, PHOTOS, Splash(), styles, Discover(), greeting(), HomeTab(), styles (+10 more)

### Community 25 - "(tabs)/bookings.tsx"
Cohesion: 0.15
Nodes (19): Earnings(), BookingsTab(), styles, TABS, awaitingAnswer(), BookingTab, canPay(), earningsFor() (+11 more)

### Community 26 - "formatINR"
Cohesion: 0.13
Nodes (30): perks(), BookingChoice, styles, WEEK, a11y(), PackageGrid(), Props, styles (+22 more)

### Community 27 - "react-native"
Cohesion: 0.09
Nodes (46): expo-image, EditProfile(), styles, CompanionOnboarding(), INTERESTS, Line(), Options(), Step (+38 more)

### Community 28 - "landing.py"
Cohesion: 0.09
Nodes (43): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+35 more)

### Community 29 - "bar"
Cohesion: 0.12
Nodes (54): avatar(), bar(), card(), checkbox(), chips(), field(), label(), pill() (+46 more)

### Community 30 - "body"
Cohesion: 0.16
Nodes (43): body(), group(), h(), row(), s_admin(), s_admin_booking(), s_bookings(), s_dashboard() (+35 more)

### Community 31 - "pathlib"
Cohesion: 0.19
Nodes (6): composer(), header(), svg(), letters(), monogram(), wordmark()

### Community 32 - "btn"
Cohesion: 0.15
Nodes (39): btn(), foot(), notice(), s_book_time(), s_companion(), s_confirmed(), s_email(), s_otp() (+31 more)

### Community 33 - "plans.tsx"
Cohesion: 0.22
Nodes (11): EMPTY, Row(), styles, Availability(), AvailabilityForm(), initial(), AvailabilityEditor(), emptyAvailability() (+3 more)

### Community 34 - "config.ts"
Cohesion: 0.20
Nodes (8): react-native-url-polyfill@^4.0.0, @supabase/supabase-js@^2.119.0, react-native-url-polyfill, @supabase/supabase-js, SITE_URL, SUPABASE_KEY, SUPABASE_URL, supabase

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 37 - "lib/chat.ts"
Cohesion: 0.27
Nodes (8): mergeMessages(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status, toMessage(), useChat()

### Community 38 - "brand_directions.py"
Cohesion: 0.33
Nodes (3): pair(), phone(), section()

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 40 - "wordmark_dot.py"
Cohesion: 0.60
Nodes (3): font_card(), icon(), mark()

### Community 41 - "pay/[bookingId].tsx"
Cohesion: 0.20
Nodes (14): METHODS, Pay(), styles, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props (+6 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "wallet.tsx"
Cohesion: 0.29
Nodes (7): react-native-svg@15.16.0, react-native-svg, Guilloche, Material, MaterialCard(), MATERIALS, styles

### Community 44 - "view-as.tsx"
Cohesion: 0.33
Nodes (5): Data, DATA, STARTS, styles, WHO

### Community 45 - "Chat"
Cohesion: 0.50
Nodes (5): Chat(), time(), RiseIn(), typing, TypingDots()

### Community 46 - "logo_concepts.py"
Cohesion: 0.19
Nodes (10): card(), diamond(), diamond_only(), face_to_face(), pin_p(), svg(), two_seats(), uid() (+2 more)

### Community 47 - "view_as.py"
Cohesion: 0.26
Nodes (10): s_action(), s_companion_dash(), s_companion_onb(), s_exit(), s_member_book(), s_member_home(), s_pick(), s_switch() (+2 more)

### Community 48 - "logo_luxe.py"
Cohesion: 0.29
Nodes (9): card(), cut(), gem(), linked(), signature(), svg(), uid(), word() (+1 more)

### Community 49 - "admin.tsx"
Cohesion: 0.07
Nodes (69): Admins(), AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap(), PanicDetail(), tel() (+61 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 52 - "app/_layout.tsx"
Cohesion: 0.13
Nodes (22): expo-font@~58.0.10, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-splash-screen, expo-status-bar, react-native-gesture-handler (+14 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "verification.ts"
Cohesion: 0.31
Nodes (9): CompanionDashboard(), Stat(), VerificationStatus, companionStatusLine(), ID_TYPES, idUploadError(), isLiveCompanion(), needsBack() (+1 more)

### Community 55 - "push.ts"
Cohesion: 0.20
Nodes (9): expo-constants@~58.0.13, expo-device@~58.0.5, expo-notifications@~58.1.8, expo-constants, expo-device, expo-notifications, DEMO, openFromPush() (+1 more)

### Community 56 - "rules.ts"
Cohesion: 0.39
Nodes (7): agreedAt(), Consent, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

## Knowledge Gaps
- **2 isolated node(s):** `expo/tsconfig.base`, `COMMUNITY_IMAGE`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 394 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `layout.tsx`, `components/bookings.tsx`, `states.tsx`, `search.tsx`, `errorMessage`, `formatINR`, `booking.ts`, `privacy.tsx`, `home.tsx`, `(tabs)/bookings.tsx`, `formatINR`, `react-native`, `plans.tsx`, `pay/[bookingId].tsx`, `view-as.tsx`, `Chat`, `admin.tsx`, `app/_layout.tsx`, `verification.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base`, `COMMUNITY_IMAGE` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.058673469387755105 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `components/bookings.tsx`, `session.ts`, `states.tsx`, `package.json`, `search.tsx`, `errorMessage`, `formatINR`, `booking.ts`, `Text`, `home.tsx`, `(tabs)/bookings.tsx`, `formatINR`, `react-native`, `plans.tsx`, `config.ts`, `pay/[bookingId].tsx`, `wallet.tsx`, `view-as.tsx`, `admin.tsx`, `app/_layout.tsx`, `push.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09194193141173995 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `config.ts` to `lib/chat.ts`, `e2e-supabase.mjs`, `package.json`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Should `expo` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._