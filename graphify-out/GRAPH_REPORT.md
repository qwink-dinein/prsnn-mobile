# Graph Report - prsnn-mobile  (2026-11-16)

## Corpus Check
- 177 files · ~304,170 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1576 nodes · 7176 edges · 56 communities (54 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 244 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f033ebfc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- states.tsx
- layout.tsx
- booking.ts
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
- round2.test.ts
- demo.ts
- companion/[id].tsx
- useSession
- screens_v2.py
- domain/pricing.ts
- journey.py
- privacy.tsx
- IdentityForm.tsx
- errorMessage
- PackageGrid.tsx
- Icon
- landing.py
- bar
- body
- pathlib
- btn
- interest.ts
- role.tsx
- brand_screens.py
- Text.tsx
- ic
- pay/[bookingId].tsx
- card_systems.py
- Text
- formatINR
- logo.py
- logo_concepts.py
- view_as.py
- logo_luxe.py
- admin.tsx
- wordmarks.py
- categories.py
- app/_layout.tsx
- m_book
- verification.ts
- push.ts
- rules.ts
- chat_keyboard.py
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
- `Notifications()` --calls--> `Button()`  [EXTRACTED]
  src/app/notifications.tsx → src/components/ui/Button.tsx
- `Notifications()` --calls--> `useConfirm()`  [EXTRACTED]
  src/app/notifications.tsx → src/components/ui/confirm.tsx

## Import Cycles
- None detected.

## Communities (56 total, 2 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.07
Nodes (33): BookingTab, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, Availability, BookingStatus, BroadcastAudience (+25 more)

### Community 1 - "states.tsx"
Cohesion: 0.12
Nodes (26): expo-image, expo-linear-gradient, styles, Discover(), greeting(), styles, CommunityBanner(), styles (+18 more)

### Community 2 - "layout.tsx"
Cohesion: 0.10
Nodes (56): expo-router, react, react-native, @tanstack/react-query, STARTS, styles, WHO, styles (+48 more)

### Community 3 - "booking.ts"
Cohesion: 0.06
Nodes (93): SelectDateTime(), BookingDetail(), styles, Confirmed(), styles, OfferSummary(), PanicScreen(), Pay() (+85 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (44): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+36 more)

### Community 5 - "session.ts"
Cohesion: 0.16
Nodes (23): @react-native-async-storage/async-storage@2.2.0, @react-native-async-storage/async-storage, loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), Role, setApiToken() (+15 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (60): dependencies, expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/outfit@^0.4.3, @expo-google-fonts/urbanist@^0.4.2, expo-haptics@~58.0.7 (+52 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (29): AuditEntry, BroadcastRecord, CityPlan, PanicAlert, backend, Backend, activity, allDays (+21 more)

### Community 10 - "Text"
Cohesion: 0.11
Nodes (46): Approvals(), styles, Tab, AdminBroadcast(), Broadcast(), styles, AdminLayout(), PanicDetail() (+38 more)

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

### Community 15 - "round2.test.ts"
Cohesion: 0.33
Nodes (4): SessionUser, AuthResult, SessionState, b()

### Community 16 - "demo.ts"
Cohesion: 0.07
Nodes (25): AppNotification, Profile, allDays, bookings, companionStatus(), day(), demo, DemoCompanion (+17 more)

### Community 17 - "companion/[id].tsx"
Cohesion: 0.23
Nodes (19): CompanionProfile(), styles, CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton(), Photo() (+11 more)

### Community 19 - "useSession"
Cohesion: 0.29
Nodes (11): AppEffects(), tab(), TabsLayout(), BellButton(), badgeLabel(), EMPTY, useLiveMe(), useLiveUnread() (+3 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "domain/pricing.ts"
Cohesion: 0.16
Nodes (18): perks(), applyPricing(), BASE_RATE, companionShareOf(), DEFAULT_PACKAGE_PRICES, DEFAULT_PRICING, HEADLINE_HOURS, listeners (+10 more)

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "privacy.tsx"
Cohesion: 0.14
Nodes (19): AreaPicker(), CityPicker(), CitySheet(), PickerField(), SearchSheet(), styles, AREAS, areasFor() (+11 more)

### Community 24 - "IdentityForm.tsx"
Cohesion: 0.27
Nodes (12): identityComplete(), IdentityValue, styles, defaultVisibility(), GENDER_OPTIONS, SEE_OPTIONS, VISIBILITY_COPY, ApprovalStatus (+4 more)

### Community 25 - "errorMessage"
Cohesion: 0.11
Nodes (50): react-native-safe-area-context, Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Admins() (+42 more)

### Community 26 - "PackageGrid.tsx"
Cohesion: 0.19
Nodes (21): a11y(), BigCard(), MAT, matFor(), PackageGrid(), Props, styles, Tab() (+13 more)

### Community 27 - "Icon"
Cohesion: 0.10
Nodes (43): EditForm(), EditProfile(), CompanionOnboarding(), INTERESTS, Line(), Options(), Step, STEPS (+35 more)

### Community 28 - "landing.py"
Cohesion: 0.09
Nodes (43): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+35 more)

### Community 29 - "bar"
Cohesion: 0.12
Nodes (54): avatar(), bar(), card(), checkbox(), chips(), field(), label(), pill() (+46 more)

### Community 30 - "body"
Cohesion: 0.16
Nodes (43): body(), group(), h(), row(), s_admin(), s_admin_booking(), s_bookings(), s_dashboard() (+35 more)

### Community 31 - "pathlib"
Cohesion: 0.13
Nodes (8): pair(), phone(), section(), icon(), mark(), font_card(), icon(), mark()

### Community 32 - "btn"
Cohesion: 0.15
Nodes (39): btn(), foot(), notice(), s_book_time(), s_companion(), s_confirmed(), s_email(), s_otp() (+31 more)

### Community 33 - "interest.ts"
Cohesion: 0.31
Nodes (8): APPROVAL, categoryTitle(), MEET, roleLabel(), SignupChoices, signupDetails(), topCategories(), base

### Community 34 - "role.tsx"
Cohesion: 0.40
Nodes (4): OPTIONS, R, Role(), styles

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 37 - "Text.tsx"
Cohesion: 0.14
Nodes (21): Chat(), styles, time(), ActiveAlert(), HoldButton(), PanicButton(), PULSE, styles (+13 more)

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 41 - "pay/[bookingId].tsx"
Cohesion: 0.26
Nodes (9): baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet(), RazorpaySuccess, styles (+1 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "Text"
Cohesion: 0.11
Nodes (30): AdminOverview(), BLINK, Money(), PanicBanner(), styles, DOT_FADE, DOT_SETTLE, LoginEmail() (+22 more)

### Community 44 - "formatINR"
Cohesion: 0.13
Nodes (22): Row(), Checkout(), newKey(), Step(), CategoryPage(), DARK, ICON, Parallax (+14 more)

### Community 45 - "logo.py"
Cohesion: 0.47
Nodes (3): letters(), monogram(), wordmark()

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
Cohesion: 0.07
Nodes (65): AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap(), AdminUserDetail(), Agreements(), CONSENT_LABEL (+57 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 52 - "app/_layout.tsx"
Cohesion: 0.10
Nodes (24): expo-font@~58.0.10, react-native-gesture-handler@~3.3.0, react-native-reanimated@4.7.1, expo-font, react-native-gesture-handler, react-native-reanimated, Splash(), RootLayout() (+16 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "verification.ts"
Cohesion: 0.33
Nodes (8): VerificationStatus, companionStatusLine(), ID_TYPES, idTypeLabel(), idUploadError(), isLiveCompanion(), needsBack(), needsIdToAccept()

### Community 55 - "push.ts"
Cohesion: 0.22
Nodes (8): expo-constants@~58.0.13, expo-device@~58.0.5, expo-notifications@~58.1.8, expo-constants, expo-device, expo-notifications, openFromPush(), registerForPush()

### Community 56 - "rules.ts"
Cohesion: 0.33
Nodes (8): agreedAt(), Consent, ConsentKind, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

### Community 57 - "chat_keyboard.py"
Cohesion: 0.38
Nodes (3): composer(), header(), svg()

### Community 64 - "config.ts"
Cohesion: 0.28
Nodes (5): DEMO, SITE_URL, SUPABASE_KEY, SUPABASE_URL, supabase

## Knowledge Gaps
- **2 isolated node(s):** `COMMUNITY_IMAGE`, `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 388 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `states.tsx`, `layout.tsx`, `booking.ts`, `role.tsx`, `Text.tsx`, `Text`, `formatINR`, `admin.tsx`, `companion/[id].tsx`, `useSession`, `app/_layout.tsx`, `privacy.tsx`, `IdentityForm.tsx`, `errorMessage`, `PackageGrid.tsx`, `Icon`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `COMMUNITY_IMAGE`, `expo/tsconfig.base` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06923076923076923 - nodes in this community are weakly interconnected._
- **Why does `@supabase/supabase-js` connect `package.json` to `config.ts`, `Text.tsx`, `e2e-supabase.mjs`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `states.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12473118279569892 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `states.tsx`, `booking.ts`, `session.ts`, `package.json`, `Text`, `companion/[id].tsx`, `useSession`, `privacy.tsx`, `IdentityForm.tsx`, `errorMessage`, `PackageGrid.tsx`, `Icon`, `role.tsx`, `Text.tsx`, `pay/[bookingId].tsx`, `Text`, `formatINR`, `admin.tsx`, `app/_layout.tsx`, `push.ts`, `config.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09694749694749695 - nodes in this community are weakly interconnected._