#!/bin/bash
# =====================================================
# Nexus Restore Script
# Restore a PostgreSQL database from a backup file
# =====================================================
# Usage:
#   ./scripts/restore.sh /path/to/backup.sql.gz
#   ./scripts/restore.sh /path/to/backup.sql
# =====================================================

set -euo pipefail

# --- Load .env if present ---
ENV_FILE="${PROJECT_DIR:-$(dirname "$0")/../api/.env}"
if [ -f "$ENV_FILE" ]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

# --- Configuration (with defaults) ---
DB_HOST="${DATABASE_HOST:-localhost}"
DB_PORT="${DATABASE_PORT:-5432}"
DB_USER="${DATABASE_USERNAME:-postgres}"
DB_PASS="${DATABASE_PASSWORD:-postgres}"
DB_NAME="${DATABASE_NAME:-nexus}"

# --- Validate input ---
if [ $# -lt 1 ]; then
  echo "Usage: $0 <backup-file>"
  echo ""
  echo "Examples:"
  echo "  $0 /backups/nexus/nexus-2026-05-19-030000.sql.gz"
  echo "  $0 /backups/nexus/nexus-2026-05-19-030000.sql"
  exit 1
fi

RESTORE_FILE="$1"

if [ ! -f "$RESTORE_FILE" ]; then
  echo "[ERROR] File not found: $RESTORE_FILE"
  exit 1
fi

echo "[Nexus Restore] WARNING: This will OVERWRITE all data in '${DB_NAME}' on ${DB_HOST}:${DB_PORT}"
read -rp "Are you sure? Type 'yes' to continue: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "[Nexus Restore] Canceled."
  exit 0
fi

# --- Decompress if gzipped ---
RESTORE_CMD="psql"
if [[ "$RESTORE_FILE" == *.gz ]]; then
  echo "[Nexus Restore] Decompressing..."
  gunzip --stdout "$RESTORE_FILE" > /tmp/nexus-restore-tmp.sql
  RESTORE_FILE="/tmp/nexus-restore-tmp.sql"
fi

# --- Restore ---
echo "[Nexus Restore] Starting restore of ${DB_NAME}..."

PGPASSWORD="$DB_PASS" psql \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  -f "$RESTORE_FILE"

echo "[Nexus Restore] Restore completed successfully."

# --- Cleanup temp file ---
if [ -f "/tmp/nexus-restore-tmp.sql" ]; then
  rm "/tmp/nexus-restore-tmp.sql"
fi

echo "[Nexus Restore] Done."
