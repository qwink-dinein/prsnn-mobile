# Graph Report - prsnn-mobile  (2026-11-15)

## Corpus Check
- 174 files · ~303,524 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1568 nodes · 7149 edges · 59 communities (58 shown, 1 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 244 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8f7b8130`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- admin.tsx
- colors
- components/bookings.tsx
- expo
- session.ts
- expo-router
- config.ts
- devDependencies
- demoAdmin.ts
- layout.tsx
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- LocationFields.tsx
- demo.ts
- chat/[bookingId].tsx
- react-native
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
- Button.tsx
- verification.ts
- brand_screens.py
- privacy.tsx
- Text.tsx
- wordmark_dot.py
- ic
- preview.tsx
- pay/[bookingId].tsx
- card_systems.py
- review.tsx
- formatINR
- pathlib
- logo_concepts.py
- view_as.py
- logo_luxe.py
- Text
- wordmarks.py
- categories.py
- app/_layout.tsx
- m_book
- states.tsx
- dependencies
- rules.ts
- profile.tsx
- chat_keyboard.py

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
- `Discover()` --calls--> `CompanionCard()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/companions.tsx
- `Discover()` --calls--> `HomeCategories()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/HomeCategories.tsx
- `Discover()` --calls--> `EmptyState()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/ui/layout.tsx
- `Discover()` --calls--> `ErrorState()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/ui/layout.tsx

## Import Cycles
- None detected.

## Communities (59 total, 1 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.07
Nodes (31): AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, AuditEntry, Availability, BookingStatus (+23 more)

### Community 1 - "admin.tsx"
Cohesion: 0.12
Nodes (33): AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap(), CONSENT_LABEL, DAYS, Form (+25 more)

### Community 2 - "colors"
Cohesion: 0.12
Nodes (35): react, react-native-safe-area-context, @tanstack/react-query, styles, styles, Tab, EMPTY, styles (+27 more)

### Community 3 - "components/bookings.tsx"
Cohesion: 0.12
Nodes (46): BookingDetail(), styles, Chat(), time(), Confirmed(), OfferSummary(), BookingsTab(), styles (+38 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (44): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+36 more)

### Community 5 - "session.ts"
Cohesion: 0.17
Nodes (21): @react-native-async-storage/async-storage, loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken(), checkLocalPin() (+13 more)

### Community 6 - "expo-router"
Cohesion: 0.09
Nodes (27): expo-image, expo-linear-gradient, expo-router, styles, styles, styles, styles, styles (+19 more)

### Community 7 - "config.ts"
Cohesion: 0.12
Nodes (14): expo-constants@~58.0.13, expo-device@~58.0.5, expo-notifications@~58.1.8, react-native-url-polyfill@^4.0.0, expo-constants, expo-device, expo-notifications, react-native-url-polyfill (+6 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (28): BroadcastRecord, CityPlan, PanicAlert, backend, Backend, activity, allDays, bk() (+20 more)

### Community 10 - "layout.tsx"
Cohesion: 0.13
Nodes (20): styles, PHOTOS, styles, DOT_FADE, DOT_SETTLE, styles, OPTIONS, R (+12 more)

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
Cohesion: 0.07
Nodes (26): SessionUser, AuthResult, allDays, bookings, companionStatus(), day(), demo, DemoCompanion (+18 more)

### Community 17 - "chat/[bookingId].tsx"
Cohesion: 0.20
Nodes (11): @supabase/supabase-js@^2.119.0, @supabase/supabase-js, mergeMessages(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status (+3 more)

### Community 19 - "react-native"
Cohesion: 0.21
Nodes (9): react-native, styles, Phase, styles, styles, styles, UploadFile, CompanionForm (+1 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "booking.ts"
Cohesion: 0.10
Nodes (35): SelectDateTime(), styles, WEEK, AvailabilityValue, HOURS, styles, WEEK_DAYS, availableDayNames() (+27 more)

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "search.tsx"
Cohesion: 0.14
Nodes (17): styles, CATEGORIES, CategoryKey, categoryOf(), offersCategory(), APPROVAL, categoryTitle(), MEET (+9 more)

### Community 24 - "IdentityForm.tsx"
Cohesion: 0.33
Nodes (10): IdentityValue, styles, GENDER_OPTIONS, SEE_OPTIONS, VISIBILITY_COPY, ApprovalStatus, Gender, SeeGender (+2 more)

### Community 25 - "Text"
Cohesion: 0.10
Nodes (66): Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Admins(), Approvals() (+58 more)

### Community 26 - "companion/[id].tsx"
Cohesion: 0.11
Nodes (38): perks(), a11y(), BigCard(), MAT, matFor(), PackageGrid(), Props, styles (+30 more)

### Community 27 - "onboarding.tsx"
Cohesion: 0.11
Nodes (40): Row(), Availability(), AvailabilityForm(), initial(), CompanionOnboarding(), INTERESTS, Line(), Options() (+32 more)

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

### Community 33 - "Button.tsx"
Cohesion: 0.08
Nodes (28): expo-haptics, styles, ID_COPY, styles, styles, WEAK, BG, FG (+20 more)

### Community 34 - "verification.ts"
Cohesion: 0.33
Nodes (8): IdType, VerificationStatus, companionStatusLine(), ID_TYPES, idUploadError(), isLiveCompanion(), needsBack(), needsIdToAccept()

### Community 35 - "brand_screens.py"
Cohesion: 0.14
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 36 - "privacy.tsx"
Cohesion: 0.16
Nodes (19): Privacy(), PrivacyForm(), identityComplete(), IdentityForm(), AreaPicker(), CityPicker(), CitySheet(), PickerField() (+11 more)

### Community 37 - "Text.tsx"
Cohesion: 0.17
Nodes (15): react-native-reanimated, styles, tab(), TabsLayout(), styles, PULSE, styles, RiseIn() (+7 more)

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
Cohesion: 0.18
Nodes (13): METHODS, styles, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet() (+5 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "review.tsx"
Cohesion: 0.24
Nodes (12): Checkout(), newKey(), RELATIONS, Step(), styles, formatDate(), amountDuePaise(), canHomeVisit() (+4 more)

### Community 44 - "formatINR"
Cohesion: 0.37
Nodes (13): CompanionProfile(), CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton(), Photo(), placeOf() (+5 more)

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
Nodes (57): AdminOverview(), BLINK, Money(), PanicBanner(), styles, ViewAs(), CategoryPage(), DeleteAccount() (+49 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 52 - "app/_layout.tsx"
Cohesion: 0.13
Nodes (21): expo-font@~58.0.10, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, expo-font, expo-splash-screen, expo-status-bar, AppEffects(), RootLayout() (+13 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "states.tsx"
Cohesion: 0.15
Nodes (11): STARTS, styles, WHO, LIVE_INTERVAL, POP, ProgressBar(), PULSE, RING (+3 more)

### Community 55 - "dependencies"
Cohesion: 0.05
Nodes (55): dependencies, expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/outfit@^0.4.3, @expo-google-fonts/urbanist@^0.4.2, expo-haptics@~58.0.7 (+47 more)

### Community 56 - "rules.ts"
Cohesion: 0.33
Nodes (8): agreedAt(), Consent, ConsentKind, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

### Community 57 - "profile.tsx"
Cohesion: 0.43
Nodes (5): ProfileTab(), styles, seeLabel(), idCheckValue(), unregisterPush()

### Community 61 - "chat_keyboard.py"
Cohesion: 0.38
Nodes (3): composer(), header(), svg()

## Knowledge Gaps
- **2 isolated node(s):** `expo/tsconfig.base`, `COMMUNITY_IMAGE`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 389 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `admin.tsx`, `colors`, `components/bookings.tsx`, `expo-router`, `layout.tsx`, `LocationFields.tsx`, `react-native`, `booking.ts`, `search.tsx`, `IdentityForm.tsx`, `Text`, `companion/[id].tsx`, `onboarding.tsx`, `Button.tsx`, `privacy.tsx`, `Text.tsx`, `preview.tsx`, `pay/[bookingId].tsx`, `review.tsx`, `formatINR`, `app/_layout.tsx`, `states.tsx`, `profile.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base`, `COMMUNITY_IMAGE` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0728744939271255 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `admin.tsx`, `colors`, `components/bookings.tsx`, `session.ts`, `expo-router`, `config.ts`, `layout.tsx`, `LocationFields.tsx`, `booking.ts`, `search.tsx`, `IdentityForm.tsx`, `Text`, `companion/[id].tsx`, `onboarding.tsx`, `Button.tsx`, `privacy.tsx`, `Text.tsx`, `preview.tsx`, `pay/[bookingId].tsx`, `review.tsx`, `formatINR`, `Text`, `app/_layout.tsx`, `states.tsx`, `dependencies`, `profile.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `admin.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12280701754385964 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `chat/[bookingId].tsx` to `config.ts`, `e2e-supabase.mjs`, `dependencies`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `colors` be split into smaller, more focused modules?**
  _Cohesion score 0.11554748941318814 - nodes in this community are weakly interconnected._