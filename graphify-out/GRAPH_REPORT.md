# Graph Report - prsnn-mobile  (2026-11-18)

## Corpus Check
- 192 files · ~315,176 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1675 nodes · 7681 edges · 79 communities (65 shown, 14 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 247 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `805c19ac`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- tokens.ts
- package.json
- chat/[bookingId].tsx
- expo
- session.ts
- landing.py
- dependencies
- devDependencies
- demoAdmin.ts
- space
- compilerOptions
- scripts
- e2e-supabase.mjs
- PhotoCard.tsx
- rules.ts
- demo.ts
- admin.tsx
- LocationFields.tsx
- BookingPicker.tsx
- screens_v2.py
- components/bookings.tsx
- journey.py
- react-native
- pathlib
- expo-crypto
- domain/pricing.ts
- all_screens.py
- Text
- btn
- body
- chat_keyboard.py
- btn
- profile.tsx
- layout.tsx
- brand_screens.py
- errorMessage
- expo-notifications
- formatINR
- photo
- interest.ts
- pay/[bookingId].tsx
- card_systems.py
- wallet.tsx
- search.tsx
- useSession
- logo_concepts.py
- view_as.py
- logo_luxe.py
- Button
- wordmarks.py
- react-native-worklets@0.13.0
- motion.tsx
- m_book
- booking.ts
- Text.tsx
- fellow/earnings.tsx
- jest
- verification.ts
- brand_directions.py
- flow.ts
- expo@~58.0.20
- expo-constants
- expo-device
- view-as.tsx
- session.ts
- IdentityForm.tsx
- availability.tsx
- notifications.tsx
- categories.py
- react-native-web@~0.21.4
- round2.test.ts
- expo-font
- @expo-google-fonts/lora@^0.4.2
- @expo-google-fonts/outfit@^0.4.3
- @react-native-community/netinfo
- react-native-screens@~4.30.0
- react-native-webview
- zod@^4.6.7

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
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `ProfileTab()` --calls--> `ModeSwitch()`  [EXTRACTED]
  src/app/(tabs)/profile.tsx → src/components/ModeSwitch.tsx
- `ProfileTab()` --calls--> `useConfirm()`  [EXTRACTED]
  src/app/(tabs)/profile.tsx → src/components/ui/confirm.tsx
- `ProfileTab()` --calls--> `Icon`  [EXTRACTED]
  src/app/(tabs)/profile.tsx → src/components/ui/Icon.tsx
- `ProfileTab()` --calls--> `Avatar()`  [EXTRACTED]
  src/app/(tabs)/profile.tsx → src/components/ui/layout.tsx

## Import Cycles
- None detected.

## Communities (79 total, 14 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.07
Nodes (39): BookingTab, BusyTime, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, Availability (+31 more)

### Community 1 - "tokens.ts"
Cohesion: 0.12
Nodes (29): expo-linear-gradient, BLINK, styles, styles, styles, TABS, styles, SignedOut() (+21 more)

### Community 2 - "package.json"
Cohesion: 0.11
Nodes (18): @expo-google-fonts/dm-sans@^0.4.2, expo-image-picker@~58.0.10, expo-linking@~58.0.14, expo-status-bar@~58.0.4, expo-system-ui@~58.0.6, react-dom@19.3.0, zustand@^5.0.16, main (+10 more)

### Community 3 - "chat/[bookingId].tsx"
Cohesion: 0.12
Nodes (24): Chat(), isDivider(), time(), RiseIn(), typing, TypingDots(), idOf(), ChatBooking (+16 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (47): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+39 more)

### Community 5 - "session.ts"
Cohesion: 0.24
Nodes (17): loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), checkLocalPin(), clearLocalPin(), forgetSavedSession(), hash() (+9 more)

### Community 6 - "landing.py"
Cohesion: 0.09
Nodes (43): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+35 more)

### Community 7 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @expo-google-fonts/urbanist@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-linear-gradient@~58.0.3, expo-router@~58.0.27, expo-secure-store@~58.0.2, expo-splash-screen@~58.0.11 (+17 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.07
Nodes (32): priceCurveError(), AdminBooking, AuditEntry, BroadcastRecord, CityPlan, PanicAlert, Role, Backend (+24 more)

### Community 10 - "space"
Cohesion: 0.13
Nodes (27): expo-router, react, @tanstack/react-query, EMPTY, styles, styles, styles, FILTERS (+19 more)

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
Cohesion: 0.23
Nodes (11): DeckCard(), Dot(), HomeCategories(), styles, DARK, ICON, Parallax, ParallaxPhoto() (+3 more)

### Community 15 - "rules.ts"
Cohesion: 0.33
Nodes (8): agreedAt(), Consent, ConsentKind, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

