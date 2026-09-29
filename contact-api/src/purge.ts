import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { openDb, purgeOlderThan } from './db';

const dbPath = process.env.DB_PATH ?? './data/leads.sqlite';
if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true });
const db = openDb(dbPath);
const cutoff = new Date();
cutoff.setMonth(cutoff.getMonth() - 12);
const removed = purgeOlderThan(db, cutoff.toISOString());
console.log(`leads purgados: ${removed}`);
