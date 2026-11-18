# Graph Report - prsnn-mobile  (2026-11-18)

## Corpus Check
- 197 files · ~318,655 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1703 nodes · 7884 edges · 81 communities (67 shown, 14 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 248 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d24eb70a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- lib/mode.ts
- dependencies
- lib/chat.ts
- expo
- session.ts
- landing.py
- index.ts
- devDependencies
- demoAdmin.ts
- layout.tsx
- compilerOptions
- scripts
- e2e-supabase.mjs
- PhotoCard.tsx
- rules.ts
- demo.ts
- errorMessage
- search.tsx
- booking.ts
- screens_v2.py
- components/bookings.tsx
- journey.py
- view-as.tsx
- pathlib
- domain/pricing.ts
- all_screens.py
- Text
- btn
- body
- chat_keyboard.py
- btn
- profile.tsx
- home.tsx
- brand_screens.py
- RequestCard.tsx
- review.tsx
- formatINR
- photo
- interest.ts
- pay/[bookingId].tsx
- card_systems.py
- wallet.tsx
- availability.tsx
- app/_layout.tsx
- logo_concepts.py
- view_as.py
- logo_luxe.py
- Icon
- wordmarks.py
- BecomeCompanionCard.tsx
- motion.tsx
- m_book
- chat/[bookingId].tsx
- broadcast.tsx
- [key].tsx
- jest
- verification.ts
- brand_directions.py
- flow.ts
- safety.ts
- eslint.config.js
- activity.tsx
- view-as.tsx
- session.ts
- expo@~58.0.20
- expo-constants
- notifications.tsx
- categories.py
- expo-crypto
- @expo-google-fonts/dm-sans@^0.4.2
- @expo-google-fonts/lora@^0.4.2
- @expo-google-fonts/urbanist@^0.4.2
- expo-linking@~58.0.14
- expo-status-bar
- expo-system-ui@~58.0.6
- expo-video
- react-dom@19.3.0
- react-native-url-polyfill
- @supabase/supabase-js

## God Nodes (most connected - your core abstractions)
1. `Text()` - 222 edges
2. `body()` - 138 edges
3. `Icon` - 127 edges
4. `Button()` - 111 edges
5. `errorMessage()` - 111 edges
6. `btn()` - 104 edges
7. `react-native` - 104 edges
8. `ic()` - 102 edges
9. `colors` - 97 edges
10. `Header()` - 93 edges

## Surprising Connections (you probably didn't know these)
- `Chat()` --calls--> `typing`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/motion.tsx
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `ProfileTab()` --calls--> `ModeSwitch()`  [EXTRACTED]
  src/app/(tabs)/profile.tsx → src/components/ModeSwitch.tsx
- `ProfileTab()` --calls--> `useConfirm()`  [EXTRACTED]
  src/app/(tabs)/profile.tsx → src/components/ui/confirm.tsx
- `ProfileTab()` --calls--> `Icon`  [EXTRACTED]
  src/app/(tabs)/profile.tsx → src/components/ui/Icon.tsx

## Import Cycles
- None detected.

## Communities (81 total, 14 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.07
Nodes (39): BookingTab, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, Availability, BookingStatus (+31 more)

### Community 1 - "lib/mode.ts"
Cohesion: 0.20
Nodes (21): SignedOut(), tab(), TabsLayout(), MessagesTab(), styles, LABEL, ModeSwitch(), OtherModeBanner() (+13 more)

### Community 2 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, expo-device@~58.0.5, expo-font@~58.0.10, @expo-google-fonts/outfit@^0.4.3, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-image-picker@~58.0.10, expo-linear-gradient@~58.0.3 (+24 more)

### Community 3 - "lib/chat.ts"
Cohesion: 0.31
Nodes (9): mergeMessages(), demoThread(), MAX_MESSAGE_LENGTH, messageId(), Row, Status, toMessage(), useChat() (+1 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (47): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+39 more)

### Community 5 - "session.ts"
Cohesion: 0.27
Nodes (15): loginKey(), checkLocalPin(), clearLocalPin(), forgetSavedSession(), hash(), hasLocalPin(), key(), MAX_PIN_TRIES (+7 more)

### Community 6 - "landing.py"
Cohesion: 0.09
Nodes (43): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+35 more)

