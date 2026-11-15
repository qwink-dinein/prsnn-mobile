# Graph Report - prsnn-mobile  (2026-11-15)

## Corpus Check
- 175 files · ~303,839 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1572 nodes · 7169 edges · 73 communities (56 shown, 17 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 244 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0fac8d8c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- verify.tsx
- layout.tsx
- components/bookings.tsx
- expo
- session.ts
- package.json
- devDependencies
- demoAdmin.ts
- Text
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- flow.ts
- demo.ts
- chat/[bookingId].tsx
- useSession
- screens_v2.py
- booking.ts
- journey.py
- privacy.tsx
- LocationFields.tsx
- ErrorState
- companion/[id].tsx
- onboarding.tsx
- landing.py
- bar
- body
- brand_directions.py
- btn
- motion.tsx
- review.tsx
- brand_screens.py
- expo@~58.0.20
- Text.tsx
- wordmark_dot.py
- ic
- preview.tsx
- pay/[bookingId].tsx
- card_systems.py
- panic/[bookingId].tsx
- prepaid-privacy.test.ts
- pathlib
- logo_concepts.py
- view_as.py
- logo_luxe.py
- admin.tsx
- wordmarks.py
- categories.py
- app/_layout.tsx
- m_book
- verification.ts
- dependencies
- rules.ts
- chat_keyboard.py
- expo-image-picker
- expo-notifications
- expo-crypto
- @expo-google-fonts/outfit@^0.4.3
- @expo-google-fonts/urbanist@^0.4.2
- react-native-web@~0.21.4
- config.ts
- expo-linking@~58.0.14
- expo-splash-screen
- expo-status-bar
- expo-system-ui@~58.0.6
- react-dom@19.3.0
- react-native-webview
- react-native-worklets@0.13.0
- zod@^4.6.7

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
- `Chat()` --calls--> `typing`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/motion.tsx
- `SignupItem` --references--> `ApprovalStatus`  [EXTRACTED]
  src/services/backend.ts → src/domain/types.ts
- `CompanionForm` --references--> `UploadFile`  [EXTRACTED]
  src/services/backend.ts → src/lib/api.ts

## Import Cycles
- None detected.

## Communities (73 total, 17 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.07
Nodes (33): BookingTab, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, ApprovalStatus, Availability (+25 more)

### Community 1 - "verify.tsx"
Cohesion: 0.14
Nodes (26): AdminAdmins(), Admins(), styles, AdminLayout(), PanicDetail(), styles, tel(), ReviewCompanion() (+18 more)

### Community 2 - "layout.tsx"
Cohesion: 0.06
Nodes (96): expo-haptics, expo-image, expo-linear-gradient, expo-router, react, react-native, react-native-reanimated, react-native-safe-area-context (+88 more)

### Community 3 - "components/bookings.tsx"
Cohesion: 0.19
Nodes (30): BookingDetail(), styles, Confirmed(), styles, OfferSummary(), VerifyId(), BookingCard(), MetaLine() (+22 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (44): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+36 more)

### Community 5 - "session.ts"
Cohesion: 0.18
Nodes (20): loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken(), checkLocalPin(), clearLocalPin() (+12 more)

### Community 7 - "package.json"
Cohesion: 0.12
Nodes (16): expo-device@~58.0.5, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, react-native-screens@~4.30.0, react-native-svg@15.16.0, zustand@^5.0.16, main, name (+8 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (29): AuditEntry, BroadcastRecord, CityPlan, PanicAlert, backend, Backend, activity, allDays (+21 more)

### Community 10 - "Text"
Cohesion: 0.12
Nodes (62): Approvals(), styles, Tab, AdminBroadcast(), Broadcast(), styles, AdminDisputes(), Panics() (+54 more)

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

### Community 15 - "flow.ts"
Cohesion: 0.24
Nodes (13): Pin(), hasIdentity(), firstUnanswered(), needsSetup(), SessionUser, afterAuth(), afterPin(), displayLogin() (+5 more)

### Community 16 - "demo.ts"
Cohesion: 0.08
Nodes (23): allDays, bookings, companionStatus(), day(), demo, DemoCompanion, demoConsents, demoIncoming (+15 more)

### Community 17 - "chat/[bookingId].tsx"
Cohesion: 0.24
Nodes (9): mergeMessages(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status, toMessage(), useChat() (+1 more)

### Community 19 - "useSession"
Cohesion: 0.33
Nodes (11): tab(), TabsLayout(), Welcome(), badgeLabel(), EMPTY, useLiveMe(), useLiveUnread(), useOnForeground() (+3 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "booking.ts"
Cohesion: 0.13
Nodes (30): SelectDateTime(), styles, WEEK, AvailabilityEditor(), HOURS, styles, BookingTab, canComplete() (+22 more)

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "privacy.tsx"
Cohesion: 0.19
Nodes (17): Privacy(), PrivacyForm(), identityComplete(), IdentityForm(), AreaPicker(), CityPicker(), CitySheet(), PickerField() (+9 more)

### Community 24 - "LocationFields.tsx"
Cohesion: 0.27
Nodes (15): AreaSheet(), CitySheet(), Dropdown(), fold(), LocationFields(), NoMatch(), Row(), Sheet() (+7 more)

### Community 25 - "ErrorState"
Cohesion: 0.10
Nodes (38): Activity(), AdminActivity(), priceDiff(), short(), styles, CompanionPicker(), AdminBookings(), AppSignups() (+30 more)

### Community 26 - "companion/[id].tsx"
Cohesion: 0.05
Nodes (94): CategoryPage(), styles, CompanionProfile(), styles, perks(), Availability(), AvailabilityForm(), initial() (+86 more)

### Community 27 - "onboarding.tsx"
Cohesion: 0.14
Nodes (30): CompanionOnboarding(), INTERESTS, Line(), Options(), Step, STEPS, styles, Chip() (+22 more)

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
Cohesion: 0.15
Nodes (14): bob, EASE_OUT, easeOutQuart(), fadeOnly, fadeUp, fromLeft, fromRight, pop (+6 more)

### Community 34 - "review.tsx"
Cohesion: 0.29
Nodes (10): Checkout(), newKey(), RELATIONS, Step(), styles, amountDuePaise(), canHomeVisit(), meetingPlaceError() (+2 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.14
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 37 - "Text.tsx"
Cohesion: 0.18
Nodes (17): Chat(), styles, time(), ActiveAlert(), HoldButton(), PanicButton(), PULSE, styles (+9 more)

### Community 38 - "wordmark_dot.py"
Cohesion: 0.60
Nodes (3): font_card(), icon(), mark()

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 40 - "preview.tsx"
Cohesion: 0.30
Nodes (11): endPreview(), go(), PreviewAs, PreviewStart, PreviewStrip(), routeFor(), sampleUser(), startPreview() (+3 more)

### Community 41 - "pay/[bookingId].tsx"
Cohesion: 0.27
Nodes (10): METHODS, styles, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet() (+2 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "panic/[bookingId].tsx"
Cohesion: 0.33
Nodes (9): PanicScreen(), PinCheck(), PULSE, styles, PinPad(), useShake(), hasLocalPin(), loginIdOf() (+1 more)

### Community 44 - "prepaid-privacy.test.ts"
Cohesion: 0.31
Nodes (7): awaitingAnswer(), offersCategory(), filterCompanions(), Sort, SORTS, Companion, NOW

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

### Community 49 - "admin.tsx"
Cohesion: 0.10
Nodes (43): AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap(), AdminOverview(), BLINK, Money() (+35 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 52 - "app/_layout.tsx"
Cohesion: 0.18
Nodes (12): AppEffects(), RootLayout(), styles, connectOnlineManager(), setUnauthorizedHandler(), DEMO, MAX_APP_WIDTH, usePricingSync() (+4 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "verification.ts"
Cohesion: 0.39
Nodes (7): VerificationStatus, companionStatusLine(), ID_TYPES, idUploadError(), isLiveCompanion(), needsBack(), needsIdToAccept()

### Community 55 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, expo-constants@~58.0.13, expo-font@~58.0.10, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-linear-gradient@~58.0.3, expo-router@~58.0.27, expo-secure-store@~58.0.2 (+14 more)

### Community 56 - "rules.ts"
Cohesion: 0.33
Nodes (8): agreedAt(), Consent, ConsentKind, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

### Community 57 - "chat_keyboard.py"
Cohesion: 0.38
Nodes (3): composer(), header(), svg()

### Community 64 - "config.ts"
Cohesion: 0.22
Nodes (7): @react-native-async-storage/async-storage@2.2.0, @supabase/supabase-js@^2.119.0, @react-native-async-storage/async-storage, @supabase/supabase-js, SITE_URL, SUPABASE_KEY, SUPABASE_URL

## Knowledge Gaps
- **2 isolated node(s):** `expo/tsconfig.base`, `COMMUNITY_IMAGE`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 387 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `verify.tsx`, `layout.tsx`, `review.tsx`, `components/bookings.tsx`, `Text.tsx`, `preview.tsx`, `pay/[bookingId].tsx`, `panic/[bookingId].tsx`, `flow.ts`, `admin.tsx`, `useSession`, `booking.ts`, `privacy.tsx`, `LocationFields.tsx`, `ErrorState`, `companion/[id].tsx`, `onboarding.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base`, `COMMUNITY_IMAGE` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0728744939271255 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `verify.tsx`, `components/bookings.tsx`, `session.ts`, `package.json`, `Text`, `useSession`, `booking.ts`, `privacy.tsx`, `LocationFields.tsx`, `ErrorState`, `companion/[id].tsx`, `onboarding.tsx`, `motion.tsx`, `review.tsx`, `Text.tsx`, `preview.tsx`, `pay/[bookingId].tsx`, `panic/[bookingId].tsx`, `admin.tsx`, `app/_layout.tsx`, `dependencies`, `config.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `verify.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14260249554367202 - nodes in this community are weakly interconnected._
- **Why does `expo-router` connect `layout.tsx` to `verify.tsx`, `components/bookings.tsx`, `+not-found.tsx`, `package.json`, `Text`, `flow.ts`, `useSession`, `booking.ts`, `privacy.tsx`, `ErrorState`, `companion/[id].tsx`, `onboarding.tsx`, `review.tsx`, `Text.tsx`, `preview.tsx`, `pay/[bookingId].tsx`, `panic/[bookingId].tsx`, `admin.tsx`, `app/_layout.tsx`, `dependencies`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05998227124987689 - nodes in this community are weakly interconnected._