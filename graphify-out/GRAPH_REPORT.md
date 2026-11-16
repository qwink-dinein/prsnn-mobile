# Graph Report - prsnn-mobile  (2026-11-16)

## Corpus Check
- 181 files · ~306,755 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1600 nodes · 7263 edges · 63 communities (53 shown, 10 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 244 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9bf45949`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- layout.tsx
- package.json
- motion.tsx
- expo
- session.ts
- Text.tsx
- dependencies
- devDependencies
- demoAdmin.ts
- space
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- rules.ts
- demo.ts
- index.ts
- formatINR
- booking.ts
- screens_v2.py
- BookingPicker.tsx
- journey.py
- onboarding.tsx
- verification.ts
- @react-native-async-storage/async-storage
- formatINR
- availability.tsx
- landing.py
- bar
- body
- chat_keyboard.py
- btn
- prepaid-privacy.test.ts
- Chat
- brand_screens.py
- expo@~58.0.20
- lib/chat.ts
- pathlib
- ic
- interest.ts
- pay/[bookingId].tsx
- card_systems.py
- wallet.tsx
- expo-crypto
- expo-device
- logo_concepts.py
- view_as.py
- logo_luxe.py
- Text
- wordmarks.py
- categories.py
- states.tsx
- m_book
- preview.tsx
- react-native
- @expo-google-fonts/outfit@^0.4.3
- @expo-google-fonts/urbanist@^0.4.2
- @react-native-community/netinfo
- react-native-screens@~4.30.0
- react-native-web@~0.21.4
- react-native-webview
- zustand

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
- `perks()` --calls--> `formatINR()`  [EXTRACTED]
  src/app/fellow/apply.tsx → src/domain/booking.ts
- `Apply()` --calls--> `useAppWidth()`  [EXTRACTED]
  src/app/fellow/apply.tsx → src/lib/layout.ts
- `CommunityBanner()` --calls--> `Text()`  [EXTRACTED]
  src/components/CommunityBanner.tsx → src/components/ui/Text.tsx
- `SignupItem` --references--> `ApprovalStatus`  [EXTRACTED]
  src/services/backend.ts → src/domain/types.ts

## Import Cycles
- None detected.

## Communities (63 total, 10 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.06
Nodes (42): BookingTab, BusyTime, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, ApprovalStatus (+34 more)

### Community 1 - "layout.tsx"
Cohesion: 0.09
Nodes (38): expo-image, react, styles, styles, styles, styles, PHOTOS, styles (+30 more)

### Community 2 - "package.json"
Cohesion: 0.10
Nodes (20): expo-constants@~58.0.13, expo-font@~58.0.10, @expo-google-fonts/lora@^0.4.2, expo-image-picker@~58.0.10, expo-notifications@~58.1.8, expo-splash-screen@~58.0.11, expo-video@~58.0.13, zod@^4.6.7 (+12 more)

### Community 3 - "motion.tsx"
Cohesion: 0.10
Nodes (22): expo-haptics, styles, DOT_FADE, DOT_SETTLE, styles, styles, WEAK, FieldProps (+14 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (47): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+39 more)

### Community 5 - "session.ts"
Cohesion: 0.24
Nodes (17): loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), checkLocalPin(), clearLocalPin(), forgetSavedSession(), hash() (+9 more)

### Community 6 - "Text.tsx"
Cohesion: 0.14
Nodes (18): styles, PULSE, styles, tab(), TabsLayout(), styles, PULSE, styles (+10 more)

### Community 7 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, @expo-google-fonts/dm-sans@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-linear-gradient@~58.0.3, expo-linking@~58.0.14, expo-router@~58.0.27, expo-status-bar@~58.0.4 (+18 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (30): AuditEntry, BroadcastRecord, CityPlan, PanicAlert, Role, backend, Backend, activity (+22 more)

### Community 10 - "space"
Cohesion: 0.09
Nodes (42): expo-linear-gradient, react-native-reanimated, styles, EMPTY, styles, styles, Discover(), greeting() (+34 more)

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

### Community 15 - "rules.ts"
Cohesion: 0.33
Nodes (8): agreedAt(), Consent, ConsentKind, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

### Community 16 - "demo.ts"
Cohesion: 0.08
Nodes (24): allDays, bookings, companionStatus(), day(), demo, DemoCompanion, demoConsents, demoIncoming (+16 more)

### Community 17 - "index.ts"
Cohesion: 0.11
Nodes (23): react-native-safe-area-context, @tanstack/react-query, styles, styles, styles, Tab, EMPTY, styles (+15 more)

### Community 18 - "formatINR"
Cohesion: 0.38
Nodes (12): CompanionProfile(), CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton(), Photo(), placeOf() (+4 more)

### Community 19 - "booking.ts"
Cohesion: 0.11
Nodes (31): BookingsTab(), styles, TABS, amountDuePaise(), availableDayNames(), awaitingAnswer(), BookingTab, canChat() (+23 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "BookingPicker.tsx"
Cohesion: 0.29
Nodes (9): BookingPicker(), styles, WEEK, dayKeyOf(), freeSlots(), isDayAvailable(), monthGrid(), timeSlots() (+1 more)

### Community 22 - "journey.py"
Cohesion: 0.09
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "onboarding.tsx"
Cohesion: 0.06
Nodes (77): Row(), CompanionOnboarding(), INTERESTS, Line(), Options(), Step, STEPS, styles (+69 more)

### Community 24 - "verification.ts"
Cohesion: 0.33
Nodes (8): IdType, VerificationStatus, companionStatusLine(), ID_TYPES, idUploadError(), isLiveCompanion(), needsBack(), needsIdToAccept()

### Community 25 - "@react-native-async-storage/async-storage"
Cohesion: 0.33
Nodes (5): expo-secure-store@~58.0.2, @react-native-async-storage/async-storage@2.2.0, expo-secure-store, @react-native-async-storage/async-storage, secure

### Community 26 - "formatINR"
Cohesion: 0.13
Nodes (30): CategoryPage(), perks(), a11y(), PackageGrid(), Props, styles, tagFor(), refundIfCancelledNow() (+22 more)

### Community 27 - "availability.tsx"
Cohesion: 0.24
Nodes (13): Availability(), AvailabilityForm(), initial(), AvailabilityEditor(), AvailabilityValue, emptyAvailability(), HOURS, styles (+5 more)

### Community 28 - "landing.py"
Cohesion: 0.10
Nodes (41): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+33 more)

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

### Community 33 - "prepaid-privacy.test.ts"
Cohesion: 0.17
Nodes (11): MIN_LEAD_MINUTES, offersCategory(), durationLine(), PANIC_AFTER_END_MS, panicWindow(), filterCompanions(), Sort, SORTS (+3 more)

### Community 34 - "Chat"
Cohesion: 0.50
Nodes (5): Chat(), time(), RiseIn(), typing, TypingDots()

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 37 - "lib/chat.ts"
Cohesion: 0.15
Nodes (15): @supabase/supabase-js@^2.119.0, @supabase/supabase-js, mergeMessages(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status (+7 more)

### Community 38 - "pathlib"
Cohesion: 0.14
Nodes (8): letters(), monogram(), wordmark(), icon(), mark(), font_card(), icon(), mark()

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 40 - "interest.ts"
Cohesion: 0.23
Nodes (11): LABEL, styles, Tab, APPROVAL, categoryTitle(), MEET, roleLabel(), SignupChoices (+3 more)

### Community 41 - "pay/[bookingId].tsx"
Cohesion: 0.26
Nodes (9): baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet(), RazorpaySuccess, styles (+1 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "wallet.tsx"
Cohesion: 0.29
Nodes (7): react-native-svg@15.16.0, react-native-svg, Guilloche, Material, MaterialCard(), MATERIALS, styles

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
Cohesion: 0.05
Nodes (185): Activity(), AdminActivity(), priceDiff(), short(), AdminAdmins(), Admins(), Approvals(), AdminBookingDetail() (+177 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.14
Nodes (7): pair(), phone(), section(), bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.19
Nodes (7): city_pill(), day_trips(), plan_rows(), pk(), profile(), row(), screen()

### Community 52 - "states.tsx"
Cohesion: 0.11
Nodes (26): Splash(), AppEffects(), RootLayout(), styles, ConfirmProvider(), connectOnlineManager(), LIVE_INTERVAL, OfflineBanner() (+18 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "preview.tsx"
Cohesion: 0.18
Nodes (18): Data, DATA, STARTS, styles, WHO, endPreview(), go(), PreviewAs (+10 more)

### Community 55 - "react-native"
Cohesion: 0.11
Nodes (15): expo-router, react-native, styles, ID_COPY, styles, styles, styles, setApiToken() (+7 more)

## Knowledge Gaps
- **2 isolated node(s):** `COMMUNITY_IMAGE`, `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 396 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `layout.tsx`, `Chat`, `motion.tsx`, `Text.tsx`, `interest.ts`, `space`, `index.ts`, `formatINR`, `booking.ts`, `states.tsx`, `react-native`, `preview.tsx`, `onboarding.tsx`, `BookingPicker.tsx`, `formatINR`, `availability.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `COMMUNITY_IMAGE`, `expo/tsconfig.base` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06105457909343201 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `layout.tsx`, `package.json`, `motion.tsx`, `Text.tsx`, `dependencies`, `space`, `index.ts`, `formatINR`, `booking.ts`, `BookingPicker.tsx`, `onboarding.tsx`, `@react-native-async-storage/async-storage`, `formatINR`, `availability.tsx`, `lib/chat.ts`, `interest.ts`, `pay/[bookingId].tsx`, `wallet.tsx`, `Text`, `states.tsx`, `preview.tsx`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08571428571428572 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `lib/chat.ts` to `package.json`, `e2e-supabase.mjs`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._