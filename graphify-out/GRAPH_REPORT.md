# Graph Report - prsnn-mobile  (2026-11-16)

## Corpus Check
- 181 files · ~306,879 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1601 nodes · 7265 edges · 61 communities
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 244 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4595b604`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- layout.tsx
- push.ts
- motion.tsx
- expo
- session.ts
- Text.tsx
- package.json
- devDependencies
- demoAdmin.ts
- space
- compilerOptions
- scripts
- e2e-supabase.mjs
- admin.tsx
- rules.ts
- demo.ts
- react-native
- formatINR
- booking.ts
- screens_v2.py
- formatINR
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
- verify.tsx
- flow.ts
- logo_concepts.py
- view_as.py
- logo_luxe.py
- Text
- wordmarks.py
- categories.py
- states.tsx
- m_book
- preview.tsx
- Button.tsx
- profile.tsx
- IdentityForm.tsx
- AreaSheet
- confirm.tsx
- areaName

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
- `CompanionOnboarding()` --indirect_call--> `categoryTitle()`  [INFERRED]
  src/app/fellow/onboarding.tsx → src/domain/categories.ts
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `Discover()` --calls--> `CommunityBanner()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/CommunityBanner.tsx
- `Discover()` --calls--> `CompanionCard()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/companions.tsx
- `Discover()` --calls--> `HomeCategories()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/components/HomeCategories.tsx

## Import Cycles
- None detected.

## Communities (61 total, 0 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.06
Nodes (40): BookingTab, BusyTime, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, Availability (+32 more)

### Community 1 - "layout.tsx"
Cohesion: 0.16
Nodes (15): PHOTOS, styles, OPTIONS, R, styles, BRAND_WORD, dotColorFor(), isLight() (+7 more)

### Community 2 - "push.ts"
Cohesion: 0.22
Nodes (8): expo-constants@~58.0.13, expo-device@~58.0.5, expo-notifications@~58.1.8, expo-constants, expo-device, expo-notifications, openFromPush(), registerForPush()

### Community 3 - "motion.tsx"
Cohesion: 0.09
Nodes (25): react-native-reanimated, DOT_FADE, DOT_SETTLE, styles, PULSE, styles, styles, WEAK (+17 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (47): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+39 more)

### Community 5 - "session.ts"
Cohesion: 0.25
Nodes (16): loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), checkLocalPin(), clearLocalPin(), forgetSavedSession(), hash() (+8 more)

