/**
 * Nexus Restore Script (Node.js — cross-platform)
 *
 * Restores a PostgreSQL database from a backup file (.sql or .sql.gz).
 *
 * Usage:
 *   node scripts/restore.js <backup-file>
 *
 * Examples:
 *   node scripts/restore.js ../backups/nexus-2026-05-19-030000.sql.gz
 *   node scripts/restore.js /backups/nexus/nexus-2026-05-19-030000.sql
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
};

// --- Helpers ---
function run(cmd, opts = {}) {
  const displayCmd = cmd.length > 120 ? cmd.slice(0, 120) + '...' : cmd;
  console.log(`  → ${displayCmd}`);
  return execSync(cmd, { stdio: 'inherit', encoding: 'utf-8', ...opts });
}

// --- Main ---
async function restore() {
  const args = process.argv.slice(2);

  if (args.length < 1 || args.includes('--help')) {
    console.log(`
Nexus Restore Script

Usage:
  node scripts/restore.js <backup-file>

Examples:
  node scripts/restore.js ../backups/nexus-2026-05-19-030000.sql.gz
  node scripts/restore.js /backups/nexus-2026-05-19-030000.sql
`);
    process.exit(args.length < 1 ? 1 : 0);
  }

  const restoreFile = path.resolve(args[0]);

  if (!fs.existsSync(restoreFile)) {
    console.error(`[ERROR] File not found: ${restoreFile}`);
    process.exit(1);
  }

  console.log(`[Nexus Restore] WARNING: This will OVERWRITE all data in "${CONFIG.dbName}" on ${CONFIG.dbHost}:${CONFIG.dbPort}`);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => {
    rl.question(`Type "yes" to continue: `, resolve);
  });
  rl.close();

  if (answer !== 'yes') {
    console.log('[Nexus Restore] Canceled.');
    process.exit(0);
  }

  // Decompress if gzipped
  let sqlContent;
  if (restoreFile.endsWith('.gz')) {
    console.log('[Nexus Restore] Decompressing...');
    const gzipped = fs.readFileSync(restoreFile);
    sqlContent = zlib.gunzipSync(gzipped).toString('utf-8');
  } else {
    sqlContent = fs.readFileSync(restoreFile, 'utf-8');
  }

  // Write to temp file and restore via psql
  const tmpFile = path.resolve(__dirname, '..', 'backups', '_restore_tmp.sql');
  fs.mkdirSync(path.dirname(tmpFile), { recursive: true });
  fs.writeFileSync(tmpFile, sqlContent);

  console.log('[Nexus Restore] Starting restore...');
  const psqlCmd = [
    'psql',
    `-h ${CONFIG.dbHost}`,
    `-p ${CONFIG.dbPort}`,
    `-U ${CONFIG.dbUser}`,
    `-d ${CONFIG.dbName}`,
    `-f "${tmpFile}"`,
  ].join(' ');

  run(psqlCmd, { env: { ...process.env, PGPASSWORD: CONFIG.dbPass } });
  fs.unlinkSync(tmpFile);
  console.log('[Nexus Restore] Done.');
}

restore().catch(err => {
  console.error('[Nexus Restore] FAILED:', err.message);
  process.exit(1);
});
