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

```bash
npx eas-cli build -p android --profile preview   # installable APK
npx eas-cli build -p ios --profile production    # needs an Apple Developer account
```

## Phone login setup (backend)

The app logs people in with a 6-digit code on WhatsApp (Waplify), with SMS
(MSG91) as a backup. Set `WAPLIFY_API_KEY` and `WAPLIFY_TEMPLATE_NAME` on the
backend, and run `node src/scripts/migratePhoneAuth.js` once per database.
See [API.md](API.md).