### Community 6 - "Text.tsx"
Cohesion: 0.17
Nodes (14): styles, tab(), TabsLayout(), styles, RiseIn(), TypingDots(), Props, PANIC_AFTER_END_MS (+6 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (55): dependencies, expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/outfit@^0.4.3, @expo-google-fonts/urbanist@^0.4.2, expo-haptics@~58.0.7 (+47 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.08
Nodes (30): AuditEntry, BroadcastRecord, CityPlan, PanicAlert, Role, Backend, activity, allDays (+22 more)

### Community 10 - "space"
Cohesion: 0.09
Nodes (34): expo-linear-gradient, expo-router, react-native-safe-area-context, styles, Tab, styles, EMPTY, styles (+26 more)

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
Nodes (32): AdminBookingDetail(), PersonLink(), Sheet, styles, Wrap(), AdminUserDetail(), Agreements(), CONSENT_LABEL (+24 more)

### Community 15 - "rules.ts"
Cohesion: 0.33
Nodes (8): agreedAt(), Consent, ConsentKind, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

### Community 16 - "demo.ts"
Cohesion: 0.08
Nodes (24): Policy, allDays, bookings, companionStatus(), day(), demo, DemoCompanion, demoConsents (+16 more)

### Community 17 - "react-native"
Cohesion: 0.10
Nodes (42): expo-haptics, react, react-native, @tanstack/react-query, EMPTY, styles, styles, styles (+34 more)

### Community 18 - "formatINR"
Cohesion: 0.20
Nodes (19): CompanionProfile(), styles, CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton(), Photo() (+11 more)

### Community 19 - "booking.ts"
Cohesion: 0.13
Nodes (24): amountDuePaise(), awaitingAnswer(), BookingTab, canChat(), canComplete(), canPay(), CategoryKey, DAY_KEYS (+16 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (55): keypad(), s_pin_login(), s_pin_set(), a_approvals_photos(), a_overview_sub(), a_panic(), a_reject(), booked() (+47 more)

### Community 21 - "formatINR"
Cohesion: 0.18
Nodes (18): Row(), SelectDateTime(), perks(), CompanionOnboarding(), Line(), BookingChoice, BookingPicker(), styles (+10 more)

### Community 22 - "journey.py"
Cohesion: 0.09
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "onboarding.tsx"
Cohesion: 0.09
Nodes (32): expo-image, styles, INTERESTS, Step, STEPS, styles, styles, COUNTRIES (+24 more)

### Community 24 - "verification.ts"
Cohesion: 0.39
Nodes (7): VerificationStatus, companionStatusLine(), ID_TYPES, idUploadError(), isLiveCompanion(), needsBack(), needsIdToAccept()

### Community 25 - "@react-native-async-storage/async-storage"
Cohesion: 0.33
Nodes (5): expo-secure-store@~58.0.2, @react-native-async-storage/async-storage@2.2.0, expo-secure-store, @react-native-async-storage/async-storage, secure

### Community 26 - "formatINR"
Cohesion: 0.16
Nodes (23): a11y(), PackageGrid(), Props, styles, tagFor(), applyPricing(), BASE_RATE, companionShareOf() (+15 more)

### Community 27 - "availability.tsx"
Cohesion: 0.24
Nodes (12): initial(), AvailabilityEditor(), emptyAvailability(), HOURS, styles, WEEK_DAYS, endTimeOf(), formatTime() (+4 more)

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
Cohesion: 0.15
Nodes (14): CategoryPage(), AREAS, areasFor(), MIN_LEAD_MINUTES, categoryOf(), offersCategory(), durationLine(), savingPercent() (+6 more)

### Community 34 - "useSession"
Cohesion: 0.15
Nodes (40): BookingDetail(), styles, Chat(), time(), Confirmed(), OfferSummary(), VerifyId(), PanicScreen() (+32 more)

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 36 - "errorMessage"
Cohesion: 0.18
Nodes (34): Activity(), AdminActivity(), priceDiff(), short(), styles, Approvals(), CompanionPicker(), AdminBookings() (+26 more)

### Community 37 - "lib/chat.ts"
Cohesion: 0.14
Nodes (15): react-native-url-polyfill@^4.0.0, @supabase/supabase-js@^2.119.0, react-native-url-polyfill, @supabase/supabase-js, mergeMessages(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH (+7 more)

### Community 38 - "pathlib"
Cohesion: 0.14
Nodes (8): letters(), monogram(), wordmark(), icon(), mark(), font_card(), icon(), mark()

### Community 39 - "ic"
Cohesion: 0.11
Nodes (26): ic(), photo(), s_activity(), s_apply(), s_booking(), s_category(), s_home_more(), s_login() (+18 more)

### Community 40 - "interest.ts"
Cohesion: 0.31
Nodes (8): APPROVAL, categoryTitle(), MEET, roleLabel(), SignupChoices, signupDetails(), topCategories(), base

### Community 41 - "pay/[bookingId].tsx"
Cohesion: 0.26
Nodes (9): baseOptions(), checkoutHtml(), CheckoutOptions, openWebCheckout(), Props, RazorpaySheet(), RazorpaySuccess, styles (+1 more)

### Community 42 - "card_systems.py"
Cohesion: 0.22
Nodes (18): e_booking(), e_home(), e_prices(), g_booking(), g_home(), g_prices(), ic(), logo() (+10 more)

### Community 43 - "wallet.tsx"
Cohesion: 0.29
Nodes (7): react-native-svg@15.16.0, react-native-svg, Guilloche, Material, MaterialCard(), MATERIALS, styles

### Community 44 - "verify.tsx"
Cohesion: 0.17
Nodes (24): AdminAdmins(), Admins(), styles, AdminBroadcast(), AdminLayout(), PanicDetail(), styles, tel() (+16 more)

### Community 45 - "flow.ts"
Cohesion: 0.23
Nodes (13): Splash(), hasIdentity(), firstUnanswered(), needsSetup(), SessionUser, afterAuth(), afterPin(), goHome() (+5 more)

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
Cohesion: 0.09
Nodes (66): Plans(), AdminPrices(), Draft, draftOf(), Pair(), Prices(), styles, Checkout() (+58 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.14
Nodes (7): pair(), phone(), section(), bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 51 - "categories.py"
Cohesion: 0.19
Nodes (7): city_pill(), day_trips(), plan_rows(), pk(), profile(), row(), screen()

### Community 52 - "states.tsx"
Cohesion: 0.11
Nodes (25): expo-font@~58.0.10, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-splash-screen, expo-status-bar, react-native-gesture-handler (+17 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "preview.tsx"
Cohesion: 0.25
Nodes (14): endPreview(), go(), PreviewAs, PreviewStart, PreviewStrip(), routeFor(), sampleUser(), startLivePreview() (+6 more)

### Community 55 - "Button.tsx"
Cohesion: 0.08
Nodes (29): Data, DATA, STARTS, styles, WHO, styles, ID_COPY, styles (+21 more)

### Community 56 - "profile.tsx"
Cohesion: 0.22
Nodes (13): AdminOverview(), BLINK, Money(), PanicBanner(), styles, ProfileTab(), styles, StatTile() (+5 more)

### Community 57 - "IdentityForm.tsx"
Cohesion: 0.27
Nodes (12): identityComplete(), IdentityValue, styles, defaultVisibility(), GENDER_OPTIONS, SEE_OPTIONS, VISIBILITY_COPY, ApprovalStatus (+4 more)

### Community 58 - "AreaSheet"
Cohesion: 0.44
Nodes (9): AreaSheet(), CitySheet(), fold(), LocationFields(), NoMatch(), Row(), Sheet(), StateSheet() (+1 more)

### Community 59 - "confirm.tsx"
Cohesion: 0.40
Nodes (4): Ask, ConfirmOptions, Ctx, styles

### Community 60 - "areaName"
Cohesion: 0.50
Nodes (4): areaName(), uniqueAreas(), normaliseCompanion(), toProfile()

## Knowledge Gaps
- **2 isolated node(s):** `COMMUNITY_IMAGE`, `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 396 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `layout.tsx`, `motion.tsx`, `Text.tsx`, `space`, `admin.tsx`, `react-native`, `formatINR`, `formatINR`, `onboarding.tsx`, `formatINR`, `availability.tsx`, `prepaid-privacy.test.ts`, `useSession`, `errorMessage`, `verify.tsx`, `flow.ts`, `states.tsx`, `preview.tsx`, `Button.tsx`, `profile.tsx`, `IdentityForm.tsx`, `AreaSheet`, `confirm.tsx`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `COMMUNITY_IMAGE`, `expo/tsconfig.base` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06363636363636363 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `layout.tsx`, `push.ts`, `motion.tsx`, `Text.tsx`, `package.json`, `space`, `admin.tsx`, `formatINR`, `formatINR`, `onboarding.tsx`, `@react-native-async-storage/async-storage`, `formatINR`, `availability.tsx`, `useSession`, `errorMessage`, `lib/chat.ts`, `pay/[bookingId].tsx`, `wallet.tsx`, `verify.tsx`, `Text`, `states.tsx`, `preview.tsx`, `Button.tsx`, `profile.tsx`, `IdentityForm.tsx`, `confirm.tsx`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `motion.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0907563025210084 - nodes in this community are weakly interconnected._
- **Why does `useSession` connect `useSession` to `types.ts`, `layout.tsx`, `motion.tsx`, `Text.tsx`, `demoAdmin.ts`, `space`, `admin.tsx`, `demo.ts`, `react-native`, `formatINR`, `formatINR`, `onboarding.tsx`, `prepaid-privacy.test.ts`, `errorMessage`, `verify.tsx`, `flow.ts`, `Text`, `states.tsx`, `preview.tsx`, `Button.tsx`, `profile.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `expo` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._