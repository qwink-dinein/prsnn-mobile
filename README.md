# prsnn. — mobile app

Good company, on your terms. Find and book verified companions in Hyderabad
for coffee, walks, events and study. Native iOS and Android app built with
Expo / React Native.

| | |
|---|---|
| Backend | [qwink-dinein/prsnn-backend](https://github.com/qwink-dinein/prsnn-backend) (Express + MongoDB on Render) |
| Web + admin | [qwink-dinein/prsnn-frontend](https://github.com/qwink-dinein/prsnn-frontend) (Next.js) |
| Docs | [PRD](PRD.md) · [Design](design.md) · [Architecture](Architecture.md) · [API](API.md) · [Tasks](Tasks.md) · [Phases](Phases.md) |

## Run it

```bash
npm install
cp .env.example .env        # point at the backend you want
npm start                   # scan the QR code with Expo Go
```

Look around without a backend (sample data):

```bash
EXPO_PUBLIC_DEMO=1 npm run web
```

Checks:

```bash
npm run typecheck && npm run lint && npm test
```

## Builds

Builds go under the `mukarramjah` Expo account (same as Hyderabad Rishta).
First time only: `npx eas-cli init` to link the project.

**Local build (unlimited, no EAS queue)** — like the HR tester APK, on the Mac:

```bash
npx eas-cli build -p android --profile preview --local   # → build-*.apk, share via Drive
npx eas-cli build -p ios --profile preview --local       # needs Xcode + Apple Developer account
```

Cloud build (same profiles, uses EAS minutes):

```bash
npx eas-cli build -p android --profile preview
```

Local builds need Node 20+, Java 17 and the Android SDK (`ANDROID_HOME`) for Android,
Xcode for iOS. `EXPO_PUBLIC_API_URL` is read at build time — set it in `.env` first
(testing backend for tester builds).

## Payments

Until Razorpay is switched on, the backend runs `PAYMENT_MODE=simulated` and the app shows a
**test checkout** (clearly marked, no money moves, you can also simulate a failure). When the
backend switches to `razorpay`, the same app build opens real Razorpay checkout.

## Phone login setup (backend)

The app logs people in with a 6-digit code on WhatsApp (Waplify), with SMS
(MSG91) as a backup. Set `WAPLIFY_API_KEY` and `WAPLIFY_TEMPLATE_NAME` on the
backend, and run `node src/scripts/migratePhoneAuth.js` once per database.
See [API.md](API.md).

## Hosted preview (phone frame, sample data)

Private Artifact: https://claude.ai/artifact/CBpyddfgmMmpXXm3Nj3xMJ. It has two files: `preview/index.html`
(phone-frame shell, committed) and `preview/app.html` (the whole app packed into one file, not committed).
Rebuild and republish to the same URL:

```bash
SINGLE_BUNDLE=1 EXPO_PUBLIC_DEMO=1 EXPO_OFFLINE=1 npx expo export --platform web --output-dir dist-single
node scripts/pack-web.js dist-single preview/app.html --standalone
```
