import { createHash, randomUUID } from 'node:crypto';
import { Hono } from 'hono';
import { z } from 'zod';
import type { Database } from 'better-sqlite3';
import { insertLead, markNotified, pendingLeads, type LeadRow } from './db';

const MIN_FILL_MS = 3000;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const leadSchema = z.object({
  nombre: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  telefono: z.string().trim().max(40).optional().default(''),
  negocio: z.string().trim().min(1).max(160),
  tipo: z.string().trim().min(1).max(80),
  necesitas: z.array(z.string().trim().min(1).max(40)).min(1),
  web: z
    .string()
    .trim()
    .max(300)
    .optional()
    .default('')
    .refine((value) => value === '' || /^https?:\/\//.test(value)),
  presupuesto: z.string().trim().max(40).optional().default(''),
  plazo: z.string().trim().max(40).optional().default(''),
  mensaje: z.string().trim().max(4000).optional().default(''),
  consentimiento: z.union([z.literal('on'), z.literal('true'), z.literal(true)]),
  lang: z.enum(['es', 'en']).optional().default('es'),
  origen: z.string().trim().max(300).optional().default(''),
  ref: z.string().trim().max(80).optional().default(''),
  utm_source: z.string().trim().max(80).optional().default(''),
  utm_medium: z.string().trim().max(80).optional().default(''),
  utm_campaign: z.string().trim().max(80).optional().default(''),
  ts: z.string().optional().default(''),
  website: z.string().optional().default(''),
  turnstile: z.string().optional().default(''),
});

export type Notify = (lead: LeadRow) => Promise<void>;

export interface AppOptions {
  db: Database;
  now?: () => number;
  salt?: string;
  turnstileRequired?: boolean;
  verifyTurnstile?: (token: string, ip: string) => Promise<boolean>;
  notify?: Notify;
}

function strings(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap((item) => strings(item));
  if (value == null || value === '') return [];
  return [String(value)];
}

function first(value: unknown): string {
  if (Array.isArray(value)) return value.length ? String(value[0]) : '';
  if (value == null) return '';
  return String(value);
}

async function readRaw(c: { req: { header: (name: string) => string | undefined; json: () => Promise<unknown>; parseBody: (opts: { all: true }) => Promise<Record<string, unknown>> } }): Promise<Record<string, unknown>> {
  const type = c.req.header('content-type') ?? '';
  if (type.includes('application/json')) {
    const json = await c.req.json();
    return json && typeof json === 'object' ? (json as Record<string, unknown>) : {};
  }
  return c.req.parseBody({ all: true });
}

function hashIp(ip: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

function thanks(lang: string): string {
  return lang === 'en' ? '/en/thanks/' : '/gracias/';
}

export function createApp(options: AppOptions) {
  const now = options.now ?? Date.now;
  const salt = options.salt ?? 'dev-salt';
  const hits = new Map<string, number[]>();
  const app = new Hono();

  const succeed = (c: { req: { header: (name: string) => string | undefined }; json: (data: unknown, status?: number) => Response; redirect: (location: string, status?: number) => Response }, lang: string) => {
    const accept = c.req.header('accept') ?? '';
    if (accept.includes('application/json')) return c.json({ ok: true });
    return c.redirect(thanks(lang), 303);
  };

  app.get('/api/health', (c) => c.json({ ok: true }));

  app.post('/api/contact', async (c) => {
    const ip = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
    let raw: Record<string, unknown>;
    try {
      raw = await readRaw(c);
    } catch {
      return c.json({ ok: false, error: 'invalid-body' }, 400);
    }

    const website = first(raw.website);
    const ts = Number(first(raw.ts));
    const lang = first(raw.lang) === 'en' ? 'en' : 'es';
    const tooFast = !Number.isFinite(ts) || now() - ts < MIN_FILL_MS;
    if (website.trim() !== '' || tooFast) {
      return succeed(c, lang);
    }

    if (options.turnstileRequired) {
      const token = first(raw.turnstile ?? raw['cf-turnstile-response']);
      const valid = token ? await options.verifyTurnstile?.(token, ip) : false;
      if (!valid) return c.json({ ok: false, error: 'turnstile' }, 400);
    }

    const recent = (hits.get(ip) ?? []).filter((stamp) => now() - stamp < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) {
      hits.set(ip, recent);
      return c.json({ ok: false, error: 'rate-limit' }, 429);
    }
    recent.push(now());
    hits.set(ip, recent);

    const parsed = leadSchema.safeParse({
      ...Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value : first(value)])),
      necesitas: strings(raw.necesitas),
      telefono: first(raw.telefono),
      web: first(raw.web),
      presupuesto: first(raw.presupuesto),
      plazo: first(raw.plazo),
      mensaje: first(raw.mensaje),
      consentimiento: Array.isArray(raw.consentimiento) ? raw.consentimiento[0] : raw.consentimiento,
    });

    if (!parsed.success) {
      return c.json(
        {
          ok: false,
          error: 'validation',
          fields: parsed.error.issues.map((issue) => String(issue.path[0] ?? 'form')),
        },
        422,
      );
    }

    const data = parsed.data;
    const lead: LeadRow = {
      id: randomUUID(),
      fecha: new Date(now()).toISOString(),
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      negocio: data.negocio,
      tipo: data.tipo,
      necesitas: data.necesitas.join(','),
      web: data.web,
      presupuesto: data.presupuesto,
      plazo: data.plazo,
      mensaje: data.mensaje,
      origen: data.origen,
      ref: data.ref,
      utm: [data.utm_source, data.utm_medium, data.utm_campaign].filter(Boolean).join('|'),
      lang: data.lang,
      ip_hash: hashIp(ip, salt),
      notificado: 0,
    };

    insertLead(options.db, lead);
    if (options.notify) {
      try {
        await options.notify(lead);
        markNotified(options.db, lead.id);
      } catch (error) {
        console.error('aviso de lead fallido', error);
      }
    } else {
      markNotified(options.db, lead.id);
    }

    return succeed(c, data.lang);
  });

  return app;
}

export async function retryPending(db: Database, notify: Notify): Promise<number> {
  let sent = 0;
  for (const lead of pendingLeads(db)) {
    try {
      await notify(lead);
      markNotified(db, lead.id);
      sent += 1;
    } catch (error) {
      console.error('reintento de lead fallido', lead.id, error);
    }
  }
  return sent;
}
