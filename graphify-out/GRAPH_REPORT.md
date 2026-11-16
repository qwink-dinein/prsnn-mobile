# Graph Report - prsnn-mobile  (2026-11-16)

## Corpus Check
- 178 files · ~305,912 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1593 nodes · 7235 edges · 56 communities
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 244 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `028a1706`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- tokens.ts
- index.ts
- booking.ts
- expo
- session.ts
- motion.tsx
- package.json
- devDependencies
- demoAdmin.ts
- Button.tsx
- compilerOptions
- scripts
- e2e-supabase.mjs
- jest
- flow.ts
- demo.ts
- preview.tsx
- wallet_variants.py
- layout.tsx
- screens_v2.py
- states.tsx
- journey.py
- privacy.tsx
- IdentityForm.tsx
- Text.tsx
- PackageGrid.tsx
- react-native
- landing.py
- bar
- body
- pathlib
- btn
- interest.ts
- wallet_prices.py
- brand_screens.py
- space
- lib/chat.ts
- brand_directions.py
- ic
- wordmark_dot.py
- pay/[bookingId].tsx
- card_systems.py
- login.tsx
- logo_concepts.py
- view_as.py
- logo_luxe.py
- Text
- wordmarks.py
- categories.py
- app/_layout.tsx
- m_book
- verification.ts
- push.ts
- rules.ts
- config.ts

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
- `ProfileTab()` --calls--> `seeLabel()`  [EXTRACTED]
  src/app/(tabs)/profile.tsx → src/domain/privacy.ts
- `ProfileTab()` --calls--> `companionStatusLine()`  [EXTRACTED]
  src/app/(tabs)/profile.tsx → src/domain/verification.ts

## Import Cycles
- None detected.

## Communities (56 total, 0 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.06
Nodes (40): BusyTime, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, Availability, BookingStatus, BroadcastAudience (+32 more)

### Community 1 - "tokens.ts"
Cohesion: 0.08
Nodes (40): expo-image, expo-linear-gradient, styles, styles, PHOTOS, Splash(), styles, OPTIONS (+32 more)

### Community 2 - "index.ts"
Cohesion: 0.11
Nodes (20): expo-router, react, EMPTY, styles, styles, styles, WEEK, styles (+12 more)

### Community 3 - "booking.ts"
Cohesion: 0.06
Nodes (88): BookingDetail(), styles, Chat(), styles, time(), Confirmed(), OfferSummary(), BookingsTab() (+80 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (47): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+39 more)

### Community 5 - "session.ts"
Cohesion: 0.22
Nodes (17): loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), checkLocalPin(), clearLocalPin(), forgetSavedSession(), hash() (+9 more)

