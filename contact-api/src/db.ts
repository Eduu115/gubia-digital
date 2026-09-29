import Database from 'better-sqlite3';

export interface LeadRow {
  id: string;
  fecha: string;
  nombre: string;
  email: string;
  telefono: string;
  negocio: string;
  tipo: string;
  necesitas: string;
  web: string;
  presupuesto: string;
  plazo: string;
  mensaje: string;
  origen: string;
  ref: string;
  utm: string;
  lang: string;
  ip_hash: string;
  notificado: number;
}

export function openDb(path: string): Database.Database {
  const db = new Database(path);
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      fecha TEXT NOT NULL,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL,
      telefono TEXT NOT NULL DEFAULT '',
      negocio TEXT NOT NULL,
      tipo TEXT NOT NULL,
      necesitas TEXT NOT NULL DEFAULT '',
      web TEXT NOT NULL DEFAULT '',
      presupuesto TEXT NOT NULL DEFAULT '',
      plazo TEXT NOT NULL DEFAULT '',
      mensaje TEXT NOT NULL DEFAULT '',
      origen TEXT NOT NULL DEFAULT '',
      ref TEXT NOT NULL DEFAULT '',
      utm TEXT NOT NULL DEFAULT '',
      lang TEXT NOT NULL DEFAULT 'es',
      ip_hash TEXT NOT NULL DEFAULT '',
      notificado INTEGER NOT NULL DEFAULT 0
    );
  `);
  return db;
}

export function insertLead(db: Database.Database, lead: LeadRow): void {
  db.prepare(
    `INSERT INTO leads (
      id, fecha, nombre, email, telefono, negocio, tipo, necesitas, web,
      presupuesto, plazo, mensaje, origen, ref, utm, lang, ip_hash, notificado
    ) VALUES (
      @id, @fecha, @nombre, @email, @telefono, @negocio, @tipo, @necesitas, @web,
      @presupuesto, @plazo, @mensaje, @origen, @ref, @utm, @lang, @ip_hash, @notificado
    )`,
  ).run(lead);
}

export function markNotified(db: Database.Database, id: string): void {
  db.prepare('UPDATE leads SET notificado = 1 WHERE id = ?').run(id);
}

export function pendingLeads(db: Database.Database): LeadRow[] {
  return db.prepare('SELECT * FROM leads WHERE notificado = 0').all() as LeadRow[];
}

export function purgeOlderThan(db: Database.Database, isoCutoff: string): number {
  const result = db.prepare('DELETE FROM leads WHERE fecha < ?').run(isoCutoff);
  return result.changes;
}
