# Graph Report - prsnn-mobile  (2026-11-18)

## Corpus Check
- 193 files · ~316,083 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 1681 nodes · 7720 edges · 57 communities (56 shown, 1 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 248 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `66142b48`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- lib/mode.ts
- package.json
- lib/chat.ts
- expo
- session.ts
- landing.py
- session.ts
- devDependencies
- demoAdmin.ts
- layout.tsx
- compilerOptions
- scripts
- e2e-supabase.mjs
- home.tsx
- rules.ts
- demo.ts
- Text
- LocationFields.tsx
- BookingPicker.tsx
- screens_v2.py
- booking.ts
- journey.py
- Button.tsx
- pathlib
- domain/pricing.ts
- all_screens.py
- btn
- body
- chat_keyboard.py
- btn
- brand_screens.py
- formatINR
- photo
- interest.ts
- pay/[bookingId].tsx
- card_systems.py
- wallet.tsx
- app/_layout.tsx
- logo_concepts.py
- view_as.py
- logo_luxe.py
- Icon
- wordmarks.py
- motion.tsx
- m_book
- chat/[bookingId].tsx
- jest
- verification.ts
- brand_directions.py
- flow.ts
- view-as.tsx
- config.ts
- IdentityForm.tsx
- notifications.tsx
- categories.py

## God Nodes (most connected - your core abstractions)
1. `Text()` - 215 edges
2. `body()` - 138 edges
3. `Icon` - 124 edges
4. `btn()` - 104 edges
5. `Button()` - 104 edges
6. `errorMessage()` - 103 edges
7. `ic()` - 102 edges
8. `react-native` - 101 edges
9. `colors` - 94 edges
10. `Header()` - 89 edges

## Surprising Connections (you probably didn't know these)
- `day()` --calls--> `toDateKey()`  [EXTRACTED]
  src/services/demo.ts → src/domain/booking.ts
- `normaliseCompanion()` --calls--> `areaName()`  [EXTRACTED]
  src/services/backend.ts → src/domain/places.ts
- `toProfile()` --calls--> `areaName()`  [EXTRACTED]
  src/services/backend.ts → src/domain/places.ts
- `Chat()` --calls--> `typing`  [EXTRACTED]
  src/app/chat/[bookingId].tsx → src/components/ui/motion.tsx
- `HomeTab()` --calls--> `useMode()`  [EXTRACTED]
  src/app/(tabs)/home.tsx → src/lib/mode.ts

## Import Cycles
- None detected.

## Communities (57 total, 1 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.06
Nodes (40): BusyTime, AdminChatMessage, AdminOverview, AdminPerson, AllocationState, AppNotification, Availability, BookingStatus (+32 more)

### Community 1 - "lib/mode.ts"
Cohesion: 0.26
Nodes (16): SignedOut(), tab(), TabsLayout(), MessagesTab(), styles, LABEL, ModeSwitch(), styles (+8 more)

### Community 2 - "package.json"
Cohesion: 0.05
Nodes (52): dependencies, expo@~58.0.20, expo-crypto@~58.0.7, @expo-google-fonts/dm-sans@^0.4.2, @expo-google-fonts/lora@^0.4.2, @expo-google-fonts/outfit@^0.4.3, @expo-google-fonts/urbanist@^0.4.2, expo-haptics@~58.0.7 (+44 more)

### Community 3 - "lib/chat.ts"
Cohesion: 0.19
Nodes (10): mergeMessages(), ChatMessage, demoThread(), MAX_MESSAGE_LENGTH, messageId(), Row, Status, toMessage() (+2 more)

### Community 4 - "expo"
Cohesion: 0.04
Nodes (47): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, allowBackup, blockedPermissions, package, permissions (+39 more)

### Community 5 - "session.ts"
Cohesion: 0.21
Nodes (18): loginIdOfAuthUser(), loginKey(), sameLogin(), sessionIsGone(), checkLocalPin(), clearLocalPin(), forgetSavedSession(), hash() (+10 more)

### Community 6 - "landing.py"
Cohesion: 0.09
Nodes (43): btn(), cat_card(), companion_band(), faq(), final_cta(), footer(), ic(), landing_a() (+35 more)

### Community 7 - "session.ts"
Cohesion: 0.19
Nodes (7): Phase, styles, styles, styles, setApiToken(), UploadFile, CompanionForm

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): { defineConfig }, expoConfig, devDependencies, eslint@^9.0.0, eslint-config-expo@~58.0.4, jest@^30.5.2, jest-expo@~58.0.12, @testing-library/react-native@^14.1.0 (+11 more)

