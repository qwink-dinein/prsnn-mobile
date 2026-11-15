# Graph Report - prsnn-mobile  (2026-11-15)

## Corpus Check
- 170 files · ~301,267 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1548 nodes · 7045 edges · 55 communities (53 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 244 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b314fe9e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- admin.tsx
- plans.tsx
- formatINR
- expo
- session.ts
- tokens.ts
- push.ts
- devDependencies
- package.json
- layout.tsx
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- LocationFields.tsx
- demo.ts
- chat/[bookingId].tsx
- pin.tsx
- screens_v2.py
- booking.ts
- journey.py
- search.tsx
- IdentityForm.tsx
- Text
- companion/[id].tsx
- onboarding.tsx
- landing.py
- bar
- body
- brand_directions.py
- btn
- motion.tsx
- verification.ts
- brand_screens.py
- privacy.tsx
- useSession
- wordmark_dot.py
- ic
- profile.tsx
- card_systems.py
- pathlib
- logo_concepts.py
- view_as.py
- logo_luxe.py
- Text
- wordmarks.py
- categories.py
- app/_layout.tsx
- m_book
- dependencies
- chat_keyboard.py
- config.ts

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
10. `colors` - 87 edges

## Surprising Connections (you probably didn't know these)
- `CompanionOnboarding()` --indirect_call--> `categoryTitle()`  [INFERRED]
  src/app/fellow/onboarding.tsx → src/domain/categories.ts
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `Chat()` --calls--> `typing`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/motion.tsx
- `ProfileTab()` --calls--> `useConfirm()`  [EXTRACTED]
  src/app/(tabs)/profile.tsx → src/components/ui/confirm.tsx
- `ProfileTab()` --calls--> `Icon`  [EXTRACTED]
  src/app/(tabs)/profile.tsx → src/components/ui/Icon.tsx

## Import Cycles
- None detected.

## Communities (55 total, 2 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.05
Nodes (55): AdminBooking, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, ApprovalStatus, AuditEntry, Availability (+47 more)

### Community 1 - "admin.tsx"
Cohesion: 0.13
Nodes (41): AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap(), PanicDetail(), styles, tel() (+33 more)

### Community 2 - "plans.tsx"
Cohesion: 0.21
Nodes (11): EMPTY, Row(), styles, AdminPrices(), Draft, draftOf(), Pair(), Prices() (+3 more)

### Community 3 - "formatINR"
Cohesion: 0.14
Nodes (38): Checkout(), BookingDetail(), styles, Confirmed(), styles, METHODS, Pay(), styles (+30 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (44): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+36 more)

### Community 5 - "session.ts"
Cohesion: 0.13
Nodes (27): PanicScreen(), PULSE, styles, idOf(), loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone() (+19 more)

### Community 6 - "tokens.ts"
Cohesion: 0.09
Nodes (51): expo-image, expo-linear-gradient, expo-router, react, react-native, EMPTY, styles, styles (+43 more)

### Community 7 - "push.ts"
Cohesion: 0.22
Nodes (8): expo-constants@~58.0.13, expo-device@~58.0.5, expo-notifications@~58.1.8, expo-constants, expo-device, expo-notifications, openFromPush(), registerForPush()

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/urbanist@^0.4.2, expo-secure-store@~58.0.2, react-dom@19.3.0, react-native-screens@~4.30.0, react-native-svg@15.16.0, react-native-web@~0.21.4 (+14 more)

### Community 10 - "layout.tsx"
Cohesion: 0.07
Nodes (37): expo-haptics, react-native-reanimated, STARTS, styles, WHO, DOT_FADE, DOT_SETTLE, styles (+29 more)

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

### Community 15 - "LocationFields.tsx"
Cohesion: 0.42
Nodes (11): AreaSheet(), CitySheet(), Dropdown(), fold(), LocationFields(), NoMatch(), Row(), Sheet() (+3 more)

### Community 16 - "demo.ts"
Cohesion: 0.08
Nodes (25): AppNotification, SessionUser, AuthResult, allDays, bookings, companionStatus(), day(), DemoCompanion (+17 more)

### Community 17 - "chat/[bookingId].tsx"
Cohesion: 0.15
Nodes (18): Chat(), styles, time(), HoldButton(), PanicButton(), RiseIn(), TypingDots(), mergeMessages() (+10 more)

### Community 19 - "pin.tsx"
Cohesion: 0.23
Nodes (14): PinCheck(), Pin(), styles, WEAK, PinPad(), useShake(), hasIdentity(), firstUnanswered() (+6 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "booking.ts"
Cohesion: 0.10
Nodes (38): SelectDateTime(), styles, WEEK, newKey(), RELATIONS, Step(), styles, adminWhen() (+30 more)

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "search.tsx"
Cohesion: 0.26
Nodes (8): styles, CATEGORIES, CategoryKey, offersCategory(), filterCompanions(), Sort, SORTS, b()

### Community 24 - "IdentityForm.tsx"
Cohesion: 0.38
Nodes (9): IdentityValue, styles, GENDER_OPTIONS, SEE_OPTIONS, VISIBILITY_COPY, Gender, SeeGender, Visibility (+1 more)

### Community 25 - "Text"
Cohesion: 0.09
Nodes (60): react-native-safe-area-context, @tanstack/react-query, Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins() (+52 more)

### Community 26 - "companion/[id].tsx"
Cohesion: 0.06
Nodes (66): CategoryPage(), CompanionProfile(), styles, perks(), Availability(), AvailabilityForm(), initial(), CompanionCard() (+58 more)

### Community 27 - "onboarding.tsx"
Cohesion: 0.16
Nodes (25): CompanionOnboarding(), INTERESTS, Line(), Options(), Step, STEPS, styles, Chip() (+17 more)

### Community 28 - "landing.py"
Cohesion: 0.09
Nodes (43): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+35 more)

### Community 29 - "bar"
Cohesion: 0.12
Nodes (54): avatar(), bar(), card(), checkbox(), chips(), field(), label(), pill() (+46 more)

### Community 30 - "body"
Cohesion: 0.16
Nodes (43): body(), group(), h(), row(), s_admin(), s_admin_booking(), s_bookings(), s_dashboard() (+35 more)

### Community 31 - "brand_directions.py"
Cohesion: 0.33
Nodes (3): pair(), phone(), section()

### Community 32 - "btn"
Cohesion: 0.15
Nodes (39): btn(), foot(), notice(), s_book_time(), s_companion(), s_confirmed(), s_email(), s_otp() (+31 more)

### Community 33 - "motion.tsx"
Cohesion: 0.14
Nodes (15): bob, EASE_OUT, EASE_OUT_CSS, easeOutQuart(), fadeOnly, fadeUp, fromLeft, fromRight (+7 more)

### Community 34 - "verification.ts"
Cohesion: 0.25
Nodes (13): OfferSummary(), Phase, styles, VerifyId(), Upload(), personOf(), VerificationStatus, companionStatusLine() (+5 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.14
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 36 - "privacy.tsx"
Cohesion: 0.16
Nodes (20): Privacy(), PrivacyForm(), identityComplete(), IdentityForm(), AreaPicker(), CityPicker(), CitySheet(), PickerField() (+12 more)

### Community 37 - "useSession"
Cohesion: 0.13
Nodes (33): AppEffects(), BookingsTab(), styles, TABS, tab(), TabsLayout(), MessagesTab(), styles (+25 more)

### Community 38 - "wordmark_dot.py"
Cohesion: 0.60
Nodes (3): font_card(), icon(), mark()

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 40 - "profile.tsx"
Cohesion: 0.13
Nodes (26): ProfileTab(), styles, AdminAction, BookingTab, can(), canActOn(), describeAction(), isStaff() (+18 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

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

### Community 49 - "Text"
Cohesion: 0.12
Nodes (50): Broadcast(), AdminOverview(), BLINK, Money(), PanicBanner(), styles, ViewAs(), DeleteAccount() (+42 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 52 - "app/_layout.tsx"
Cohesion: 0.13
Nodes (18): expo-font@~58.0.10, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-splash-screen, expo-status-bar, react-native-gesture-handler (+10 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 55 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/outfit@^0.4.3, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-image-picker@~58.0.10, expo-linear-gradient@~58.0.3 (+22 more)

### Community 61 - "chat_keyboard.py"
Cohesion: 0.38
Nodes (3): composer(), header(), svg()

### Community 65 - "config.ts"
Cohesion: 0.18
Nodes (9): @react-native-async-storage/async-storage@2.2.0, react-native-url-polyfill@^4.0.0, @supabase/supabase-js@^2.119.0, @react-native-async-storage/async-storage, react-native-url-polyfill, @supabase/supabase-js, SITE_URL, SUPABASE_KEY (+1 more)

## Knowledge Gaps
- **2 isolated node(s):** `expo/tsconfig.base`, `COMMUNITY_IMAGE`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 386 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `admin.tsx`, `plans.tsx`, `formatINR`, `session.ts`, `tokens.ts`, `layout.tsx`, `LocationFields.tsx`, `chat/[bookingId].tsx`, `pin.tsx`, `booking.ts`, `search.tsx`, `IdentityForm.tsx`, `Text`, `companion/[id].tsx`, `onboarding.tsx`, `verification.ts`, `privacy.tsx`, `useSession`, `profile.tsx`, `app/_layout.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base`, `COMMUNITY_IMAGE` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04613297150610583 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `tokens.ts` to `admin.tsx`, `plans.tsx`, `formatINR`, `session.ts`, `push.ts`, `package.json`, `layout.tsx`, `LocationFields.tsx`, `chat/[bookingId].tsx`, `pin.tsx`, `booking.ts`, `search.tsx`, `IdentityForm.tsx`, `Text`, `companion/[id].tsx`, `onboarding.tsx`, `motion.tsx`, `verification.ts`, `privacy.tsx`, `useSession`, `profile.tsx`, `Text`, `app/_layout.tsx`, `dependencies`, `config.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `admin.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13010204081632654 - nodes in this community are weakly interconnected._
- **Why does `react` connect `tokens.ts` to `admin.tsx`, `plans.tsx`, `formatINR`, `session.ts`, `package.json`, `layout.tsx`, `LocationFields.tsx`, `chat/[bookingId].tsx`, `pin.tsx`, `booking.ts`, `search.tsx`, `Text`, `companion/[id].tsx`, `onboarding.tsx`, `motion.tsx`, `verification.ts`, `privacy.tsx`, `useSession`, `Text`, `app/_layout.tsx`, `dependencies`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `formatINR` be split into smaller, more focused modules?**
  _Cohesion score 0.1362126245847176 - nodes in this community are weakly interconnected._