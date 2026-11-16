# Graph Report - prsnn-mobile  (2026-11-16)

## Corpus Check
- 186 files · ~308,556 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1623 nodes · 7394 edges · 74 communities (59 shown, 15 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 245 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7a25f275`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- profile.tsx
- package.json
- motion.tsx
- expo
- session.ts
- PlacePicker.tsx
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
- IdentityForm.tsx
- booking.ts
- screens_v2.py
- plans.tsx
- journey.py
- LocationFields.tsx
- Dashboard.tsx
- expo-secure-store
- companion/[id].tsx
- flow.ts
- landing.py
- bar
- body
- chat_keyboard.py
- btn
- search.tsx
- useSession
- brand_screens.py
- errorMessage
- lib/chat.ts
- pathlib
- ic
- interest.ts
- pay/[bookingId].tsx
- card_systems.py
- wallet.tsx
- PhotoCard.tsx
- places.ts
- logo_concepts.py
- view_as.py
- logo_luxe.py
- Text
- wordmarks.py
- categories.py
- states.tsx
- m_book
- preview.tsx
- home.tsx
- jest
- brand_directions.py
- admin/index.tsx
- wordmark_dot.py
- expo@~58.0.20
- expo-constants
- expo-device
- expo-font
- @expo-google-fonts/urbanist@^0.4.2
- expo-haptics
- react-dom@19.3.0
- react-native-gesture-handler
- react-native-screens@~4.30.0
- react-native-web@~0.21.4
- react-native-webview
- @supabase/supabase-js
- zod@^4.6.7

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
- `CompanionOnboarding()` --indirect_call--> `categoryTitle()`  [INFERRED]
  src/app/fellow/onboarding.tsx → src/domain/categories.ts
- `AdminLayout()` --calls--> `AdminGate()`  [EXTRACTED]
  src/app/admin/_layout.tsx → src/components/admin.tsx
- `tab()` --calls--> `Icon`  [EXTRACTED]
  src/app/(tabs)/_layout.tsx → src/components/ui/Icon.tsx
- `TabsLayout()` --calls--> `useSession`  [EXTRACTED]
  src/app/(tabs)/_layout.tsx → src/state/session.ts

## Import Cycles
- None detected.

## Communities (74 total, 15 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.06
Nodes (40): BusyTime, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, Availability, BookingStatus, BroadcastAudience (+32 more)

### Community 1 - "profile.tsx"
Cohesion: 0.13
Nodes (32): open(), SignedOut(), tab(), TabsLayout(), MessagesTab(), styles, ProfileTab(), styles (+24 more)

### Community 2 - "package.json"
Cohesion: 0.11
Nodes (18): expo-crypto@~58.0.7, @expo-google-fonts/outfit@^0.4.3, expo-linking@~58.0.14, expo-notifications@~58.1.8, expo-splash-screen@~58.0.11, expo-system-ui@~58.0.6, react-native-worklets@0.13.0, main (+10 more)

### Community 3 - "motion.tsx"
Cohesion: 0.11
Nodes (25): Chat(), styles, time(), HoldButton(), PanicButton(), bob, EASE_OUT, EASE_OUT_CSS (+17 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (47): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+39 more)

### Community 5 - "session.ts"
Cohesion: 0.16
Nodes (23): @react-native-async-storage/async-storage@2.2.0, @react-native-async-storage/async-storage, loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken() (+15 more)

### Community 6 - "PlacePicker.tsx"
Cohesion: 0.25
Nodes (12): Privacy(), PrivacyForm(), identityComplete(), AreaPicker(), CityPicker(), CitySheet(), PickerField(), SearchSheet() (+4 more)

### Community 7 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, expo-image@~58.0.17, expo-image-picker@~58.0.10, expo-linear-gradient@~58.0.3, expo-router@~58.0.27, expo-status-bar@~58.0.4 (+17 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (29): AdminBooking, AuditEntry, BroadcastRecord, CityPlan, PanicAlert, Backend, activity, allDays (+21 more)

### Community 10 - "layout.tsx"
Cohesion: 0.07
Nodes (81): expo-image, expo-linear-gradient, expo-router, react, react-native, @tanstack/react-query, AdminLayout(), Data (+73 more)

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
Cohesion: 0.20
Nodes (17): AdminBookingDetail(), PersonLink(), Wrap(), rupeeField(), AdminAction, adminBookingState(), BookingTab, can() (+9 more)

### Community 15 - "rules.ts"
Cohesion: 0.39
Nodes (7): agreedAt(), Consent, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

### Community 16 - "demo.ts"
Cohesion: 0.07
Nodes (25): AppNotification, Policy, allDays, bookings, companionStatus(), day(), demo, DemoCompanion (+17 more)

### Community 17 - "admin.tsx"
Cohesion: 0.13
Nodes (37): AdminAdmins(), Admins(), styles, Sheet, styles, PanicDetail(), styles, tel() (+29 more)

### Community 18 - "IdentityForm.tsx"
Cohesion: 0.29
Nodes (12): IdentityForm(), IdentityValue, styles, defaultVisibility(), GENDER_OPTIONS, SEE_OPTIONS, VISIBILITY_COPY, ApprovalStatus (+4 more)

### Community 19 - "booking.ts"
Cohesion: 0.07
Nodes (43): Checkout(), newKey(), Earnings(), EarningsScreen(), BookingsTab(), styles, TABS, EarningsTab() (+35 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "plans.tsx"
Cohesion: 0.24
Nodes (9): EMPTY, styles, AdminPrices(), Draft, draftOf(), Pair(), Prices(), styles (+1 more)

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "LocationFields.tsx"
Cohesion: 0.37
Nodes (12): AreaSheet(), CitySheet(), Dropdown(), fold(), LocationFields(), LocationValue, NoMatch(), Row() (+4 more)

### Community 24 - "Dashboard.tsx"
Cohesion: 0.22
Nodes (14): CompanionDashboard(), Stat(), styles, BellButton(), ListRow(), Section(), VerificationStatus, companionStatusLine() (+6 more)

### Community 26 - "companion/[id].tsx"
Cohesion: 0.08
Nodes (60): CategoryPage(), CompanionProfile(), styles, perks(), BookingChoice, BookingPicker(), styles, WEEK (+52 more)

### Community 27 - "flow.ts"
Cohesion: 0.26
Nodes (11): hasIdentity(), ConsentKind, firstUnanswered(), needsSetup(), SessionUser, afterAuth(), afterPin(), goHome() (+3 more)

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

### Community 33 - "search.tsx"
Cohesion: 0.24
Nodes (12): SearchTab(), styles, useLiveCompanions(), CategoryKey, offersCategory(), cityCount, seeLabel(), filterCompanions() (+4 more)

### Community 34 - "useSession"
Cohesion: 0.18
Nodes (34): Row(), BookingDetail(), styles, Confirmed(), styles, OfferSummary(), PanicScreen(), Pay() (+26 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.14
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 36 - "errorMessage"
Cohesion: 0.13
Nodes (50): react-native-safe-area-context, Activity(), AdminActivity(), priceDiff(), short(), styles, Approvals(), styles (+42 more)

### Community 37 - "lib/chat.ts"
Cohesion: 0.14
Nodes (14): mergeMessages(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status, toMessage(), useChat() (+6 more)

### Community 38 - "pathlib"
Cohesion: 0.19
Nodes (5): letters(), monogram(), wordmark(), icon(), mark()

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

### Community 44 - "PhotoCard.tsx"
Cohesion: 0.14
Nodes (15): DeckCard(), Dot(), HomeCategories(), styles, DARK, ICON, Parallax, ParallaxPhoto() (+7 more)

### Community 45 - "places.ts"
Cohesion: 0.21
Nodes (9): ALL_PLACES, areaName(), fold(), Place, POPULAR, STATE_NAMES, uniqueAreas(), normaliseCompanion() (+1 more)

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
Nodes (71): react-native-reanimated, ViewAs(), DeleteAccount(), EditForm(), EditProfile(), styles, Apply(), Availability() (+63 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 52 - "states.tsx"
Cohesion: 0.21
Nodes (17): AppEffects(), RootLayout(), styles, ConfirmProvider(), connectOnlineManager(), OfflineBanner(), setUnauthorizedHandler(), MAX_APP_WIDTH (+9 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "preview.tsx"
Cohesion: 0.26
Nodes (13): endPreview(), go(), PreviewAs, PreviewStart, routeFor(), sampleUser(), startLivePreview(), startPreview() (+5 more)

### Community 56 - "home.tsx"
Cohesion: 0.30
Nodes (10): Splash(), Discover(), greeting(), HomeTab(), styles, CommunityBanner(), RulesCard(), Logo() (+2 more)

### Community 57 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

### Community 58 - "brand_directions.py"
Cohesion: 0.33
Nodes (3): pair(), phone(), section()

### Community 59 - "admin/index.tsx"
Cohesion: 0.43
Nodes (6): AdminOverview(), BLINK, Money(), PanicBanner(), styles, StatTile()

### Community 60 - "wordmark_dot.py"
Cohesion: 0.60
Nodes (3): font_card(), icon(), mark()

## Knowledge Gaps
- **2 isolated node(s):** `COMMUNITY_IMAGE`, `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 398 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `profile.tsx`, `motion.tsx`, `PlacePicker.tsx`, `layout.tsx`, `admin.ts`, `admin.tsx`, `IdentityForm.tsx`, `booking.ts`, `plans.tsx`, `LocationFields.tsx`, `Dashboard.tsx`, `companion/[id].tsx`, `search.tsx`, `useSession`, `errorMessage`, `PhotoCard.tsx`, `states.tsx`, `preview.tsx`, `home.tsx`, `admin/index.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `COMMUNITY_IMAGE`, `expo/tsconfig.base` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06262626262626263 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `profile.tsx`, `package.json`, `motion.tsx`, `session.ts`, `PlacePicker.tsx`, `dependencies`, `admin.tsx`, `IdentityForm.tsx`, `booking.ts`, `plans.tsx`, `LocationFields.tsx`, `Dashboard.tsx`, `companion/[id].tsx`, `search.tsx`, `useSession`, `errorMessage`, `lib/chat.ts`, `pay/[bookingId].tsx`, `wallet.tsx`, `PhotoCard.tsx`, `Text`, `states.tsx`, `preview.tsx`, `home.tsx`, `admin/index.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `profile.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12513842746400886 - nodes in this community are weakly interconnected._
- **Why does `react` connect `layout.tsx` to `profile.tsx`, `package.json`, `motion.tsx`, `PlacePicker.tsx`, `dependencies`, `admin.tsx`, `booking.ts`, `plans.tsx`, `LocationFields.tsx`, `Dashboard.tsx`, `companion/[id].tsx`, `search.tsx`, `useSession`, `errorMessage`, `lib/chat.ts`, `pay/[bookingId].tsx`, `wallet.tsx`, `PhotoCard.tsx`, `Text`, `states.tsx`, `home.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._