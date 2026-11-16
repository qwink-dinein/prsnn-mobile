# Graph Report - prsnn-mobile  (2026-11-16)

## Corpus Check
- 179 files · ~306,234 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1596 nodes · 7262 edges · 57 communities (51 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 244 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ffe60b46`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- layout.tsx
- booking.ts
- expo
- session.ts
- motion.tsx
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
- preview.tsx
- formatINR
- useSession
- screens_v2.py
- Text
- journey.py
- privacy.tsx
- IdentityForm.tsx
- search.tsx
- PackageGrid.tsx
- react-native
- landing.py
- bar
- body
- pathlib
- btn
- interest.ts
- admin.ts
- brand_screens.py
- make_icons.py
- lib/chat.ts
- brand_directions.py
- ic
- wordmark_dot.py
- pay/[bookingId].tsx
- card_systems.py
- expo-font
- expo-splash-screen
- expo-status-bar
- logo_concepts.py
- view_as.py
- logo_luxe.py
- errorMessage
- wordmarks.py
- categories.py
- app/_layout.tsx
- m_book
- verification.ts
- expo-constants
- rules.ts

## God Nodes (most connected - your core abstractions)
1. `Text()` - 205 edges
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
- `normaliseCompanion()` --calls--> `areaName()`  [EXTRACTED]
  src/services/backend.ts → src/domain/places.ts
- `toProfile()` --calls--> `areaName()`  [EXTRACTED]
  src/services/backend.ts → src/domain/places.ts
- `SelectDateTime()` --calls--> `BookingPicker()`  [EXTRACTED]
  src/app/book/[id].tsx → src/components/BookingPicker.tsx
- `SelectDateTime()` --calls--> `Button()`  [EXTRACTED]
  src/app/book/[id].tsx → src/components/ui/Button.tsx

## Import Cycles
- None detected.

## Communities (57 total, 6 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.06
Nodes (43): BusyTime, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, Availability, BookingStatus, BroadcastAudience (+35 more)

### Community 1 - "layout.tsx"
Cohesion: 0.06
Nodes (97): expo-haptics, expo-image, expo-linear-gradient, expo-router, react, react-native, react-native-reanimated, @tanstack/react-query (+89 more)

### Community 3 - "booking.ts"
Cohesion: 0.09
Nodes (61): RELATIONS, styles, BookingDetail(), styles, Confirmed(), styles, Earnings(), styles (+53 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (47): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+39 more)

### Community 5 - "session.ts"
Cohesion: 0.16
Nodes (23): @react-native-async-storage/async-storage@2.2.0, @react-native-async-storage/async-storage, loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken() (+15 more)

### Community 6 - "motion.tsx"
Cohesion: 0.12
Nodes (23): Chat(), styles, time(), HoldButton(), PanicButton(), bob, EASE_OUT, easeOutQuart() (+15 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (56): dependencies, expo@~58.0.20, expo-crypto@~58.0.7, expo-device@~58.0.5, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/outfit@^0.4.3, @expo-google-fonts/urbanist@^0.4.2 (+48 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (29): AuditEntry, BroadcastRecord, CityPlan, PanicAlert, backend, Backend, activity, allDays (+21 more)

### Community 10 - "home.tsx"
Cohesion: 0.12
Nodes (31): Panics(), CategoryPage(), Splash(), inFilter(), Notifications(), Discover(), greeting(), HomeTab() (+23 more)

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
Cohesion: 0.07
Nodes (25): AppNotification, Profile, allDays, bookings, companionStatus(), day(), demo, DemoCompanion (+17 more)

### Community 17 - "preview.tsx"
Cohesion: 0.19
Nodes (19): ProfileTab(), styles, ListRow(), isStaff(), companionStatusLine(), idCheckValue(), endPreview(), go() (+11 more)

### Community 18 - "formatINR"
Cohesion: 0.18
Nodes (23): AdminOverview(), Money(), PanicBanner(), SelectDateTime(), CompanionProfile(), Apply(), perks(), StatTile() (+15 more)

### Community 19 - "useSession"
Cohesion: 0.14
Nodes (21): DOT_FADE, DOT_SETTLE, Login(), styles, Wordmark(), Role(), tab(), TabsLayout() (+13 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "Text"
Cohesion: 0.16
Nodes (37): Approvals(), EMPTY, Plans(), styles, ViewAs(), Checkout(), newKey(), Step() (+29 more)

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "privacy.tsx"
Cohesion: 0.20
Nodes (18): AreaSheet(), CitySheet(), Dropdown(), fold(), LocationFields(), NoMatch(), Row(), Sheet() (+10 more)

### Community 24 - "IdentityForm.tsx"
Cohesion: 0.29
Nodes (11): identityComplete(), IdentityValue, styles, GENDER_OPTIONS, SEE_OPTIONS, VISIBILITY_COPY, ApprovalStatus, Gender (+3 more)

### Community 25 - "search.tsx"
Cohesion: 0.14
Nodes (24): PrivacyForm(), SearchTab(), styles, styles, AreaPicker(), CityPicker(), CitySheet(), PickerField() (+16 more)

### Community 26 - "PackageGrid.tsx"
Cohesion: 0.05
Nodes (66): AdminPrices(), draftOf(), Pair(), Prices(), Availability(), AvailabilityForm(), initial(), BookingChoice (+58 more)

### Community 27 - "react-native"
Cohesion: 0.13
Nodes (30): Row(), CompanionOnboarding(), INTERESTS, Line(), Options(), Step, STEPS, styles (+22 more)

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

### Community 33 - "interest.ts"
Cohesion: 0.31
Nodes (8): APPROVAL, categoryTitle(), MEET, roleLabel(), SignupChoices, signupDetails(), topCategories(), base

### Community 34 - "admin.ts"
Cohesion: 0.24
Nodes (11): AdminAction, adminBookingState(), BookingTab, can(), canActOn(), describeAction(), isSuperadmin(), refundableAmount() (+3 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 37 - "lib/chat.ts"
Cohesion: 0.14
Nodes (14): @supabase/supabase-js@^2.119.0, @supabase/supabase-js, mergeMessages(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status (+6 more)

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
Cohesion: 0.26
Nodes (9): baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet(), RazorpaySuccess, styles (+1 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 46 - "logo_concepts.py"
Cohesion: 0.19
Nodes (10): card(), diamond(), diamond_only(), face_to_face(), pin_p(), svg(), two_seats(), uid() (+2 more)

### Community 47 - "view_as.py"
Cohesion: 0.26
Nodes (10): s_action(), s_companion_dash(), s_companion_onb(), s_exit(), s_member_book(), s_member_home(), s_pick(), s_switch() (+2 more)

### Community 48 - "logo_luxe.py"
Cohesion: 0.29
Nodes (9): card(), cut(), gem(), linked(), signature(), svg(), uid(), word() (+1 more)

### Community 49 - "errorMessage"
Cohesion: 0.09
Nodes (82): react-native-safe-area-context, Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Admins() (+74 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 52 - "app/_layout.tsx"
Cohesion: 0.11
Nodes (23): expo-notifications@~58.1.8, react-native-gesture-handler@~3.3.0, expo-notifications, react-native-gesture-handler, AppEffects(), RootLayout(), styles, ConfirmProvider() (+15 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "verification.ts"
Cohesion: 0.36
Nodes (7): VerificationStatus, ID_TYPES, idTypeLabel(), idUploadError(), isLiveCompanion(), needsBack(), needsIdToAccept()

### Community 56 - "rules.ts"
Cohesion: 0.39
Nodes (7): agreedAt(), Consent, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

## Knowledge Gaps
- **2 isolated node(s):** `COMMUNITY_IMAGE`, `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 393 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `layout.tsx`, `booking.ts`, `motion.tsx`, `home.tsx`, `errorMessage`, `formatINR`, `useSession`, `preview.tsx`, `app/_layout.tsx`, `privacy.tsx`, `IdentityForm.tsx`, `search.tsx`, `PackageGrid.tsx`, `react-native`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `COMMUNITY_IMAGE`, `expo/tsconfig.base` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05851063829787234 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `booking.ts`, `session.ts`, `motion.tsx`, `package.json`, `lib/chat.ts`, `pay/[bookingId].tsx`, `home.tsx`, `errorMessage`, `preview.tsx`, `useSession`, `app/_layout.tsx`, `Text`, `formatINR`, `privacy.tsx`, `IdentityForm.tsx`, `search.tsx`, `PackageGrid.tsx`, `react-native`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06170212765957447 - nodes in this community are weakly interconnected._
- **Why does `expo-router` connect `layout.tsx` to `+not-found.tsx`, `booking.ts`, `motion.tsx`, `package.json`, `home.tsx`, `flow.ts`, `errorMessage`, `preview.tsx`, `useSession`, `app/_layout.tsx`, `Text`, `formatINR`, `search.tsx`, `PackageGrid.tsx`, `react-native`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `booking.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.091324200913242 - nodes in this community are weakly interconnected._