### Community 9 - "demoAdmin.ts"
Cohesion: 0.07
Nodes (32): priceCurveError(), AdminBooking, AuditEntry, BroadcastRecord, CityPlan, PanicAlert, Role, Backend (+24 more)

### Community 10 - "layout.tsx"
Cohesion: 0.09
Nodes (68): expo-haptics, expo-router, react, react-native, react-native-reanimated, react-native-safe-area-context, @tanstack/react-query, styles (+60 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, noEmit, paths, strict, types, exclude (+2 more)

### Community 12 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, export:web, graph, ios, lint, start, test (+2 more)

### Community 13 - "e2e-supabase.mjs"
Cohesion: 0.08
Nodes (15): fs, book(), cand, card, [compId, memId], got, img, offer (+7 more)

### Community 14 - "home.tsx"
Cohesion: 0.09
Nodes (42): expo-linear-gradient, CategoryPage(), styles, Discover(), greeting(), HomeTab(), styles, BecomeCompanionCard() (+34 more)

### Community 15 - "rules.ts"
Cohesion: 0.33
Nodes (8): agreedAt(), Consent, ConsentKind, HOUSE_RULES, LEGAL_VERSION, missingConsents(), NOT_FOR, signInConsents()

### Community 16 - "demo.ts"
Cohesion: 0.07
Nodes (26): SessionUser, AuthResult, allDays, bookings, companionStatus(), day(), demo, DemoCompanion (+18 more)

### Community 17 - "Text"
Cohesion: 0.05
Nodes (165): Activity(), AdminActivity(), priceDiff(), short(), styles, AdminAdmins(), Admins(), styles (+157 more)

### Community 18 - "LocationFields.tsx"
Cohesion: 0.14
Nodes (24): AreaSheet(), CitySheet(), Dropdown(), fold(), LocationFields(), NoMatch(), Row(), Sheet() (+16 more)

### Community 19 - "BookingPicker.tsx"
Cohesion: 0.11
Nodes (30): initial(), BookingChoice, BookingPicker(), styles, WEEK, AvailabilityEditor(), AvailabilityValue, emptyAvailability() (+22 more)

### Community 20 - "screens_v2.py"
Cohesion: 0.05
Nodes (46): keypad(), s_pin_login(), a_overview_sub(), banner(), booked(), booking_detail(), c_status_changes(), c_status_live() (+38 more)

### Community 21 - "booking.ts"
Cohesion: 0.10
Nodes (47): RELATIONS, styles, styles, styles, BookingsTab(), styles, TABS, BookingCard() (+39 more)

### Community 22 - "journey.py"
Cohesion: 0.09
Nodes (26): b64(), bar(), chat_screen(), dots(), keypad(), opts(), page(), pkrow() (+18 more)

### Community 23 - "Button.tsx"
Cohesion: 0.08
Nodes (25): Data, DATA, STARTS, styles, WHO, METHODS, styles, EARN_HOURS (+17 more)

### Community 24 - "pathlib"
Cohesion: 0.19
Nodes (5): letters(), monogram(), wordmark(), icon(), mark()

### Community 26 - "domain/pricing.ts"
Cohesion: 0.15
Nodes (27): perks(), styles, a11y(), PackageGrid(), Props, styles, tagFor(), applyPricing() (+19 more)

### Community 27 - "all_screens.py"
Cohesion: 0.13
Nodes (37): checkbox(), chips(), field(), label(), notice(), s_admins(), s_broadcast(), s_chat() (+29 more)

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

### Community 35 - "brand_screens.py"
Cohesion: 0.15
Nodes (19): confirmed(), mark(), profile(), row(), welcome(), btn(), chat(), checkout() (+11 more)

### Community 38 - "formatINR"
Cohesion: 0.16
Nodes (29): expo-image, CompanionProfile(), styles, CompanionCard(), CompanionRow(), firstName(), fromPrice(), HeartButton() (+21 more)

### Community 39 - "photo"
Cohesion: 0.23
Nodes (12): photo(), s_apply(), s_category(), s_companion(), s_home_more(), s_login(), shade(), bc() (+4 more)

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

### Community 45 - "app/_layout.tsx"
Cohesion: 0.12
Nodes (19): expo-font@~58.0.10, expo-splash-screen@~58.0.11, expo-status-bar@~58.0.4, react-native-gesture-handler@~3.3.0, expo-font, expo-splash-screen, expo-status-bar, react-native-gesture-handler (+11 more)

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
Cohesion: 0.11
Nodes (38): Row(), CompanionOnboarding(), INTERESTS, Line(), Options(), Step, STEPS, styles (+30 more)

### Community 50 - "wordmarks.py"
Cohesion: 0.27
Nodes (4): bodoni_italic(), gem(), light_lower(), urbanist_lower()

### Community 52 - "motion.tsx"
Cohesion: 0.09
Nodes (24): DOT_FADE, DOT_SETTLE, styles, BRAND_WORD, dotColorFor(), isLight(), Wordmark(), bob (+16 more)

### Community 53 - "m_book"
Cohesion: 0.38
Nodes (7): price_card(), price_tab(), s_availability(), s_book_length(), stack(), c_availability(), m_book()

### Community 54 - "chat/[bookingId].tsx"
Cohesion: 0.11
Nodes (26): Chat(), isDivider(), Row, styles, time(), PULSE, styles, RiseIn() (+18 more)

### Community 57 - "jest"
Cohesion: 0.40
Nodes (5): jest, moduleNameMapper, preset, testMatch, transformIgnorePatterns

### Community 58 - "verification.ts"
Cohesion: 0.33
Nodes (8): VerificationStatus, companionStatusLine(), ID_TYPES, idCheckValue(), idUploadError(), isLiveCompanion(), needsBack(), needsIdToAccept()

### Community 59 - "brand_directions.py"
Cohesion: 0.19
Nodes (6): pair(), phone(), section(), font_card(), icon(), mark()

### Community 60 - "flow.ts"
Cohesion: 0.11
Nodes (28): PHOTOS, Splash(), styles, Logo(), marketRole(), AppMode, canUseCompanionMode(), effectiveMode() (+20 more)

### Community 64 - "view-as.tsx"
Cohesion: 0.20
Nodes (15): styles, endPreview(), go(), PreviewAs, PreviewStart, routeFor(), sampleUser(), startLivePreview() (+7 more)

### Community 65 - "config.ts"
Cohesion: 0.15
Nodes (11): @react-native-async-storage/async-storage@2.2.0, react-native-url-polyfill@^4.0.0, @supabase/supabase-js@^2.119.0, @react-native-async-storage/async-storage, react-native-url-polyfill, @supabase/supabase-js, DEMO, SITE_URL (+3 more)

### Community 66 - "IdentityForm.tsx"
Cohesion: 0.29
Nodes (11): identityComplete(), IdentityValue, styles, GENDER_OPTIONS, SEE_OPTIONS, VISIBILITY_COPY, ApprovalStatus, Gender (+3 more)

### Community 68 - "notifications.tsx"
Cohesion: 0.21
Nodes (11): expo-constants@~58.0.13, expo-device@~58.0.5, expo-notifications@~58.1.8, expo-constants, expo-device, expo-notifications, open(), modeForNotification() (+3 more)

### Community 69 - "categories.py"
Cohesion: 0.31
Nodes (5): city_pill(), day_trips(), plan_rows(), pk(), profile()

## Knowledge Gaps
- **2 isolated node(s):** `COMMUNITY_IMAGE`, `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 420 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `Text` to `view-as.tsx`, `lib/mode.ts`, `IdentityForm.tsx`, `formatINR`, `session.ts`, `layout.tsx`, `home.tsx`, `Icon`, `LocationFields.tsx`, `BookingPicker.tsx`, `motion.tsx`, `booking.ts`, `chat/[bookingId].tsx`, `Button.tsx`, `domain/pricing.ts`, `flow.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `COMMUNITY_IMAGE`, `expo/tsconfig.base` to the rest of the system?**
  _2 weakly-connected nodes found - possible missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06363636363636363 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `layout.tsx` to `lib/mode.ts`, `package.json`, `session.ts`, `session.ts`, `home.tsx`, `Text`, `LocationFields.tsx`, `BookingPicker.tsx`, `booking.ts`, `Button.tsx`, `domain/pricing.ts`, `formatINR`, `pay/[bookingId].tsx`, `wallet.tsx`, `app/_layout.tsx`, `Icon`, `motion.tsx`, `chat/[bookingId].tsx`, `flow.ts`, `view-as.tsx`, `config.ts`, `IdentityForm.tsx`, `notifications.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05152394775036284 - nodes in this community are weakly interconnected._
- **Why does `react` connect `layout.tsx` to `lib/mode.ts`, `package.json`, `lib/chat.ts`, `session.ts`, `home.tsx`, `Text`, `LocationFields.tsx`, `BookingPicker.tsx`, `booking.ts`, `Button.tsx`, `domain/pricing.ts`, `formatINR`, `pay/[bookingId].tsx`, `wallet.tsx`, `app/_layout.tsx`, `Icon`, `motion.tsx`, `chat/[bookingId].tsx`, `flow.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Should `expo` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._