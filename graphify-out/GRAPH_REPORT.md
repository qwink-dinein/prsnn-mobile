# Graph Report - prsnn-mobile  (2026-11-16)

## Corpus Check
- 181 files · ~306,979 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1602 nodes · 7271 edges · 58 communities
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 244 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `69d0b53f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- layout.tsx
- push.ts
- Button.tsx
- expo
- session.ts
- Text.tsx
- package.json
- devDependencies
- demoAdmin.ts
- tokens.ts
- compilerOptions
- scripts
- e2e-supabase.mjs
- admin.tsx
- rules.ts
- demo.ts
- space
- formatINR
- booking.ts
- screens_v2.py
- Card
- journey.py
- setup-profile.tsx
- verification.ts
- @react-native-async-storage/async-storage
- formatINR
- review.tsx
- landing.py
- bar
- body
- chat_keyboard.py
- btn
- types.ts
- useSession
- brand_screens.py
- errorMessage
- lib/chat.ts
- pathlib
- ic
- interest.ts
- pay/[bookingId].tsx
- card_systems.py
- wallet.tsx
- react-native
- logo.py
- logo_concepts.py
- view_as.py
- logo_luxe.py
- Text
- wordmarks.py
- categories.py
- states.tsx
- m_book
- preview.tsx
- expo-router
- useSession
- jest

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
- `SignedOut()` --calls--> `goToLogin()`  [EXTRACTED]
  src/app/(tabs)/_layout.tsx → src/lib/flow.ts
- `tab()` --calls--> `Icon`  [EXTRACTED]
  src/app/(tabs)/_layout.tsx → src/components/ui/Icon.tsx
- `TabsLayout()` --calls--> `useSession`  [EXTRACTED]
  src/app/(tabs)/_layout.tsx → src/state/session.ts

## Import Cycles
- None detected.

## Communities (58 total, 0 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.08
Nodes (28): BookingTab, BusyTime, AdminChatMessage, AdminOverview, ApprovalStatus, BroadcastAudience, IdType, Locality (+20 more)

### Community 1 - "layout.tsx"
Cohesion: 0.13
Nodes (18): SignedOut(), tab(), TabsLayout(), styles, styles, BRAND_WORD, dotColorFor(), isLight() (+10 more)

### Community 2 - "push.ts"
Cohesion: 0.20
Nodes (9): expo-constants@~58.0.13, expo-device@~58.0.5, expo-notifications@~58.1.8, expo-constants, expo-device, expo-notifications, openFromPush(), registerForPush() (+1 more)

### Community 3 - "Button.tsx"
Cohesion: 0.09
Nodes (25): expo-haptics, styles, styles, WEAK, BG, FG, Props, styles (+17 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (47): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+39 more)

### Community 5 - "session.ts"
Cohesion: 0.24
Nodes (17): loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), checkLocalPin(), clearLocalPin(), forgetSavedSession(), hash() (+9 more)

### Community 6 - "Text.tsx"
Cohesion: 0.12
Nodes (16): ID_COPY, styles, styles, Ask, ConfirmOptions, Ctx, styles, FieldProps (+8 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (40): dependencies, expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/dm-sans@^0.4.2, expo-haptics@~58.0.7, expo-image@~58.0.17, expo-image-picker@~58.0.10, expo-linear-gradient@~58.0.3 (+32 more)

### Community 8 - "devDependencies"
Cohesion: 0.08
Nodes (29): { defineConfig }, expoConfig, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/outfit@^0.4.3, @expo-google-fonts/urbanist@^0.4.2, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4 (+21 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.07
Nodes (31): AuditEntry, BroadcastRecord, CityPlan, PanicAlert, Role, backend, Backend, activity (+23 more)

### Community 10 - "tokens.ts"
Cohesion: 0.08
Nodes (30): expo-linear-gradient, react-native-reanimated, styles, PHOTOS, styles, OPTIONS, R, styles (+22 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, noEmit, paths, strict, types, exclude (+2 more)

### Community 12 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, export:web, graph, ios, lint, start, test (+2 more)

### Community 13 - "e2e-supabase.mjs"
Cohesion: 0.09
Nodes (14): fs, book(), cand, card, [compId, memId], got, img, offer (+6 more)

### Community 14 - "admin.tsx"
Cohesion: 0.14
Nodes (32): Activity(), AdminActivity(), priceDiff(), short(), styles, AdminBookingDetail(), PersonLink(), Sheet (+24 more)

### Community 15 - "rules.ts"
Cohesion: 0.33
Nodes (8): agreedAt(), Consent, ConsentKind, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

### Community 16 - "demo.ts"
Cohesion: 0.07
Nodes (28): AppNotification, Policy, SessionUser, AuthResult, allDays, bookings, companionStatus(), day() (+20 more)

### Community 17 - "space"
Cohesion: 0.11
Nodes (35): react, react-native-safe-area-context, @tanstack/react-query, styles, EMPTY, styles, styles, styles (+27 more)

### Community 18 - "formatINR"
Cohesion: 0.18
Nodes (22): CompanionProfile(), BookingPicker(), styles, WEEK, CompanionCard(), CompanionRow(), firstName(), fromPrice() (+14 more)

### Community 19 - "booking.ts"
Cohesion: 0.13
Nodes (26): BookingsTab(), styles, TABS, awaitingAnswer(), BookingTab, canPay(), CATEGORIES, CategoryKey (+18 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "Card"
Cohesion: 0.24
Nodes (14): Plans(), Row(), AdminPrices(), Draft, draftOf(), Pair(), Prices(), styles (+6 more)

### Community 22 - "journey.py"
Cohesion: 0.08
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "setup-profile.tsx"
Cohesion: 0.07
Nodes (53): COUNTRIES, MEET, Step, styles, identityComplete(), IdentityValue, styles, AreaSheet() (+45 more)

### Community 24 - "verification.ts"
Cohesion: 0.36
Nodes (6): VerificationStatus, ID_TYPES, idCheckValue(), idTypeLabel(), idUploadError(), needsBack()

### Community 25 - "@react-native-async-storage/async-storage"
Cohesion: 0.33
Nodes (5): expo-secure-store@~58.0.2, @react-native-async-storage/async-storage@2.2.0, expo-secure-store, @react-native-async-storage/async-storage, secure

### Community 26 - "formatINR"
Cohesion: 0.15
Nodes (26): perks(), a11y(), PackageGrid(), Props, styles, tagFor(), refundIfCancelledNow(), applyPricing() (+18 more)

### Community 27 - "review.tsx"
Cohesion: 0.14
Nodes (21): Checkout(), newKey(), RELATIONS, Step(), styles, AvailabilityEditor(), HOURS, styles (+13 more)

### Community 28 - "landing.py"
Cohesion: 0.09
Nodes (43): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+35 more)

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

### Community 33 - "types.ts"
Cohesion: 0.09
Nodes (24): categoryOf(), categoryTitle(), COMMUNITY_FOCUS, offersCategory(), durationLine(), savingPercent(), PANIC_AFTER_END_MS, panicWindow() (+16 more)

### Community 34 - "useSession"
Cohesion: 0.15
Nodes (37): BookingDetail(), styles, Chat(), time(), Confirmed(), OfferSummary(), MessagesTab(), BookingCard() (+29 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 36 - "errorMessage"
Cohesion: 0.12
Nodes (51): AdminAdmins(), Admins(), Approvals(), styles, Tab, CompanionPicker(), AdminBookings(), AdminBroadcast() (+43 more)

### Community 37 - "lib/chat.ts"
Cohesion: 0.13
Nodes (16): react-native-url-polyfill@^4.0.0, @supabase/supabase-js@^2.119.0, react-native-url-polyfill, @supabase/supabase-js, mergeMessages(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH (+8 more)

### Community 38 - "pathlib"
Cohesion: 0.13
Nodes (8): pair(), phone(), section(), icon(), mark(), font_card(), icon(), mark()

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 40 - "interest.ts"
Cohesion: 0.33
Nodes (7): APPROVAL, categoryTitle(), MEET, SignupChoices, signupDetails(), topCategories(), base

### Community 41 - "pay/[bookingId].tsx"
Cohesion: 0.25
Nodes (8): baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySuccess, styles, externalTarget()

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "wallet.tsx"
Cohesion: 0.29
Nodes (7): react-native-svg@15.16.0, react-native-svg, Guilloche, Material, MaterialCard(), MATERIALS, styles

### Community 44 - "react-native"
Cohesion: 0.12
Nodes (18): expo-image, react-native, styles, styles, INTERESTS, Step, STEPS, styles (+10 more)

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

### Community 49 - "Text"
Cohesion: 0.11
Nodes (53): ReviewCompanion(), Doc(), EditForm(), EditProfile(), Apply(), Availability(), AvailabilityForm(), initial() (+45 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

### Community 52 - "states.tsx"
Cohesion: 0.12
Nodes (22): expo-font@~58.0.10, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-splash-screen, expo-status-bar, react-native-gesture-handler (+14 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "preview.tsx"
Cohesion: 0.15
Nodes (20): Data, DATA, STARTS, styles, WHO, REASONS, styles, AdminUser (+12 more)

### Community 55 - "expo-router"
Cohesion: 0.12
Nodes (18): expo-router, styles, styles, DOT_FADE, DOT_SETTLE, styles, EASE_OUT_CSS, LIVE_INTERVAL (+10 more)

### Community 56 - "useSession"
Cohesion: 0.12
Nodes (38): AdminOverview(), BLINK, Money(), PanicBanner(), styles, CategoryPage(), Splash(), Discover() (+30 more)

### Community 57 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

## Knowledge Gaps
- **2 isolated node(s):** `COMMUNITY_IMAGE`, `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 396 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `layout.tsx`, `push.ts`, `Button.tsx`, `Text.tsx`, `package.json`, `devDependencies`, `tokens.ts`, `admin.tsx`, `space`, `formatINR`, `booking.ts`, `Card`, `setup-profile.tsx`, `@react-native-async-storage/async-storage`, `formatINR`, `review.tsx`, `useSession`, `errorMessage`, `lib/chat.ts`, `pay/[bookingId].tsx`, `wallet.tsx`, `states.tsx`, `preview.tsx`, `expo-router`, `useSession`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `COMMUNITY_IMAGE`, `expo/tsconfig.base` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07661290322580645 - nodes in this community are weakly interconnected._
- **Why does `Text()` connect `Text` to `layout.tsx`, `Button.tsx`, `Text.tsx`, `tokens.ts`, `admin.tsx`, `space`, `formatINR`, `booking.ts`, `Card`, `setup-profile.tsx`, `formatINR`, `review.tsx`, `useSession`, `errorMessage`, `react-native`, `states.tsx`, `preview.tsx`, `expo-router`, `useSession`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Why does `react` connect `space` to `layout.tsx`, `Button.tsx`, `Text.tsx`, `package.json`, `devDependencies`, `tokens.ts`, `admin.tsx`, `formatINR`, `booking.ts`, `Card`, `setup-profile.tsx`, `formatINR`, `review.tsx`, `useSession`, `errorMessage`, `lib/chat.ts`, `pay/[bookingId].tsx`, `wallet.tsx`, `react-native`, `states.tsx`, `preview.tsx`, `expo-router`, `useSession`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `Button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08620689655172414 - nodes in this community are weakly interconnected._