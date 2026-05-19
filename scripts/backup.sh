#!/bin/bash
# =====================================================
# Nexus Backup Script
# pg_dump with compression, retention, and S3 upload
# =====================================================
# Usage:
#   ./scripts/backup.sh                          # Uses defaults or .env
#   DATABASE_HOST=localhost ./scripts/backup.sh   # Override host
#   BACKUP_ONLY=1 ./scripts/backup.sh             # No S3 upload
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
BACKUP_DIR="${BACKUP_DIR:-/backups/nexus}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
S3_BUCKET="${BACKUP_S3_BUCKET:-}"
S3_ENDPOINT="${BACKUP_S3_ENDPOINT:-}"
AWS_ACCESS_KEY_ID="${BACKUP_AWS_ACCESS_KEY_ID:-}"
AWS_SECRET_ACCESS_KEY="${BACKUP_AWS_SECRET_ACCESS_KEY:-}"
BACKUP_ONLY="${BACKUP_ONLY:-0}"
TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/nexus-${TIMESTAMP}.sql"

# --- Create backup directory ---
mkdir -p "$BACKUP_DIR"

echo "[Nexus Backup] Starting backup of ${DB_NAME} on ${DB_HOST}:${DB_PORT}..."

# --- 1. pg_dump ---
PGPASSWORD="$DB_PASS" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --no-owner \
  --no-acl \
  --verbose \
  > "$BACKUP_FILE" 2>> "$BACKUP_DIR/backup.log"

gzip --force "$BACKUP_FILE"
echo "[Nexus Backup] Backup created: ${BACKUP_FILE}.gz"

# --- 2. Upload to S3 (if configured) ---
if [ -n "$S3_BUCKET" ] && [ "$BACKUP_ONLY" -eq 0 ]; then
  S3_PATH="s3://${S3_BUCKET}/nexus-${TIMESTAMP}.sql.gz"

  S3_OPTS=()
  [ -n "$S3_ENDPOINT" ] && S3_OPTS+=(--endpoint-url "$S3_ENDPOINT")

  export AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
  export AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"

  echo "[Nexus Backup] Uploading to ${S3_PATH}..."
  aws s3 cp "${BACKUP_FILE}.gz" "$S3_PATH" "${S3_OPTS[@]}"
  echo "[Nexus Backup] Upload complete."
fi

# --- 3. Retention: delete old backups ---
if [ "$RETENTION_DAYS" -gt 0 ]; then
  find "$BACKUP_DIR" -name "nexus-*.sql.gz" -mtime "+${RETENTION_DAYS}" -delete
  echo "[Nexus Backup] Cleaned up backups older than ${RETENTION_DAYS} days."
fi

echo "[Nexus Backup] Done."
