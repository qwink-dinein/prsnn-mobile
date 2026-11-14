# Graph Report - prsnn-mobile  (2026-11-14)

## Corpus Check
- 157 files · ~291,940 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1452 nodes · 6651 edges · 60 communities (48 shown, 12 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 243 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5ecd9b8d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- demoAdmin.ts
- onboarding.tsx
- colors
- booking.ts
- expo
- session.ts
- profile.tsx
- home.tsx
- devDependencies
- dependencies
- expo-status-bar
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- Text
- demo.ts
- types.ts
- package.json
- screens_v2.py
- PlacePicker.tsx
- journey.py
- space
- chat.ts
- IdentityForm.tsx
- layout.tsx
- react-native
- landing.py
- bar
- body
- pay/[bookingId].tsx
- btn
- react-native
- expo-font
- brand_screens.py
- expo-linking@~58.0.14
- push.ts
- expo-secure-store
- ic
- react-native-webview
- react-native-worklets@0.13.0
- card_systems.py
- zod@^4.6.7
- domain.test.ts
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
- logo.py
- @expo-google-fonts/dm-sans@^0.4.2
- @expo-google-fonts/lora@^0.4.2
- react-dom@19.3.0
- react-native-web@~0.21.4

## God Nodes (most connected - your core abstractions)
1. `Text()` - 186 edges
2. `body()` - 138 edges
3. `Icon` - 108 edges
4. `btn()` - 104 edges
5. `ic()` - 102 edges
6. `errorMessage()` - 95 edges
7. `Button()` - 94 edges
8. `react-native` - 86 edges
9. `bar()` - 84 edges
10. `Header()` - 83 edges

## Surprising Connections (you probably didn't know these)
- `a_admins()` --calls--> `ic()`  [EXTRACTED]
  scripts/design/screens_v2.py → scripts/design/all_screens.py
- `a_approvals()` --calls--> `ic()`  [EXTRACTED]
  scripts/design/screens_v2.py → scripts/design/all_screens.py
- `a_plans()` --calls--> `ic()`  [EXTRACTED]
  scripts/design/screens_v2.py → scripts/design/all_screens.py
- `a_users()` --calls--> `ic()`  [EXTRACTED]
  scripts/design/screens_v2.py → scripts/design/all_screens.py
- `bk_card()` --calls--> `ic()`  [EXTRACTED]
  scripts/design/screens_v2.py → scripts/design/all_screens.py

## Import Cycles
- None detected.

## Communities (60 total, 12 thin omitted)

### Community 0 - "demoAdmin.ts"
Cohesion: 0.09
Nodes (27): AdminBooking, BroadcastRecord, CityPlan, PanicAlert, backend, activity, allDays, bk() (+19 more)

### Community 1 - "onboarding.tsx"
Cohesion: 0.09
Nodes (50): CategoryPage(), CompanionProfile(), styles, CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton() (+42 more)

### Community 2 - "colors"
Cohesion: 0.12
Nodes (22): expo-haptics, react-native-reanimated, styles, DOT_FADE, DOT_SETTLE, styles, PULSE, styles (+14 more)

### Community 3 - "booking.ts"
Cohesion: 0.07
Nodes (73): newKey(), RELATIONS, styles, BookingDetail(), styles, Chat(), time(), Confirmed() (+65 more)

### Community 4 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, package, permissions, usesNonExemptEncryption (+31 more)

### Community 5 - "session.ts"
Cohesion: 0.16
Nodes (23): @react-native-async-storage/async-storage@2.2.0, @react-native-async-storage/async-storage, loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken() (+15 more)

### Community 6 - "profile.tsx"
Cohesion: 0.10
Nodes (23): RootLayout(), styles, Ask, ConfirmOptions, ConfirmProvider(), Ctx, styles, connectOnlineManager() (+15 more)

### Community 7 - "home.tsx"
Cohesion: 0.16
Nodes (21): expo-image, expo-linear-gradient, react-native-safe-area-context, styles, Tab, styles, styles, styles (+13 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/outfit@^0.4.3, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-image-picker@~58.0.10, expo-linear-gradient@~58.0.3 (+16 more)

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

### Community 15 - "Text"
Cohesion: 0.05
Nodes (182): Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Admins(), styles (+174 more)

### Community 16 - "demo.ts"
Cohesion: 0.08
Nodes (22): AppNotification, VerificationStatus, Backend, allDays, bookings, companionStatus(), demo, DemoCompanion (+14 more)

### Community 17 - "types.ts"
Cohesion: 0.08
Nodes (29): AdminChatMessage, AdminOverview, AdminPerson, AllocationState, ApprovalStatus, AuditEntry, Availability, BookingStatus (+21 more)

### Community 19 - "package.json"
Cohesion: 0.11
Nodes (18): @expo-google-fonts/urbanist@^0.4.2, expo-splash-screen@~58.0.11, @react-native-community/netinfo@^12.0.1, react-native-gesture-handler@~3.3.0, react-native-url-polyfill@^4.0.0, @supabase/supabase-js@^2.119.0, zustand@^5.0.16, main (+10 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "PlacePicker.tsx"
Cohesion: 0.22
Nodes (9): styles, AREAS, areasFor(), ALL_PLACES, cityCount, fold(), Place, POPULAR (+1 more)

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "space"
Cohesion: 0.14
Nodes (24): expo-router, react, @tanstack/react-query, EMPTY, styles, styles, FILTERS, styles (+16 more)

### Community 24 - "chat.ts"
Cohesion: 0.22
Nodes (12): AppEffects(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status, toMessage(), useChat() (+4 more)

### Community 25 - "IdentityForm.tsx"
Cohesion: 0.32
Nodes (10): identityComplete(), IdentityValue, styles, defaultVisibility(), GENDER_OPTIONS, SEE_OPTIONS, VISIBILITY_COPY, Gender (+2 more)

### Community 26 - "layout.tsx"
Cohesion: 0.13
Nodes (19): PHOTOS, styles, OPTIONS, R, styles, tab(), TabsLayout(), BRAND_WORD (+11 more)

### Community 27 - "react-native"
Cohesion: 0.09
Nodes (24): PERKS, styles, ID_COPY, styles, Filter, ICON, styles, styles (+16 more)

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
Cohesion: 0.27
Nodes (10): METHODS, styles, baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet() (+2 more)

### Community 32 - "btn"
Cohesion: 0.15
Nodes (39): btn(), foot(), notice(), s_book_time(), s_companion(), s_confirmed(), s_email(), s_otp() (+31 more)

### Community 33 - "react-native"
Cohesion: 0.13
Nodes (22): react-native, styles, INTERESTS, Step, STEPS, styles, Phase, styles (+14 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 37 - "push.ts"
Cohesion: 0.20
Nodes (9): expo-constants@~58.0.13, expo-device@~58.0.5, expo-notifications@~58.1.8, expo-constants, expo-device, expo-notifications, openFromPush(), registerForPush() (+1 more)

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 44 - "domain.test.ts"
Cohesion: 0.14
Nodes (15): MIN_LEAD_MINUTES, monthGrid(), timeSlots(), toDateKey(), offersCategory(), PANIC_AFTER_END_MS, panicWindow(), filterCompanions() (+7 more)

### Community 45 - "pathlib"
Cohesion: 0.13
Nodes (8): pair(), phone(), section(), icon(), mark(), font_card(), icon(), mark()

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
Cohesion: 0.36
Nodes (9): hasIdentity(), needsSetup(), SessionUser, afterAuth(), afterPin(), goHome(), resetTo(), AuthResult (+1 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 52 - "supabase.ts"
Cohesion: 0.32
Nodes (4): DEMO, SUPABASE_KEY, SUPABASE_URL, supabase

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "chat_keyboard.py"
Cohesion: 0.38
Nodes (3): composer(), header(), svg()

### Community 55 - "logo.py"
Cohesion: 0.47
Nodes (3): letters(), monogram(), wordmark()

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 353 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `onboarding.tsx`, `colors`, `booking.ts`, `push.ts`, `profile.tsx`, `home.tsx`, `session.ts`, `dependencies`, `Text`, `package.json`, `supabase.ts`, `PlacePicker.tsx`, `space`, `IdentityForm.tsx`, `layout.tsx`, `react-native`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `demoAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08602150537634409 - nodes in this community are weakly interconnected._
- **Why does `expo-router` connect `space` to `onboarding.tsx`, `colors`, `booking.ts`, `react-native`, `push.ts`, `profile.tsx`, `home.tsx`, `dependencies`, `Text`, `flow.ts`, `package.json`, `layout.tsx`, `react-native`, `pay/[bookingId].tsx`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `onboarding.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09350649350649351 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `package.json` to `supabase.ts`, `e2e-supabase.mjs`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Should `colors` be split into smaller, more focused modules?**
  _Cohesion score 0.12473118279569892 - nodes in this community are weakly interconnected._