# Mini LMS

A React Native learning app built with Expo SDK 56 for an interview take-home. It covers auth, a course catalog, bookmarks, offline cache, WebView lessons, local notifications, and dark mode.

## What it does

- **Auth** — register, login, logout. JWT stored in SecureStore; user profile in AsyncStorage. Profile picture updates saved locally (FreeAPI has no avatar upload endpoint).
- **Courses** — pulls from [FreeAPI](https://api.freeapi.app) and maps random products/users into course data.
- **Search & refresh** — filter the catalog locally; pull-to-refresh reloads from the API.
- **Bookmarks** — saved per user in AsyncStorage; milestone toast/notification at 5+ bookmarks.
- **Course detail** — view info, bookmark, enroll (persisted per user), open a WebView lesson with saved progress.
- **Offline** — 30-minute course cache; banner when NetInfo reports no connection.
- **Notifications** — local notifications for bookmark milestones and a 24h inactivity reminder.
- **Theme** — light / dark / system, persisted.
- **Biometrics** — optional unlock if a session already exists (does not call the login API).

## Stack

Expo Router, TypeScript, NativeWind, Zustand, Axios, React Hook Form + Zod, Legend List, Expo Image, SecureStore, AsyncStorage, react-native-webview.

## Setup

```bash
cd mini-lms
npm install --legacy-peer-deps
npm start
```

No API key needed. Create an account in the app or use existing FreeAPI credentials.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Open on Android |
| `npm run ios` | Open on iOS simulator |
| `npm run lint` | Typecheck (`tsc --noEmit`) |

## Project layout

```
src/
├── app/           # Expo Router screens
├── components/    # Shared UI
├── features/      # Auth schemas, webview, recommendations
├── services/      # API, storage, notifications
├── store/         # Zustand stores
├── hooks/         # Bootstrap, courses, bookmarks, theme, biometrics
├── utils/         # Errors, retry, formatting
└── types/         # Shared types
```

## Known limitations

- **Enrollment** is persisted per user in AsyncStorage. Lesson progress is saved when you mark a lesson complete in the WebView viewer.
- **Recommendations** are rule-based (bookmarks + rating + price), not ML.
- **Biometrics** unlock the existing session; they do not re-authenticate with the API.
- **FreeAPI** response shapes vary; the course mapper handles several formats defensively.
- **Android Expo Go (SDK 53+)** blocks notification APIs. Bookmark milestones fall back to in-app toasts. Use a dev build (`npx expo run:android`) for full notification testing.
- **Auth hydrate** trusts cached user + token without re-fetching `/current-user`.
- **Inactivity reminder** is a scheduled local notification, not a push backend.

## API endpoints used

- `POST /api/v1/users/login`
- `POST /api/v1/users/register`
- `POST /api/v1/users/refresh-token`
- `GET /api/v1/public/randomproducts`
- `GET /api/v1/public/randomusers`

## Building for device

For a preview APK with EAS:

```bash
eas build -p android --profile preview
```

Or after `npx expo prebuild`, build from the `android/` folder.
