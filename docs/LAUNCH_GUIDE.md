# prsnn · Launch guide: push notifications, store accounts, review logins, submission

Order matters: Part A (push) → Part B (review logins) → Part C (Google Play) → Part D (Apple App Store).
Keys and passwords go only into the dashboards named here, never into the repo or a chat.

---

## Part A · Push notifications

### A1. Link the app to Expo (once)
```bash
cd ~/prsnn-mobile && git checkout claude/adoring-euler-w8jj3h && git pull && npm install
npx eas-cli@latest login
npx eas-cli@latest init
```
`eas init` adds `extra.eas.projectId` to `app.json`. Commit and push that change (or send the project ID to
Claude to commit). Without it the app never asks for a push token.

### A2. Android: Firebase (free)
1. https://console.firebase.google.com → **Add project** → name `prsnn` → Analytics off is fine → Create.
2. Project overview → **Add app → Android**. Package name **`com.prsnn.app`** (exactly) → Register.
3. **Download `google-services.json`**. Don't commit it.
4. Give it to the build, one of:
   - Local builds: put it in the `prsnn-mobile` folder (it's in `.gitignore`).
   - EAS builds: expo.dev → your project → **Environment variables** → **Add** → name `GOOGLE_SERVICES_JSON`,
     type **File**, upload the file, environments: preview + production.
5. Firebase → ⚙ **Project settings → Service accounts → Generate new private key** → downloads a JSON key.
6. Upload that key to Expo:
   ```bash
   npx eas-cli@latest credentials -p android
   ```
   → choose the **production** (and preview) build profile → **Google Service Account** →
   **Manage your Google Service Account Key for Push Notifications (FCM V1)** → **Upload** → pick the JSON.
   Delete the JSON from Downloads afterwards.

### A3. iPhone: Apple push key
Needs the Apple Developer account (Part D1). Then:
```bash
npx eas-cli@latest credentials -p ios
```
→ production → **Push Notifications: Manage your Apple Push Notifications Key** → **Set up a new key**
(EAS creates it in your Apple account). Or answer **Yes** when `eas build -p ios` asks to set up push.

### A4. Check
Install a new build, sign in, allow notifications. Then in the app: Admin → Broadcast → send a test to staff.
It should arrive within a minute. (Expo Go can't receive pushes; it must be a real build.)

---

## Part B · Review logins (store reviewers can't receive your WhatsApp codes)

1. Supabase → **Authentication → Sign In / Providers → Phone** → **Test phone numbers and OTPs**. Add two
   made-up numbers with fixed codes, for example `919000000101=246810` and `919000000102=135790`
   (no WhatsApp message is sent to these).
2. In the app, sign in with the first number → finish setup as a **member** → set a PIN.
3. Sign out, sign in with the second → **Become a companion** → finish the application → in Admin → Approvals,
   approve it; Admin → Verify, approve its ID (upload any sample ID image).
4. Write both into the store consoles only (Play: App access; Apple: App Review Information), e.g.
   "Member: +91 90000 00101, code 246810, PIN 1234. Companion: +91 90000 00102, code 135790, PIN 1234."

---

## Part C · Google Play

### C1. Developer account
https://play.google.com/console → sign up → **$25 once**.
- **Personal account:** identity check (1–3 days). New personal accounts must run a **closed test with at
  least 12 testers for 14 days** before Google allows production. Start this early.
- **Organisation account:** needs a **D-U-N-S number** (free, about 1–2 weeks from Dun & Bradstreet India)
  and skips the 12-tester rule. Better once prsnn is a registered company.

### C2. Create the app
Play Console → **Create app** → name `prsnn` → App, Free → accept declarations.

### C3. Store listing and policies (Dashboard → "Set up your app")
Answers are in `docs/compliance/STORE_SUBMISSION.md`.
- **App access:** "All or some functionality is restricted" → add the Part B logins.
- **Ads:** No. **Content rating:** questionnaire (Social, users interact, 18+). **Target audience:** 18+ only.
- **Data safety:** copy the table from STORE_SUBMISSION.md (includes Razorpay as payment processor).
- **Privacy policy:** https://prsnn.com/privacy · **Account deletion URL:** https://prsnn.com/delete-account
- **Child safety standards:** https://prsnn.com/child-safety
- **Financial features:** none (payments are for real-world services via Razorpay).
- **Main store listing:** short description (80 chars), full description, icon 512×512, feature graphic
  1024×500, at least 2 phone screenshots.

### C4. Build and upload
```bash
npx eas-cli@latest build -p android --profile production --local --output ~/prsnn-builds/prsnn.aab
```
Play Console → **Testing → Internal testing → Create new release** → upload `prsnn.aab` → add your own
email as tester → roll out. Google asks you to let it manage the signing key: accept.
Then **Closed testing** (12+ testers for 14 days on a personal account) → **Production → Create release**
→ same `.aab` (or a newer one) → **Send for review** (usually 1–7 days).

---

## Part D · Apple App Store

### D1. Developer account
https://developer.apple.com/programs → **$99/year**. Individual (your name shows as seller) or Organisation
(needs D-U-N-S; shows "prsnn"). Approval 1–2 days.

### D2. Create the app
https://appstoreconnect.apple.com → **Apps → +** → New App → iOS, name `prsnn`, language English (India),
bundle ID **`com.prsnn.app`** (register it if asked), SKU `prsnn-ios`.

### D3. Build and send to TestFlight
```bash
npx eas-cli@latest build -p ios --profile production --local --output ~/prsnn-builds/prsnn.ipa
npx eas-cli@latest submit -p ios --path ~/prsnn-builds/prsnn.ipa
```
`eas submit` asks to create an App Store Connect API key: say yes. The build appears in **TestFlight** after
Apple processes it (15–60 min). Install it with the TestFlight app and test everything once.

### D4. App Store listing (App Store Connect → your app)
- **App Privacy:** answers in STORE_SUBMISSION.md. **Age rating:** 18+.
- **Privacy policy URL:** https://prsnn.com/privacy · **Support URL:** https://prsnn.com/support
- **Screenshots:** 6.9" iPhone (1320×2868) required; 6.5" recommended.
- **App Review Information:** the Part B logins + the review note in STORE_SUBMISSION.md (explains platonic
  company, in-person services paid with Razorpay under Guideline 3.1.3(e)).
- **Version → Build:** pick the TestFlight build → **Add for Review → Submit** (usually 1–3 days).

### Apple Guideline 1.2 (user-generated content): covered
People can **report** and **block** anyone from their profile or the chat ("⋯"), blocked people are listed in Profile → Blocked
people, and reports reach Admin → Reports with a staff notification. Mention this in the review notes.

---

## Part E · Before 100,000 users (capacity)

The app's logic is built for scale (database-enforced rules, indexed queries, idempotent payments and messages).
What limits you is the **Supabase plan**, not the code:

| Supabase | Free | Pro ($25/month) | What to do |
|---|---|---|---|
| Monthly active users (auth) | 50,000 | 100,000 included | **Pro** before launch |
| Database size | 500 MB | 8 GB included | Pro |
| Realtime connections at once (chat, live badges) | 200 | 500 (raise with an add-on) | Pro, then the Realtime add-on as daily users grow |
| Compute | Shared | Micro → upgrade (Small/Medium) | Upgrade compute when the dashboard shows CPU > 70% |
| Paused when idle | Yes | Never | Pro |

Also: Razorpay → **Settings → Payment capture → Automatic** (so no payment is left authorised); WhatsApp (Waplify)
message credits sized for login codes; the Razorpay webhook secret matching in both places.
