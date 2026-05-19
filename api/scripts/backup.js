/**
 * Nexus Backup Script (Node.js — cross-platform)
 *
 * Creates a pg_dump backup, compresses it, optionally uploads to S3,
 * and enforces retention policy.
 *
 * Usage:
 *   node scripts/backup.js                    # Uses .env or defaults
 *   node scripts/backup.js --no-upload        # Local-only backup
 *   node scripts/backup.js --help             # Show usage
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const readline = require('readline');

// --- Load .env ---
try {
  const envPath = path.resolve(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
} catch { /* ignore */ }

// --- Config ---
const CONFIG = {
  dbHost: process.env.DATABASE_HOST || 'localhost',
  dbPort: process.env.DATABASE_PORT || '5432',
  dbUser: process.env.DATABASE_USERNAME || 'postgres',
  dbPass: process.env.DATABASE_PASSWORD || 'postgres',
  dbName: process.env.DATABASE_NAME || 'nexus',
  backupDir: process.env.BACKUP_DIR || path.resolve(__dirname, '..', 'backups'),
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10),
  s3Bucket: process.env.BACKUP_S3_BUCKET || '',
  s3Endpoint: process.env.BACKUP_S3_ENDPOINT || '',
  s3Key: process.env.BACKUP_AWS_ACCESS_KEY_ID || '',
  s3Secret: process.env.BACKUP_AWS_SECRET_ACCESS_KEY || '',
};

const args = process.argv.slice(2);
const NO_UPLOAD = args.includes('--no-upload');
const SHOW_HELP = args.includes('--help');

if (SHOW_HELP) {
  console.log(`
Nexus Backup Script

Usage:
  node scripts/backup.js              Full backup + optional S3 upload
  node scripts/backup.js --no-upload   Skip S3 upload
  node scripts/backup.js --help        Show this help

Environment variables (from .env):
  DATABASE_HOST, DATABASE_PORT, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME
  BACKUP_DIR, BACKUP_RETENTION_DAYS
  BACKUP_S3_BUCKET, BACKUP_S3_ENDPOINT, BACKUP_AWS_ACCESS_KEY_ID, BACKUP_AWS_SECRET_ACCESS_KEY
`);
  process.exit(0);
}

// --- Helpers ---
function run(cmd, opts = {}) {
  const displayCmd = cmd.length > 120 ? cmd.slice(0, 120) + '...' : cmd;
  console.log(`  → ${displayCmd}`);
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8', ...opts });
}

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

// --- Main ---
async function backup() {
  console.log('[Nexus Backup] Starting...\n');

  // Ensure backup directory
  fs.mkdirSync(CONFIG.backupDir, { recursive: true });

  const ts = timestamp();
  const sqlFile = path.join(CONFIG.backupDir, `nexus-${ts}.sql`);
  const gzFile = sqlFile + '.gz';

  // 1. pg_dump
  console.log(`[1/3] Dumping database "${CONFIG.dbName}" on ${CONFIG.dbHost}:${CONFIG.dbPort}...`);

  const pgDumpCmd = [
    'pg_dump',
    `-h ${CONFIG.dbHost}`,
    `-p ${CONFIG.dbPort}`,
    `-U ${CONFIG.dbUser}`,
    `-d ${CONFIG.dbName}`,
    '--no-owner',
    '--no-acl',
  ].join(' ');

  const dumpOutput = run(pgDumpCmd, {
    env: { ...process.env, PGPASSWORD: CONFIG.dbPass },
  });
  fs.writeFileSync(sqlFile, dumpOutput);
  console.log(`  Backup saved: ${sqlFile}`);

  // 2. Compress
  console.log('[2/3] Compressing...');
  const gzip = zlib.createGzip();
  const input = fs.createReadStream(sqlFile);
  const output = fs.createWriteStream(gzFile);
  await new Promise((resolve, reject) => {
    input.pipe(gzip).pipe(output);
    output.on('finish', resolve);
    output.on('error', reject);
  });
  fs.unlinkSync(sqlFile);
  const size = (fs.statSync(gzFile).size / 1024 / 1024).toFixed(2);
  console.log(`  Compressed: ${gzFile} (${size} MB)`);

  // 3. S3 upload
  if (CONFIG.s3Bucket && !NO_UPLOAD) {
    const s3Path = `s3://${CONFIG.s3Bucket}/nexus-${ts}.sql.gz`;
    console.log(`[3/3] Uploading to ${s3Path}...`);

    const awsEnv = { ...process.env };
    if (CONFIG.s3Key) awsEnv.AWS_ACCESS_KEY_ID = CONFIG.s3Key;
    if (CONFIG.s3Secret) awsEnv.AWS_SECRET_ACCESS_KEY = CONFIG.s3Secret;

    const awsCmd = [
      'aws', 's3', 'cp',
      gzFile,
      s3Path,
      CONFIG.s3Endpoint ? `--endpoint-url ${CONFIG.s3Endpoint}` : '',
    ].filter(Boolean).join(' ');

    run(awsCmd, { env: awsEnv });
    console.log('  Upload complete.');
  } else {
    console.log('[3/3] Skipping S3 upload (no bucket configured or --no-upload flag set).');
  }

  // 4. Retention
  if (CONFIG.retentionDays > 0) {
    console.log(`\nCleaning backups older than ${CONFIG.retentionDays} days...`);
    const files = fs.readdirSync(CONFIG.backupDir)
      .filter(f => f.startsWith('nexus-') && f.endsWith('.sql.gz'))
      .map(f => ({
        name: f,
        path: path.join(CONFIG.backupDir, f),
        mtime: fs.statSync(path.join(CONFIG.backupDir, f)).mtime,
      }));

    const cutoff = Date.now() - CONFIG.retentionDays * 24 * 60 * 60 * 1000;
    let deleted = 0;
    for (const file of files) {
      if (file.mtime.getTime() < cutoff) {
        fs.unlinkSync(file.path);
        deleted++;
      }
    }
    console.log(`  Removed ${deleted} old backup(s).`);
  }

  console.log(`\n[Nexus Backup] Done. File: ${gzFile}`);
}

backup().catch(err => {
  console.error('[Nexus Backup] FAILED:', err.message);
  process.exit(1);
});
