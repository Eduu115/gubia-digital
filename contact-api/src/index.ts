import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { serve } from '@hono/node-server';
import { openDb } from './db';
import { createApp, retryPending, type Notify } from './app';
import { notifyLead } from './notify';

const dbPath = process.env.DB_PATH ?? './data/leads.sqlite';
if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true });
const db = openDb(dbPath);
const notify: Notify = (lead) => notifyLead(lead);
const turnstileRequired = Boolean(process.env.TURNSTILE_SECRET);

const app = createApp({
  db,
  salt: process.env.IP_HASH_SALT ?? 'dev-salt',
  turnstileRequired,
  verifyTurnstile: async (token, ip) => {
    const secret = process.env.TURNSTILE_SECRET;
    if (!secret) return false;
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  },
  notify,
});

await retryPending(db, notify);

const port = Number(process.env.PORT ?? 8787);
serve({ fetch: app.fetch, port }, () => {
  console.log(`contact-api en http://127.0.0.1:${port}`);
});