### Community 7 - "index.ts"
Cohesion: 0.12
Nodes (26): react-native-safe-area-context, @tanstack/react-query, styles, Tab, EMPTY, styles, styles, BLINK (+18 more)

### Community 8 - "devDependencies"
Cohesion: 0.12
Nodes (21): zod@^4.6.7, zustand@^5.0.16, devDependencies, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0, @types/jest@^30.0.0, @types/react@~19.3.0 (+13 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (29): AdminBooking, AuditEntry, BroadcastRecord, CityPlan, backend, Backend, activity, allDays (+21 more)

### Community 10 - "layout.tsx"
Cohesion: 0.07
Nodes (66): expo-haptics, expo-router, react, react-native, react-native-reanimated, styles, ID_COPY, styles (+58 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, noEmit, paths, strict, types, exclude (+2 more)

### Community 12 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, export:web, graph, ios, lint, start, test (+2 more)

### Community 13 - "e2e-supabase.mjs"
Cohesion: 0.08
Nodes (15): fs, book(), cand, card, [compId, memId], got, img, offer (+7 more)

### Community 14 - "PhotoCard.tsx"
Cohesion: 0.18
Nodes (14): styles, DeckCard(), Dot(), HomeCategories(), styles, DARK, ICON, Parallax (+6 more)

### Community 15 - "rules.ts"
Cohesion: 0.33
Nodes (8): agreedAt(), Consent, ConsentKind, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

### Community 16 - "demo.ts"
Cohesion: 0.07
Nodes (28): BusyTime, SessionUser, AuthResult, allDays, bookings, companionStatus(), day(), demo (+20 more)

### Community 17 - "errorMessage"
Cohesion: 0.10
Nodes (73): AdminAdmins(), Admins(), styles, Approvals(), AdminBookingDetail(), CompanionPicker(), PersonLink(), Sheet (+65 more)

### Community 18 - "search.tsx"
Cohesion: 0.28
Nodes (9): SearchTab(), styles, AvailableTodayToggle(), useLiveCompanions(), seeLabel(), filterCompanions(), photosFirst(), Sort (+1 more)

### Community 19 - "booking.ts"
Cohesion: 0.15
Nodes (26): adminWhen(), BookingChoice, BookingPicker(), styles, WEEK, canPay(), CategoryKey, DAY_KEYS (+18 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (46): keypad(), s_pin_login(), a_overview_sub(), banner(), booked(), booking_detail(), c_status_changes(), c_status_live() (+38 more)

### Community 21 - "components/bookings.tsx"
Cohesion: 0.27
Nodes (21): BookingDetail(), styles, Confirmed(), styles, Pay(), BookingCard(), MetaLine(), PrepaidStatus() (+13 more)

### Community 22 - "journey.py"
Cohesion: 0.09
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "view-as.tsx"
Cohesion: 0.33
Nodes (5): Data, DATA, STARTS, styles, WHO

### Community 24 - "pathlib"
Cohesion: 0.19
Nodes (5): letters(), monogram(), wordmark(), icon(), mark()

### Community 26 - "domain/pricing.ts"
Cohesion: 0.16
Nodes (27): perks(), a11y(), PackageGrid(), Props, styles, tagFor(), formatINR(), applyPricing() (+19 more)

### Community 27 - "all_screens.py"
Cohesion: 0.13
Nodes (37): checkbox(), chips(), field(), label(), notice(), s_admins(), s_broadcast(), s_chat() (+29 more)

### Community 28 - "Text"
Cohesion: 0.11
Nodes (49): EMPTY, Plans(), styles, AdminPrices(), Draft, draftOf(), Pair(), Prices() (+41 more)

### Community 29 - "btn"
Cohesion: 0.09
Nodes (59): bar(), btn(), card(), ic(), pill(), s_activity(), s_admin_bookings(), s_approvals() (+51 more)

### Community 30 - "body"
Cohesion: 0.19
Nodes (38): avatar(), body(), group(), h(), row(), s_admin(), s_admin_booking(), s_bookings() (+30 more)

### Community 31 - "chat_keyboard.py"
Cohesion: 0.38
Nodes (3): composer(), header(), svg()

### Community 32 - "btn"
Cohesion: 0.20
Nodes (25): foot(), c1(), c2(), c3(), c4(), c5(), c6(), c7() (+17 more)

### Community 33 - "profile.tsx"
Cohesion: 0.15
Nodes (23): AdminOverview(), Money(), PanicBanner(), ProfileTab(), styles, ListRow(), AdminAction, can() (+15 more)

### Community 34 - "home.tsx"
Cohesion: 0.21
Nodes (16): PHOTOS, Splash(), styles, Discover(), greeting(), HomeTab(), styles, BecomeCompanionCard() (+8 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 36 - "RequestCard.tsx"
Cohesion: 0.22
Nodes (16): BookingsTab(), styles, TABS, CompanionDashboard(), RequestCard(), styles, useNow(), awaitingAnswer() (+8 more)

### Community 37 - "review.tsx"
Cohesion: 0.24
Nodes (12): Checkout(), newKey(), RELATIONS, Step(), styles, formatDate(), amountDuePaise(), canHomeVisit() (+4 more)

### Community 38 - "formatINR"
Cohesion: 0.18
Nodes (26): CompanionProfile(), styles, CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton(), Photo() (+18 more)

### Community 39 - "photo"
Cohesion: 0.23
Nodes (12): photo(), s_apply(), s_category(), s_companion(), s_home_more(), s_login(), shade(), bc() (+4 more)

### Community 40 - "interest.ts"
Cohesion: 0.31
Nodes (8): APPROVAL, categoryTitle(), MEET, roleLabel(), SignupChoices, signupDetails(), topCategories(), base

### Community 41 - "pay/[bookingId].tsx"
Cohesion: 0.21
Nodes (11): react-native-webview@14.0.1, react-native-webview, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet() (+3 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "wallet.tsx"
Cohesion: 0.29
Nodes (7): react-native-svg@15.16.0, react-native-svg, Guilloche, Material, MaterialCard(), MATERIALS, styles

### Community 44 - "availability.tsx"
Cohesion: 0.25
Nodes (12): Availability(), AvailabilityForm(), initial(), AvailabilityEditor(), AvailabilityValue, emptyAvailability(), HOURS, styles (+4 more)

### Community 45 - "app/_layout.tsx"
Cohesion: 0.24
Nodes (15): AppEffects(), RootLayout(), styles, connectOnlineManager(), OfflineBanner(), setUnauthorizedHandler(), EMPTY, useLiveMe() (+7 more)

### Community 46 - "logo_concepts.py"
Cohesion: 0.19
Nodes (10): card(), diamond(), diamond_only(), face_to_face(), pin_p(), svg(), two_seats(), uid() (+2 more)

### Community 47 - "view_as.py"
Cohesion: 0.23
Nodes (10): s_action(), s_companion_dash(), s_companion_onb(), s_exit(), s_member_book(), s_member_home(), s_pick(), s_switch() (+2 more)

### Community 48 - "logo_luxe.py"
Cohesion: 0.29
Nodes (9): card(), cut(), gem(), linked(), signature(), svg(), uid(), word() (+1 more)

### Community 49 - "Icon"
Cohesion: 0.06
Nodes (78): Row(), CompanionOnboarding(), INTERESTS, Line(), Options(), Step, STEPS, styles (+70 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "BecomeCompanionCard.tsx"
Cohesion: 0.17
Nodes (9): expo-image, expo-linear-gradient, EARN_HOURS, STEPS, styles, styles, styles, COMMUNITY_FOCUS (+1 more)

### Community 52 - "motion.tsx"
Cohesion: 0.14
Nodes (15): bob, EASE_OUT, EASE_OUT_CSS, easeOutQuart(), fadeOnly, fadeUp, fromLeft, fromRight (+7 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "chat/[bookingId].tsx"
Cohesion: 0.11
Nodes (26): Chat(), isDivider(), Row, styles, time(), HoldButton(), PanicButton(), MenuRow() (+18 more)

### Community 55 - "broadcast.tsx"
Cohesion: 0.23
Nodes (9): styles, Earnings(), EarningsScreen(), styles, EarningsTab(), BRAND_WORD, dotColorFor(), isLight() (+1 more)

### Community 56 - "[key].tsx"
Cohesion: 0.33
Nodes (8): CategoryPage(), styles, Section(), categoryOf(), offersCategory(), durationLine(), savingPercent(), b()

### Community 57 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

### Community 58 - "verification.ts"
Cohesion: 0.24
Nodes (13): OfferSummary(), Phase, styles, VerifyId(), personOf(), VerificationStatus, companionStatusLine(), ID_TYPES (+5 more)

### Community 59 - "brand_directions.py"
Cohesion: 0.19
Nodes (6): pair(), phone(), section(), font_card(), icon(), mark()

### Community 60 - "flow.ts"
Cohesion: 0.16
Nodes (18): canUseCompanionMode(), effectiveMode(), modeOfSide(), modesFor(), SideMode, Who, who(), hasIdentity() (+10 more)

### Community 61 - "safety.ts"
Cohesion: 0.28
Nodes (7): AdminReport, BlockedPerson, PANIC_AFTER_END_MS, REPORT_DETAILS_MAX, REPORT_REASONS, reportError(), ReportReason

### Community 62 - "eslint.config.js"
Cohesion: 0.29
Nodes (6): { defineConfig }, expoConfig, eslint@^9.0.0, eslint-config-expo@~58.0.4, eslint, eslint-config-expo

### Community 63 - "activity.tsx"
Cohesion: 0.53
Nodes (5): Activity(), AdminActivity(), priceDiff(), short(), styles

### Community 64 - "view-as.tsx"
Cohesion: 0.29
Nodes (12): endPreview(), go(), PreviewAs, PreviewStart, routeFor(), sampleUser(), startLivePreview(), startPreview() (+4 more)

### Community 65 - "session.ts"
Cohesion: 0.12
Nodes (17): expo-secure-store@~58.0.2, @react-native-async-storage/async-storage@2.2.0, expo-secure-store, @react-native-async-storage/async-storage, loginIdOfAuthUser(), sameLogin(), sessionIsGone(), Role (+9 more)

### Community 68 - "notifications.tsx"
Cohesion: 0.48
Nodes (5): open(), modeForNotification(), enterModeFor(), openFromPush(), registerForPush()

### Community 69 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

## Knowledge Gaps
- **2 isolated node(s):** `expo/tsconfig.base`, `COMMUNITY_IMAGE`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 425 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `lib/mode.ts`, `index.ts`, `layout.tsx`, `PhotoCard.tsx`, `errorMessage`, `search.tsx`, `booking.ts`, `components/bookings.tsx`, `view-as.tsx`, `domain/pricing.ts`, `profile.tsx`, `home.tsx`, `RequestCard.tsx`, `review.tsx`, `formatINR`, `availability.tsx`, `app/_layout.tsx`, `Icon`, `BecomeCompanionCard.tsx`, `chat/[bookingId].tsx`, `broadcast.tsx`, `[key].tsx`, `verification.ts`, `activity.tsx`, `view-as.tsx`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base`, `COMMUNITY_IMAGE` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06553911205073996 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `lib/mode.ts`, `dependencies`, `index.ts`, `devDependencies`, `PhotoCard.tsx`, `errorMessage`, `search.tsx`, `booking.ts`, `components/bookings.tsx`, `view-as.tsx`, `domain/pricing.ts`, `Text`, `profile.tsx`, `home.tsx`, `RequestCard.tsx`, `review.tsx`, `formatINR`, `pay/[bookingId].tsx`, `wallet.tsx`, `availability.tsx`, `app/_layout.tsx`, `Icon`, `BecomeCompanionCard.tsx`, `motion.tsx`, `chat/[bookingId].tsx`, `broadcast.tsx`, `[key].tsx`, `verification.ts`, `activity.tsx`, `view-as.tsx`, `session.ts`, `notifications.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Why does `react` connect `layout.tsx` to `lib/mode.ts`, `dependencies`, `lib/chat.ts`, `index.ts`, `devDependencies`, `PhotoCard.tsx`, `errorMessage`, `search.tsx`, `booking.ts`, `components/bookings.tsx`, `view-as.tsx`, `domain/pricing.ts`, `Text`, `home.tsx`, `RequestCard.tsx`, `review.tsx`, `formatINR`, `pay/[bookingId].tsx`, `wallet.tsx`, `availability.tsx`, `app/_layout.tsx`, `Icon`, `BecomeCompanionCard.tsx`, `motion.tsx`, `chat/[bookingId].tsx`, `broadcast.tsx`, `[key].tsx`, `verification.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Should `expo` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._