# Graph Report - prsnn-mobile  (2026-11-14)

## Corpus Check
- 161 files · ~294,739 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1482 nodes · 6828 edges · 54 communities (52 shown, 2 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 243 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `894c6bda`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- demoAdmin.ts
- domain/pricing.ts
- admin.tsx
- useSession
- expo
- session.ts
- Text
- companion/[id].tsx
- devDependencies
- package.json
- errorMessage
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- Icon
- demo.ts
- types.ts
- app/_layout.tsx
- screens_v2.py
- booking.ts
- journey.py
- layout.tsx
- chat.ts
- profile.tsx
- formatINR
- search.tsx
- landing.py
- bar
- body
- pay/[bookingId].tsx
- btn
- preview.tsx
- verification.ts
- brand_screens.py
- brand_directions.py
- wordmark_dot.py
- ic
- home.tsx
- card_systems.py
- chat/[bookingId].tsx
- availability.tsx
- pathlib
- logo_concepts.py
- view_as.py
- logo_luxe.py
- flow.ts
- wordmarks.py
- categories.py
- supabase.ts
- m_book
- chat_keyboard.py

## God Nodes (most connected - your core abstractions)
1. `Text()` - 192 edges
2. `body()` - 138 edges
3. `Icon` - 112 edges
4. `btn()` - 104 edges
5. `ic()` - 102 edges
6. `errorMessage()` - 97 edges
7. `Button()` - 96 edges
8. `react-native` - 90 edges
9. `Header()` - 85 edges
10. `bar()` - 84 edges

## Surprising Connections (you probably didn't know these)
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `AdminLayout()` --calls--> `AdminGate()`  [EXTRACTED]
  src/app/admin/_layout.tsx → src/components/admin.tsx
- `CompanionOnboarding()` --indirect_call--> `categoryTitle()`  [INFERRED]
  src/app/fellow/onboarding.tsx → src/domain/categories.ts
- `ProfileTab()` --calls--> `useConfirm()`  [EXTRACTED]
  src/app/(tabs)/profile.tsx → src/components/ui/confirm.tsx
- `ProfileTab()` --calls--> `Icon`  [EXTRACTED]
  src/app/(tabs)/profile.tsx → src/components/ui/Icon.tsx

## Import Cycles
- None detected.

## Communities (54 total, 2 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.09
Nodes (27): AuditEntry, BroadcastRecord, CityPlan, PanicAlert, Backend, activity, allDays, bk() (+19 more)

### Community 1 - "domain/pricing.ts"
Cohesion: 0.14
Nodes (23): AdminPrices(), Draft, draftOf(), Pair(), Prices(), styles, perks(), applyPricing() (+15 more)

### Community 2 - "admin.tsx"
Cohesion: 0.12
Nodes (43): AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap(), AdminOverview(), BLINK, Money() (+35 more)

### Community 3 - "useSession"
Cohesion: 0.11
Nodes (55): BookingDetail(), styles, Confirmed(), styles, Earnings(), styles, OfferSummary(), Phase (+47 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption (+31 more)

### Community 5 - "session.ts"
Cohesion: 0.18
Nodes (20): loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken(), checkLocalPin(), clearLocalPin() (+12 more)

### Community 6 - "Text"
Cohesion: 0.15
Nodes (49): Admins(), CompanionPicker(), Broadcast(), PanicDetail(), EMPTY, Plans(), Row(), styles (+41 more)

### Community 7 - "companion/[id].tsx"
Cohesion: 0.24
Nodes (18): CompanionProfile(), styles, CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton(), Photo() (+10 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "package.json"
Cohesion: 0.05
Nodes (52): dependencies, expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/outfit@^0.4.3, @expo-google-fonts/urbanist@^0.4.2, expo-haptics@~58.0.7 (+44 more)

### Community 10 - "errorMessage"
Cohesion: 0.11
Nodes (47): react-native-safe-area-context, @tanstack/react-query, Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins() (+39 more)

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

### Community 15 - "Icon"
Cohesion: 0.10
Nodes (45): expo-image, EditProfile(), styles, INTERESTS, Options(), Step, STEPS, styles (+37 more)

### Community 16 - "demo.ts"
Cohesion: 0.08
Nodes (22): allDays, bookings, companionStatus(), day(), demo, DemoCompanion, demoIncoming, first() (+14 more)

### Community 17 - "types.ts"
Cohesion: 0.07
Nodes (33): BookingTab, PANIC_AFTER_END_MS, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, ApprovalStatus (+25 more)

### Community 19 - "app/_layout.tsx"
Cohesion: 0.12
Nodes (22): expo-font@~58.0.10, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-splash-screen, expo-status-bar, react-native-gesture-handler (+14 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "booking.ts"
Cohesion: 0.14
Nodes (24): SelectDateTime(), styles, WEEK, amountDuePaise(), BookingTab, CategoryKey, DAY_KEYS, dayKeyOf() (+16 more)

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "layout.tsx"
Cohesion: 0.06
Nodes (80): expo-haptics, expo-linear-gradient, expo-router, react, react-native, react-native-reanimated, AdminLayout(), styles (+72 more)

### Community 24 - "chat.ts"
Cohesion: 0.28
Nodes (8): ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status, toMessage(), useChat(), supabase

### Community 25 - "profile.tsx"
Cohesion: 0.19
Nodes (9): ProfileTab(), styles, Ask, ConfirmOptions, Ctx, styles, idCheckValue(), unregisterPush() (+1 more)

### Community 26 - "formatINR"
Cohesion: 0.23
Nodes (17): a11y(), BigCard(), MAT, matFor(), PackageGrid(), Props, styles, Tab() (+9 more)

### Community 27 - "search.tsx"
Cohesion: 0.08
Nodes (40): Privacy(), PrivacyForm(), styles, identityComplete(), IdentityValue, AreaPicker(), CityPicker(), CitySheet() (+32 more)

### Community 28 - "landing.py"
Cohesion: 0.09
Nodes (43): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+35 more)

### Community 29 - "bar"
Cohesion: 0.12
Nodes (54): avatar(), bar(), card(), checkbox(), chips(), field(), label(), pill() (+46 more)

### Community 30 - "body"
Cohesion: 0.16
Nodes (43): body(), group(), h(), row(), s_admin(), s_admin_booking(), s_bookings(), s_dashboard() (+35 more)

### Community 31 - "pay/[bookingId].tsx"
Cohesion: 0.31
Nodes (8): baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet(), RazorpaySuccess, styles

### Community 32 - "btn"
Cohesion: 0.15
Nodes (39): btn(), foot(), notice(), s_book_time(), s_companion(), s_confirmed(), s_email(), s_otp() (+31 more)

### Community 33 - "preview.tsx"
Cohesion: 0.27
Nodes (12): endPreview(), go(), PreviewAs, PreviewStart, PreviewStrip(), routeFor(), sampleUser(), startPreview() (+4 more)

### Community 34 - "verification.ts"
Cohesion: 0.31
Nodes (8): IdType, VerificationStatus, ID_TYPES, idTypeLabel(), idUploadError(), isLiveCompanion(), needsBack(), needsIdToAccept()

### Community 35 - "brand_screens.py"
Cohesion: 0.14
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 37 - "brand_directions.py"
Cohesion: 0.33
Nodes (3): pair(), phone(), section()

### Community 38 - "wordmark_dot.py"
Cohesion: 0.60
Nodes (3): font_card(), icon(), mark()

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 41 - "home.tsx"
Cohesion: 0.22
Nodes (17): CategoryPage(), Splash(), Discover(), greeting(), HomeTab(), styles, HomeCategories(), dotColorFor() (+9 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "chat/[bookingId].tsx"
Cohesion: 0.30
Nodes (10): Chat(), styles, time(), ActiveAlert(), HoldButton(), PanicButton(), PULSE, styles (+2 more)

### Community 44 - "availability.tsx"
Cohesion: 0.22
Nodes (14): Availability(), AvailabilityForm(), initial(), CompanionOnboarding(), Line(), AvailabilityEditor(), AvailabilityValue, emptyAvailability() (+6 more)

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

### Community 49 - "flow.ts"
Cohesion: 0.38
Nodes (9): SessionUser, afterAuth(), afterPin(), goHome(), goToLogin(), resetTo(), hasLocalPin(), AuthResult (+1 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 52 - "supabase.ts"
Cohesion: 0.10
Nodes (17): expo-constants@~58.0.13, expo-device@~58.0.5, expo-notifications@~58.1.8, @react-native-async-storage/async-storage@2.2.0, react-native-url-polyfill@^4.0.0, @supabase/supabase-js@^2.119.0, expo-constants, expo-device (+9 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "chat_keyboard.py"
Cohesion: 0.38
Nodes (3): composer(), header(), svg()

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 362 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `domain/pricing.ts`, `admin.tsx`, `useSession`, `preview.tsx`, `companion/[id].tsx`, `home.tsx`, `errorMessage`, `chat/[bookingId].tsx`, `availability.tsx`, `Icon`, `app/_layout.tsx`, `booking.ts`, `layout.tsx`, `profile.tsx`, `formatINR`, `search.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08602150537634409 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `domain/pricing.ts`, `admin.tsx`, `useSession`, `session.ts`, `Text`, `companion/[id].tsx`, `package.json`, `errorMessage`, `Icon`, `app/_layout.tsx`, `booking.ts`, `profile.tsx`, `formatINR`, `search.tsx`, `pay/[bookingId].tsx`, `preview.tsx`, `home.tsx`, `chat/[bookingId].tsx`, `availability.tsx`, `supabase.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `domain/pricing.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14245014245014245 - nodes in this community are weakly interconnected._
- **Why does `expo-router` connect `layout.tsx` to `preview.tsx`, `admin.tsx`, `useSession`, `+not-found.tsx`, `Text`, `companion/[id].tsx`, `package.json`, `errorMessage`, `chat/[bookingId].tsx`, `availability.tsx`, `home.tsx`, `Icon`, `flow.ts`, `app/_layout.tsx`, `supabase.ts`, `booking.ts`, `profile.tsx`, `search.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Should `admin.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11673469387755102 - nodes in this community are weakly interconnected._