### Community 6 - "motion.tsx"
Cohesion: 0.10
Nodes (20): expo-haptics, react-native-reanimated, styles, PULSE, styles, bob, EASE_OUT, easeOutQuart() (+12 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (52): dependencies, expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/outfit@^0.4.3, @expo-google-fonts/urbanist@^0.4.2, expo-haptics@~58.0.7 (+44 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.07
Nodes (31): AdminBooking, AuditEntry, BroadcastRecord, CityPlan, Role, backend, Backend, activity (+23 more)

### Community 10 - "Button.tsx"
Cohesion: 0.09
Nodes (20): styles, Tab, Data, DATA, STARTS, styles, WHO, REASONS (+12 more)

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
Cohesion: 0.23
Nodes (13): normaliseIndianMobile(), hasIdentity(), firstUnanswered(), needsSetup(), SessionUser, afterAuth(), afterPin(), goHome() (+5 more)

### Community 16 - "demo.ts"
Cohesion: 0.08
Nodes (24): AppNotification, allDays, bookings, companionStatus(), day(), demo, DemoCompanion, demoConsents (+16 more)

### Community 17 - "preview.tsx"
Cohesion: 0.17
Nodes (17): styles, seeLabel(), idCheckValue(), endPreview(), go(), PreviewAs, PreviewStart, PreviewStrip() (+9 more)

### Community 18 - "wallet_variants.py"
Cohesion: 0.27
Nodes (12): bell(), card(), guilloche(), head(), logo(), tabs(), v_grid(), v_lifted() (+4 more)

### Community 19 - "layout.tsx"
Cohesion: 0.18
Nodes (13): METHODS, styles, tab(), TabsLayout(), IconName, bellStyles, layoutStyles, styles (+5 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "states.tsx"
Cohesion: 0.13
Nodes (14): styles, EMPTY, styles, LIVE_INTERVAL, POP, ProgressBar(), PULSE, RING (+6 more)

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "privacy.tsx"
Cohesion: 0.11
Nodes (28): AreaSheet(), CitySheet(), fold(), LocationFields(), NoMatch(), Row(), Sheet(), StateSheet() (+20 more)

### Community 24 - "IdentityForm.tsx"
Cohesion: 0.27
Nodes (12): identityComplete(), IdentityValue, styles, defaultVisibility(), GENDER_OPTIONS, SEE_OPTIONS, VISIBILITY_COPY, ApprovalStatus (+4 more)

### Community 25 - "Text.tsx"
Cohesion: 0.11
Nodes (25): react-native-safe-area-context, @tanstack/react-query, styles, styles, LABEL, styles, Tab, FILTERS (+17 more)

### Community 26 - "PackageGrid.tsx"
Cohesion: 0.10
Nodes (36): a11y(), BigCard(), MAT, matFor(), PackageGrid(), Props, styles, Tab() (+28 more)

### Community 27 - "react-native"
Cohesion: 0.15
Nodes (20): react-native, styles, INTERESTS, Step, STEPS, styles, styles, COUNTRIES (+12 more)

### Community 28 - "landing.py"
Cohesion: 0.34
Nodes (17): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+9 more)

### Community 29 - "bar"
Cohesion: 0.12
Nodes (54): avatar(), bar(), card(), checkbox(), chips(), field(), label(), pill() (+46 more)

### Community 30 - "body"
Cohesion: 0.16
Nodes (43): body(), group(), h(), row(), s_admin(), s_admin_booking(), s_bookings(), s_dashboard() (+35 more)

### Community 31 - "pathlib"
Cohesion: 0.13
Nodes (8): composer(), header(), svg(), letters(), monogram(), wordmark(), icon(), mark()

### Community 32 - "btn"
Cohesion: 0.15
Nodes (39): btn(), foot(), notice(), s_book_time(), s_companion(), s_confirmed(), s_email(), s_otp() (+31 more)

### Community 33 - "interest.ts"
Cohesion: 0.31
Nodes (8): APPROVAL, categoryTitle(), MEET, roleLabel(), SignupChoices, signupDetails(), topCategories(), base

### Community 34 - "wallet_prices.py"
Cohesion: 0.29
Nodes (12): big_card(), cta(), header(), ic(), p_companion(), p_lift(), p_stack(), p_swipe() (+4 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 36 - "space"
Cohesion: 0.36
Nodes (7): initial(), AvailabilityValue, emptyAvailability(), styles, WEEK_DAYS, Profile, space

### Community 37 - "lib/chat.ts"
Cohesion: 0.26
Nodes (9): mergeMessages(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, Row, Status, toMessage(), useChat() (+1 more)

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

### Community 43 - "login.tsx"
Cohesion: 0.24
Nodes (6): styles, DOT_FADE, DOT_SETTLE, styles, BRAND_WORD, EASE_OUT_CSS

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
Nodes (188): Activity(), AdminActivity(), priceDiff(), short(), AdminAdmins(), Admins(), Approvals(), AdminBookingDetail() (+180 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.19
Nodes (7): city_pill(), day_trips(), plan_rows(), pk(), profile(), row(), screen()

### Community 52 - "app/_layout.tsx"
Cohesion: 0.13
Nodes (21): expo-font@~58.0.10, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-splash-screen, expo-status-bar, react-native-gesture-handler (+13 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "verification.ts"
Cohesion: 0.33
Nodes (8): VerificationStatus, companionStatusLine(), ID_TYPES, idTypeLabel(), idUploadError(), isLiveCompanion(), needsBack(), needsIdToAccept()

### Community 55 - "push.ts"
Cohesion: 0.20
Nodes (9): expo-constants@~58.0.13, expo-device@~58.0.5, expo-notifications@~58.1.8, expo-constants, expo-device, expo-notifications, openFromPush(), registerForPush() (+1 more)

### Community 56 - "rules.ts"
Cohesion: 0.33
Nodes (8): agreedAt(), Consent, ConsentKind, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

### Community 64 - "config.ts"
Cohesion: 0.15
Nodes (11): @react-native-async-storage/async-storage@2.2.0, react-native-url-polyfill@^4.0.0, @supabase/supabase-js@^2.119.0, @react-native-async-storage/async-storage, react-native-url-polyfill, @supabase/supabase-js, DEMO, SITE_URL (+3 more)

## Knowledge Gaps
- **2 isolated node(s):** `COMMUNITY_IMAGE`, `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 393 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `tokens.ts`, `index.ts`, `booking.ts`, `space`, `motion.tsx`, `Button.tsx`, `login.tsx`, `preview.tsx`, `layout.tsx`, `app/_layout.tsx`, `states.tsx`, `privacy.tsx`, `IdentityForm.tsx`, `Text.tsx`, `PackageGrid.tsx`, `react-native`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `COMMUNITY_IMAGE`, `expo/tsconfig.base` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06363636363636363 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `config.ts` to `lib/chat.ts`, `e2e-supabase.mjs`, `package.json`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `tokens.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0822746521476104 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `tokens.ts`, `index.ts`, `booking.ts`, `session.ts`, `motion.tsx`, `package.json`, `Button.tsx`, `preview.tsx`, `layout.tsx`, `states.tsx`, `privacy.tsx`, `IdentityForm.tsx`, `Text.tsx`, `PackageGrid.tsx`, `space`, `pay/[bookingId].tsx`, `login.tsx`, `Text`, `app/_layout.tsx`, `push.ts`, `config.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11406423034330011 - nodes in this community are weakly interconnected._