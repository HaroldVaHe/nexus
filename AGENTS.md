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

1. **`synchronize: false`** — TypeORM sync is OFF. Schema lives in `database/schema.sql` OR in the initial TypeORM migration (`api/src/database/migrations/`). Run `npm run migration:run` after applying schema.sql to register the baseline, OR use migrations exclusively on fresh installs. Do NOT enable synchronize.
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

## Backup & Recovery

### Scripts
| Script | Location | Description |
|---|---|---|
| `backup.sh` | `scripts/backup.sh` | Bash — pg_dump + gzip + S3 upload + 30d retention. Uses `.env` vars. |
| `restore.sh` | `scripts/restore.sh` | Bash — restore from `.sql` or `.sql.gz` with confirmation prompt. |
| `backup.js` | `api/scripts/backup.js` | Node.js — cross-platform (Win/WSL). Reads `.env`, no bash required. |
| `restore.js` | `api/scripts/restore.js` | Node.js — cross-platform restore with decompression. |

### npm commands (api/)
```bash
npm run backup              # Full backup + S3 upload (if configured)
npm run backup:now          # Local-only backup (no upload)
npm run restore -- <file>   # Restore from backup file
```

### Cron (Linux/WSL)
Install the cron file to run backups daily at 3 AM:
```bash
sudo cp crontab/nexus-backup /etc/cron.d/nexus-backup
# Or: crontab crontab/nexus-backup
```

### S3/Cloud Storage
Set these in `api/.env` to enable cloud backups:
```
BACKUP_S3_BUCKET=my-nexus-backups
BACKUP_S3_ENDPOINT=https://s3.amazonaws.com
BACKUP_AWS_ACCESS_KEY_ID=...
BACKUP_AWS_SECRET_ACCESS_KEY=...
```
Works with any S3-compatible provider (AWS, MinIO, DigitalOcean Spaces, Backblaze B2).

### Retention
Default: 30 days. Set `BACKUP_RETENTION_DAYS=0` to keep forever.

## Database Migrations

### Initial migration
- `api/src/database/migrations/20260519000000-InitialSchema.ts` captures the full schema
- On **fresh install**: run `database/schema.sql` first, then `npm run migration:run` to register the baseline
- On **existing DB**: just run `npm run migration:run` — the initial migration uses `IF NOT EXISTS` for tables/extensions and `CREATE OR REPLACE` for triggers, so it's safe over existing schema

### Future migrations
```bash
npm run migration:generate -- src/database/migrations/AddColumnToTable  # Auto-generate
npm run migration:run      # Apply pending
npm run migration:revert   # Roll back last
```

### Important
- `synchronize: false` — TypeORM will NEVER auto-sync. All schema changes must be:
  1. Written as a migration, OR
  2. Applied manually via `database/schema.sql` (and then run `npm run migration:run` to keep migrations table in sync)

## Conventions

- Spanish UI text, English code identifiers
- Colors/theming in `app/src/theme/colors.ts`
- Font: Manrope (`@expo-google-fonts/manrope`)
- `*.docx` files in root are design docs (extractable via Python zipfile + xml.etree)
