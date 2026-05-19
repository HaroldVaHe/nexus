import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbConfig = {
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'postgres',
};

const schemaPath = path.join(__dirname, 'database', 'schema.sql');

async function initializeDatabase() {
  // Step 1: Connect to postgres (default DB) to create nexus database
  const adminClient = new Client({ ...dbConfig, database: 'postgres' });

  try {
    await adminClient.connect();
    console.log('✓ Connected to PostgreSQL');

    // Create database if not exists
    try {
      await adminClient.query('CREATE DATABASE nexus;');
      console.log('✓ Database "nexus" created');
    } catch (err) {
      if (err.code === '42P04') {
        console.log('✓ Database "nexus" already exists');
      } else {
        throw err;
      }
    }

    await adminClient.end();
  } catch (err) {
    console.error('✗ Error creating database:', err.message);
    process.exit(1);
  }

  // Step 2: Connect to nexus database and run schema
  const schemaClient = new Client({ ...dbConfig, database: 'nexus' });

  try {
    await schemaClient.connect();
    console.log('✓ Connected to "nexus" database');

    // Read and execute schema
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await schemaClient.query(schema);
    console.log('✓ Schema executed successfully');

    await schemaClient.end();
  } catch (err) {
    console.error('✗ Error initializing schema:', err.message);
    process.exit(1);
  }

  console.log('\n✅ Database initialization complete!');
  process.exit(0);
}

initializeDatabase();
