import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './pool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');

try {
  await pool.query(schema);
  console.log('✓ Schema created');
} catch (err) {
  console.error('DB init failed:', err.message);
} finally {
  await pool.end();
}
