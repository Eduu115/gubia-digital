import { describe, expect, it } from 'vitest';
import { openDb, purgeOlderThan } from './db';
import { createApp, retryPending, type Notify } from './app';
import type { LeadRow } from './db';

function form(extra: Record<string, string> = {}) {
  const params = new URLSearchParams({
    nombre: 'Ana',
    email: 'ana@example.com',
    negocio: 'Confecciones Ana Mari',
    tipo: 'Mercería',
    necesitas: 'rediseno',
    consentimiento: 'on',
    lang: 'es',
    ts: String(Date.now() - 10_000),
    ...extra,
  });
  return params;
}

function post(body: URLSearchParams, accept = '') {
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      ...(accept ? { accept } : {}),
    },
    body: body.toString(),
  };
}

describe('contact-api', () => {
  it('guarda un envío válido y redirige sin JS', async () => {
    const db = openDb(':memory:');
    const app = createApp({ db, notify: async () => {} });
    const response = await app.request('/api/contact', post(form()));
    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/gracias/');
    const row = db.prepare('SELECT negocio, notificado FROM leads').get() as { negocio: string; notificado: number };
    expect(row.negocio).toBe('Confecciones Ana Mari');
    expect(row.notificado).toBe(1);
  });

  it('responde JSON si el cliente lo pide', async () => {
    const db = openDb(':memory:');
    const app = createApp({ db });
    const response = await app.request('/api/contact', post(form({ lang: 'en' }), 'application/json'));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get('location')).toBeNull();
  });

  it('descarta el honeypot sin guardar', async () => {
    const db = openDb(':memory:');
    const app = createApp({ db });
    const response = await app.request('/api/contact', post(form({ website: 'http://spam.test' })));
    expect(response.status).toBe(303);
    expect(db.prepare('SELECT COUNT(*) AS n FROM leads').get()).toEqual({ n: 0 });
  });

  it('descarta un envío demasiado rápido', async () => {
    const db = openDb(':memory:');
    const app = createApp({ db, now: () => 10_000 });
    const response = await app.request('/api/contact', post(form({ ts: '9000' })));
    expect(response.status).toBe(303);
    expect(db.prepare('SELECT COUNT(*) AS n FROM leads').get()).toEqual({ n: 0 });
  });

  it('rechaza Turnstile inválido', async () => {
    const db = openDb(':memory:');
    const app = createApp({
      db,
      turnstileRequired: true,
      verifyTurnstile: async () => false,
    });
    const response = await app.request('/api/contact', post(form({ turnstile: 'bad' })));
    expect(response.status).toBe(400);
    expect(db.prepare('SELECT COUNT(*) AS n FROM leads').get()).toEqual({ n: 0 });
  });

  it('limita a 5 envíos por hora', async () => {
    const db = openDb(':memory:');
    const app = createApp({ db });
    for (let i = 0; i < 5; i += 1) {
      const response = await app.request('/api/contact', post(form({ email: `a${i}@example.com` })));
      expect(response.status).toBe(303);
    }
    const blocked = await app.request('/api/contact', post(form({ email: 'mas@example.com' })));
    expect(blocked.status).toBe(429);
  });

  it('valida los campos obligatorios', async () => {
    const db = openDb(':memory:');
    const app = createApp({ db });
    const response = await app.request('/api/contact', post(form({ email: 'no-es-email' }), 'application/json'));
    expect(response.status).toBe(422);
  });

  it('reintenta un aviso fallido', async () => {
    const db = openDb(':memory:');
    let calls = 0;
    const notify: Notify = async () => {
      calls += 1;
      if (calls === 1) throw new Error('ntfy caído');
    };
    const app = createApp({ db, notify });
    await app.request('/api/contact', post(form()));
    const pending = db.prepare('SELECT notificado FROM leads').get() as { notificado: number };
    expect(pending.notificado).toBe(0);
    const sent = await retryPending(db, notify);
    expect(sent).toBe(1);
    expect((db.prepare('SELECT notificado FROM leads').get() as { notificado: number }).notificado).toBe(1);
  });

  it('purga leads de más de 12 meses', () => {
    const db = openDb(':memory:');
    const old: LeadRow = {
      id: 'old',
      fecha: '2020-01-01T00:00:00.000Z',
      nombre: 'Ana',
      email: 'ana@example.com',
      telefono: '',
      negocio: 'Taller',
      tipo: 'Mercería',
      necesitas: 'rediseno',
      web: '',
      presupuesto: '',
      plazo: '',
      mensaje: '',
      origen: '',
      ref: '',
      utm: '',
      lang: 'es',
      ip_hash: 'x',
      notificado: 1,
    };
    db.prepare(
      `INSERT INTO leads (
        id, fecha, nombre, email, telefono, negocio, tipo, necesitas, web,
        presupuesto, plazo, mensaje, origen, ref, utm, lang, ip_hash, notificado
      ) VALUES (
        @id, @fecha, @nombre, @email, @telefono, @negocio, @tipo, @necesitas, @web,
        @presupuesto, @plazo, @mensaje, @origen, @ref, @utm, @lang, @ip_hash, @notificado
      )`,
    ).run(old);
    expect(purgeOlderThan(db, '2024-01-01T00:00:00.000Z')).toBe(1);
  });
});