### Community 16 - "demo.ts"
Cohesion: 0.07
Nodes (27): Profile, SessionUser, AuthResult, allDays, bookings, companionStatus(), day(), demo (+19 more)

### Community 17 - "admin.tsx"
Cohesion: 0.11
Nodes (38): AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap(), PanicDetail(), styles, tel() (+30 more)

### Community 18 - "LocationFields.tsx"
Cohesion: 0.17
Nodes (20): AreaSheet(), CitySheet(), Dropdown(), fold(), LocationFields(), NoMatch(), Row(), Sheet() (+12 more)

### Community 19 - "BookingPicker.tsx"
Cohesion: 0.28
Nodes (13): BookingPicker(), styles, WEEK, dayKeyOf(), endTimeOf(), formatTime(), freeSlots(), freeToday() (+5 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (46): keypad(), s_pin_login(), a_overview_sub(), banner(), booked(), booking_detail(), c_status_changes(), c_status_live() (+38 more)

### Community 21 - "components/bookings.tsx"
Cohesion: 0.14
Nodes (40): Checkout(), newKey(), RELATIONS, Step(), styles, BookingDetail(), styles, Confirmed() (+32 more)

### Community 22 - "journey.py"
Cohesion: 0.09
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "react-native"
Cohesion: 0.09
Nodes (38): react-native, styles, INTERESTS, Step, STEPS, styles, ID_COPY, styles (+30 more)

### Community 24 - "pathlib"
Cohesion: 0.19
Nodes (5): letters(), monogram(), wordmark(), icon(), mark()

### Community 26 - "domain/pricing.ts"
Cohesion: 0.15
Nodes (26): perks(), a11y(), PackageGrid(), Props, styles, tagFor(), applyPricing(), BASE_RATE (+18 more)

### Community 27 - "all_screens.py"
Cohesion: 0.13
Nodes (37): checkbox(), chips(), field(), label(), notice(), s_admins(), s_broadcast(), s_chat() (+29 more)

### Community 28 - "Text"
Cohesion: 0.13
Nodes (34): AdminOverview(), Money(), PanicBanner(), Person(), CategoryPage(), Options(), Wordmark(), Pin() (+26 more)

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
Nodes (23): ProfileTab(), styles, AdminAction, can(), canActOn(), describeAction(), isStaff(), isSuperadmin() (+15 more)

### Community 34 - "layout.tsx"
Cohesion: 0.13
Nodes (18): expo-image, react-native-safe-area-context, styles, styles, PHOTOS, Splash(), styles, OPTIONS (+10 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 36 - "errorMessage"
Cohesion: 0.12
Nodes (49): Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Admins(), styles (+41 more)

### Community 38 - "formatINR"
Cohesion: 0.23
Nodes (19): CompanionProfile(), CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton(), Photo(), placeOf() (+11 more)

### Community 39 - "photo"
Cohesion: 0.23
Nodes (12): photo(), s_apply(), s_category(), s_companion(), s_home_more(), s_login(), shade(), bc() (+4 more)

### Community 40 - "interest.ts"
Cohesion: 0.33
Nodes (7): APPROVAL, categoryTitle(), MEET, SignupChoices, signupDetails(), topCategories(), base

### Community 41 - "pay/[bookingId].tsx"
Cohesion: 0.26
Nodes (9): baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet(), RazorpaySuccess, styles (+1 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "wallet.tsx"
Cohesion: 0.29
Nodes (7): react-native-svg@15.16.0, react-native-svg, Guilloche, Material, MaterialCard(), MATERIALS, styles

### Community 44 - "search.tsx"
Cohesion: 0.12
Nodes (24): SearchTab(), styles, AvailableTodayToggle(), AreaPicker(), CityPicker(), CitySheet(), PickerField(), SearchSheet() (+16 more)

### Community 45 - "useSession"
Cohesion: 0.14
Nodes (21): AppEffects(), RootLayout(), styles, Ask, ConfirmOptions, ConfirmProvider(), Ctx, styles (+13 more)

### Community 46 - "logo_concepts.py"
Cohesion: 0.19
Nodes (10): card(), diamond(), diamond_only(), face_to_face(), pin_p(), svg(), two_seats(), uid() (+2 more)

### Community 47 - "view_as.py"
Cohesion: 0.23
Nodes (10): s_action(), s_companion_dash(), s_companion_onb(), s_exit(), s_member_book(), s_member_home(), s_pick(), s_switch() (+2 more)

### Community 48 - "logo_luxe.py"
Cohesion: 0.29
Nodes (9): card(), cut(), gem(), linked(), signature(), svg(), uid(), word() (+1 more)

### Community 49 - "Button"
Cohesion: 0.12
Nodes (44): EMPTY, Plans(), Row(), styles, AdminPrices(), Draft, draftOf(), Pair() (+36 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 52 - "motion.tsx"
Cohesion: 0.10
Nodes (21): expo-haptics, react-native-reanimated, styles, PULSE, styles, styles, WEAK, styles (+13 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "booking.ts"
Cohesion: 0.11
Nodes (27): amountDuePaise(), awaitingAnswer(), BookingTab, canChat(), canComplete(), canPay(), CATEGORIES, CategoryKey (+19 more)

### Community 55 - "Text.tsx"
Cohesion: 0.12
Nodes (20): DOT_FADE, DOT_SETTLE, styles, BRAND_WORD, dotColorFor(), isLight(), Wordmark(), EASE_OUT_CSS (+12 more)

### Community 56 - "fellow/earnings.tsx"
Cohesion: 0.48
Nodes (5): Earnings(), EarningsScreen(), styles, EarningsTab(), Brand()

### Community 57 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

### Community 58 - "verification.ts"
Cohesion: 0.39
Nodes (7): VerificationStatus, companionStatusLine(), ID_TYPES, idUploadError(), isLiveCompanion(), needsBack(), needsIdToAccept()

### Community 59 - "brand_directions.py"
Cohesion: 0.19
Nodes (6): pair(), phone(), section(), font_card(), icon(), mark()

### Community 60 - "flow.ts"
Cohesion: 0.17
Nodes (17): AppMode, canUseCompanionMode(), effectiveMode(), modeOfSide(), modesFor(), SideMode, sideMode(), Who (+9 more)

### Community 64 - "view-as.tsx"
Cohesion: 0.17
Nodes (19): Data, DATA, STARTS, styles, WHO, endPreview(), go(), PreviewAs (+11 more)

### Community 65 - "session.ts"
Cohesion: 0.14
Nodes (9): @react-native-async-storage/async-storage, styles, setApiToken(), DEMO, SITE_URL, SUPABASE_KEY, SUPABASE_URL, secure (+1 more)

### Community 66 - "IdentityForm.tsx"
Cohesion: 0.27
Nodes (12): identityComplete(), IdentityValue, styles, defaultVisibility(), GENDER_OPTIONS, SEE_OPTIONS, VISIBILITY_COPY, ApprovalStatus (+4 more)

### Community 67 - "availability.tsx"
Cohesion: 0.28
Nodes (11): Availability(), AvailabilityForm(), initial(), AvailabilityEditor(), AvailabilityValue, emptyAvailability(), HOURS, styles (+3 more)

### Community 68 - "notifications.tsx"
Cohesion: 0.29
Nodes (8): Filter, ICON, open(), styles, modeForNotification(), enterModeFor(), openFromPush(), registerForPush()

### Community 69 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 71 - "round2.test.ts"
Cohesion: 0.29
Nodes (5): durationLine(), savingPercent(), PANIC_AFTER_END_MS, panicWindow(), b()

## Knowledge Gaps
- **2 isolated node(s):** `expo/tsconfig.base`, `COMMUNITY_IMAGE`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 417 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `tokens.ts`, `chat/[bookingId].tsx`, `space`, `PhotoCard.tsx`, `admin.tsx`, `LocationFields.tsx`, `BookingPicker.tsx`, `components/bookings.tsx`, `react-native`, `domain/pricing.ts`, `profile.tsx`, `layout.tsx`, `errorMessage`, `formatINR`, `search.tsx`, `useSession`, `Button`, `motion.tsx`, `Text.tsx`, `fellow/earnings.tsx`, `view-as.tsx`, `session.ts`, `IdentityForm.tsx`, `availability.tsx`, `notifications.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base`, `COMMUNITY_IMAGE` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06553911205073996 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `tokens.ts`, `package.json`, `dependencies`, `space`, `PhotoCard.tsx`, `admin.tsx`, `LocationFields.tsx`, `BookingPicker.tsx`, `components/bookings.tsx`, `domain/pricing.ts`, `profile.tsx`, `layout.tsx`, `errorMessage`, `formatINR`, `pay/[bookingId].tsx`, `wallet.tsx`, `search.tsx`, `useSession`, `Button`, `motion.tsx`, `Text.tsx`, `fellow/earnings.tsx`, `view-as.tsx`, `session.ts`, `IdentityForm.tsx`, `availability.tsx`, `notifications.tsx`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `tokens.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12435897435897436 - nodes in this community are weakly interconnected._
- **Why does `useSession` connect `useSession` to `types.ts`, `tokens.ts`, `chat/[bookingId].tsx`, `demoAdmin.ts`, `space`, `demo.ts`, `admin.tsx`, `components/bookings.tsx`, `react-native`, `Text`, `profile.tsx`, `layout.tsx`, `errorMessage`, `formatINR`, `search.tsx`, `Button`, `motion.tsx`, `Text.tsx`, `flow.ts`, `view-as.tsx`, `session.ts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._