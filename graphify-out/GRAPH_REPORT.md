# Graph Report - prsnn-mobile  (2026-11-15)

## Corpus Check
- 170 files · ~299,271 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1524 nodes · 6992 edges · 51 communities (50 shown, 1 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 244 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `036ed537`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- demoAdmin.ts
- Button.tsx
- onboarding.tsx
- components/bookings.tsx
- expo
- session.ts
- layout.tsx
- companion/[id].tsx
- devDependencies
- package.json
- Text.tsx
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- Icon
- demo.ts
- types.ts
- useSession
- screens_v2.py
- booking.ts
- journey.py
- chat/[bookingId].tsx
- IdentityForm.tsx
- Text
- radius
- react-native
- landing.py
- bar
- body
- pay/[bookingId].tsx
- btn
- states.tsx
- useSession
- brand_screens.py
- lib/chat.ts
- review.tsx
- ic
- home.tsx
- card_systems.py
- pathlib
- logo_concepts.py
- view_as.py
- logo_luxe.py
- preview.tsx
- wordmarks.py
- categories.py
- m_book
- app/_layout.tsx
- chat_keyboard.py

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
10. `colors` - 85 edges

## Surprising Connections (you probably didn't know these)
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `CompanionOnboarding()` --indirect_call--> `categoryTitle()`  [INFERRED]
  src/app/fellow/onboarding.tsx → src/domain/categories.ts
- `AdminOverview()` --calls--> `BellButton()`  [EXTRACTED]
  src/app/admin/index.tsx → src/components/ui/layout.tsx
- `AdminOverview()` --calls--> `formatINR()`  [EXTRACTED]
  src/app/admin/index.tsx → src/domain/booking.ts
- `AdminOverview()` --calls--> `useSession`  [EXTRACTED]
  src/app/admin/index.tsx → src/state/session.ts

## Import Cycles
- None detected.

## Communities (51 total, 1 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (28): AdminBooking, AuditEntry, BroadcastRecord, CityPlan, PanicAlert, backend, activity, allDays (+20 more)

### Community 1 - "Button.tsx"
Cohesion: 0.08
Nodes (24): STARTS, styles, WHO, styles, Filter, ICON, styles, tab() (+16 more)

### Community 2 - "onboarding.tsx"
Cohesion: 0.25
Nodes (12): Availability(), AvailabilityForm(), initial(), AvailabilityEditor(), AvailabilityValue, emptyAvailability(), HOURS, styles (+4 more)

### Community 3 - "components/bookings.tsx"
Cohesion: 0.23
Nodes (26): BookingDetail(), styles, Confirmed(), OfferSummary(), BookingCard(), formatDate(), MetaLine(), PrepaidStatus() (+18 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption (+31 more)

### Community 5 - "session.ts"
Cohesion: 0.18
Nodes (20): loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken(), checkLocalPin(), clearLocalPin() (+12 more)

### Community 6 - "layout.tsx"
Cohesion: 0.13
Nodes (30): expo-router, react, @tanstack/react-query, styles, Tab, EMPTY, styles, styles (+22 more)

### Community 7 - "companion/[id].tsx"
Cohesion: 0.20
Nodes (19): CompanionProfile(), styles, CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton(), Photo() (+11 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "package.json"
Cohesion: 0.05
Nodes (60): dependencies, expo@~58.0.20, expo-constants@~58.0.13, expo-crypto@~58.0.7, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/outfit@^0.4.3, @expo-google-fonts/urbanist@^0.4.2 (+52 more)

### Community 10 - "Text.tsx"
Cohesion: 0.09
Nodes (33): expo-haptics, react-native-reanimated, react-native-safe-area-context, DOT_FADE, DOT_SETTLE, styles, PULSE, styles (+25 more)

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
Cohesion: 0.16
Nodes (24): AreaSheet(), CitySheet(), Dropdown(), fold(), LocationFields(), NoMatch(), Row(), Sheet() (+16 more)

### Community 16 - "demo.ts"
Cohesion: 0.07
Nodes (25): AppNotification, Backend, allDays, bookings, companionStatus(), day(), demo, DemoCompanion (+17 more)

### Community 17 - "types.ts"
Cohesion: 0.07
Nodes (31): AdminChatMessage, AdminOverview, AdminPerson, AllocationState, Availability, BookingStatus, BroadcastAudience, IdType (+23 more)

### Community 19 - "useSession"
Cohesion: 0.21
Nodes (19): BookingsTab(), styles, TABS, TabsLayout(), MessagesTab(), styles, canChat(), isMineAsCompanion() (+11 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "booking.ts"
Cohesion: 0.14
Nodes (26): SelectDateTime(), styles, WEEK, PackageGrid(), BookingTab, CategoryKey, DAY_KEYS, dayKeyOf() (+18 more)

### Community 22 - "journey.py"
Cohesion: 0.09
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "chat/[bookingId].tsx"
Cohesion: 0.22
Nodes (13): Chat(), styles, time(), Earnings(), styles, HoldButton(), PanicButton(), IconButton() (+5 more)

### Community 24 - "IdentityForm.tsx"
Cohesion: 0.15
Nodes (17): IdentityValue, styles, savingPercent(), GENDER_OPTIONS, hasIdentity(), SEE_OPTIONS, VISIBILITY_COPY, needsSetup() (+9 more)

### Community 25 - "Text"
Cohesion: 0.06
Nodes (140): Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Admins(), styles (+132 more)

### Community 26 - "radius"
Cohesion: 0.18
Nodes (14): MAT, Props, styles, BRAND_WORD, dotColorFor(), isLight(), Wordmark(), Guilloche (+6 more)

### Community 27 - "react-native"
Cohesion: 0.12
Nodes (32): react-native, styles, CompanionOnboarding(), INTERESTS, Line(), Options(), Step, STEPS (+24 more)

### Community 28 - "landing.py"
Cohesion: 0.10
Nodes (41): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+33 more)

### Community 29 - "bar"
Cohesion: 0.12
Nodes (54): avatar(), bar(), card(), checkbox(), chips(), field(), label(), pill() (+46 more)

### Community 30 - "body"
Cohesion: 0.16
Nodes (43): body(), group(), h(), row(), s_admin(), s_admin_booking(), s_bookings(), s_dashboard() (+35 more)

### Community 31 - "pay/[bookingId].tsx"
Cohesion: 0.23
Nodes (14): METHODS, Pay(), styles, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props (+6 more)

### Community 32 - "btn"
Cohesion: 0.15
Nodes (39): btn(), foot(), notice(), s_book_time(), s_companion(), s_confirmed(), s_email(), s_otp() (+31 more)

### Community 33 - "states.tsx"
Cohesion: 0.22
Nodes (8): LIVE_INTERVAL, POP, ProgressBar(), PULSE, RING, SLIDE, styles, useSlow()

### Community 34 - "useSession"
Cohesion: 0.19
Nodes (17): Phase, styles, VerifyId(), HomeTab(), CompanionDashboard(), Stat(), styles, Upload() (+9 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 37 - "lib/chat.ts"
Cohesion: 0.15
Nodes (12): mergeMessages(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status, toMessage(), useChat() (+4 more)

### Community 38 - "review.tsx"
Cohesion: 0.11
Nodes (38): Row(), Checkout(), newKey(), RELATIONS, Step(), styles, perks(), a11y() (+30 more)

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 41 - "home.tsx"
Cohesion: 0.10
Nodes (37): expo-image, expo-linear-gradient, EMPTY, styles, CategoryPage(), styles, PHOTOS, Splash() (+29 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 45 - "pathlib"
Cohesion: 0.14
Nodes (8): letters(), monogram(), wordmark(), icon(), mark(), font_card(), icon(), mark()

### Community 46 - "logo_concepts.py"
Cohesion: 0.19
Nodes (10): card(), diamond(), diamond_only(), face_to_face(), pin_p(), svg(), two_seats(), uid() (+2 more)

### Community 47 - "view_as.py"
Cohesion: 0.26
Nodes (10): s_action(), s_companion_dash(), s_companion_onb(), s_exit(), s_member_book(), s_member_home(), s_pick(), s_switch() (+2 more)

### Community 48 - "logo_luxe.py"
Cohesion: 0.29
Nodes (9): card(), cut(), gem(), linked(), signature(), svg(), uid(), word() (+1 more)

### Community 49 - "preview.tsx"
Cohesion: 0.18
Nodes (16): ProfileTab(), styles, seeLabel(), idCheckValue(), endPreview(), go(), PreviewAs, PreviewStart (+8 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.14
Nodes (7): pair(), phone(), section(), bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.19
Nodes (7): city_pill(), day_trips(), plan_rows(), pk(), profile(), row(), screen()

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 55 - "app/_layout.tsx"
Cohesion: 0.10
Nodes (25): expo-device@~58.0.5, expo-font@~58.0.10, expo-notifications@~58.1.8, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-device, expo-font (+17 more)

### Community 61 - "chat_keyboard.py"
Cohesion: 0.38
Nodes (3): composer(), header(), svg()

## Knowledge Gaps
- **2 isolated node(s):** `COMMUNITY_IMAGE`, `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 375 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `Button.tsx`, `onboarding.tsx`, `components/bookings.tsx`, `layout.tsx`, `companion/[id].tsx`, `Text.tsx`, `Icon`, `useSession`, `booking.ts`, `chat/[bookingId].tsx`, `IdentityForm.tsx`, `radius`, `react-native`, `pay/[bookingId].tsx`, `states.tsx`, `useSession`, `review.tsx`, `home.tsx`, `preview.tsx`, `app/_layout.tsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `COMMUNITY_IMAGE`, `expo/tsconfig.base` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08266129032258064 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `Button.tsx`, `onboarding.tsx`, `components/bookings.tsx`, `session.ts`, `layout.tsx`, `companion/[id].tsx`, `package.json`, `Text.tsx`, `Icon`, `useSession`, `booking.ts`, `chat/[bookingId].tsx`, `IdentityForm.tsx`, `Text`, `radius`, `pay/[bookingId].tsx`, `states.tsx`, `useSession`, `lib/chat.ts`, `review.tsx`, `home.tsx`, `preview.tsx`, `app/_layout.tsx`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `Button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07954545454545454 - nodes in this community are weakly interconnected._
- **Why does `expo-router` connect `layout.tsx` to `Button.tsx`, `onboarding.tsx`, `components/bookings.tsx`, `useSession`, `states.tsx`, `review.tsx`, `companion/[id].tsx`, `package.json`, `home.tsx`, `Text.tsx`, `preview.tsx`, `useSession`, `booking.ts`, `app/_layout.tsx`, `chat/[bookingId].tsx`, `Text`, `react-native`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `expo` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._