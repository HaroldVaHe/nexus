# Nexus - Agent Instructions

## Project Overview
Carpooling app for Universidad de La Sabana. Monorepo with NestJS backend (`api/`) and Expo frontend (`app/`).

## Essential Commands

### Backend (api/)
```bash
cd api && npm install
cp .env.example .env
npm run start:dev             # Hot-reload on :3000 (needs PostgreSQL running)
```

### Frontend (app/)
```bash
cd app && npm install
npx expo start                # Expo dev server
npx expo start --clear        # Reset Metro cache on weird errors
```

### Database
```bash
psql -U postgres -c "CREATE DATABASE nexus;"
psql -U postgres -d nexus -f database/schema.sql
```

### Load Testing
```bash
cd api && npm run traffic:payments        # Node.js traffic simulator
cd api && npm run traffic:jmeter           # JMeter via Docker
```

### Sentry Test
```bash
cd api && node scripts/test-sentry.js      # Standalone test (needs SENTRY_DSN)
GET http://localhost:3000/api/v1/health/test/message
```

## WSL Node.js Quirk
Node is installed on Windows only. Use the full path for npm:
```
"/mnt/c/Program Files/nodejs/node.exe" "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js" install
```
Or set `PATH` to include `/mnt/c/Program Files/nodejs`.

## Critical Setup Rules

1. **`synchronize: false`** — TypeORM sync is OFF. Schema lives in `database/schema.sql`. Do NOT enable synchronize or use TypeORM migrations.
2. **API URL** — `app/src/utils/config.ts` has a hardcoded IP (`http://192.168.1.2:3000/api/v1`). Must match the dev machine's local IP.
3. **Auth response shape** — Backend returns flat `{ accessToken, expiresIn, id, email, full_name, ... }`, NOT `{ user: {...} }`. `AuthContext.login()` expects flat shape.
4. **Domain validation** — Only `@unisabana.edu.co` emails allowed. Hardcoded in `auth.service.ts`.
5. **No test suites exist** — Do not attempt to run tests.

## Architecture Notes

- **DB schema**: `database/schema.sql` is the single source of truth. Run manually on fresh installs. Contains 11 tables + 3 views.
- **Auth flow**: JWT only (no refresh tokens). Microsoft OAuth is a stub (`verifyMicrosoftToken` returns mock email).
- **API modules**: `api/src/modules/` — auth, bookings, cards, health, notifications, payments, reviews, sabana-coins, trips, users, vehicles.
- **Frontend screens**: `app/app/` via expo-router. Auth, trips, bookings, payments (cards real API, PSE removed), Sabana Coins, vehicles, users all connected to backend. **Reports still use mock data** (no backend module for reports).
- **API clients**: `app/src/api/` — `auth.ts`, `bookings.ts`, `cards.ts`, `payments.ts`, `routes.ts`, `sabana-coins.ts`, `trips.ts`, `users.ts`, `vehicles.ts`.
- **Headers**: All screens use `insets.top + spacing.md` via `useSafeAreaInsets()` for status bar/notch padding.

## Monitoring & Logs

- **Sentry**: Frontend (`sentry-expo`) + Backend (`@sentry/nestjs`). DSN in `app/src/utils/config.ts` and `api/.env`. Enable with `Sentry.init({ enableInExpoDevelopment: true })`.
- **Winston**: Logs to `api/logs/error.log` and `api/logs/combined.log` (rotated daily). Colorized console in dev.
- **Health check**: `GET /api/v1/health` — returns DB status.
- **Try/catch won't reach Sentry unless sent manually**. Unhandled NestJS exceptions ARE caught by the global filter.

## Conventions

- Spanish UI text, English code identifiers
- Colors/theming in `app/src/theme/colors.ts`
- Font: Manrope (`@expo-google-fonts/manrope`)
- `*.docx` files in root are design docs (extractable via Python zipfile + xml.etree)
