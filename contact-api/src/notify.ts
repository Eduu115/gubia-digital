import nodemailer from 'nodemailer';
import type { LeadRow } from './db';

export async function notifyLead(lead: LeadRow): Promise<void> {
  const tasks: Promise<unknown>[] = [];
  const topic = process.env.NTFY_TOPIC;
  const ntfyUrl = process.env.NTFY_URL;
  if (ntfyUrl && topic) {
    const headers: Record<string, string> = {
      Title: `Nuevo lead: ${lead.negocio}`,
      Priority: 'high',
    };
    if (process.env.NTFY_TOKEN) headers.Authorization = `Bearer ${process.env.NTFY_TOKEN}`;
    tasks.push(
      fetch(`${ntfyUrl.replace(/\/$/, '')}/${topic}`, {
        method: 'POST',
        headers,
        body: `${lead.nombre} · ${lead.email}\n${lead.necesitas}`,
      }).then((response) => {
        if (!response.ok) throw new Error(`ntfy ${response.status}`);
      }),
    );
  }

  if (process.env.SMTP_HOST && process.env.LEADS_TO) {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
    });
    tasks.push(
      transport.sendMail({
        from: process.env.SMTP_USER || process.env.LEADS_TO,
        to: process.env.LEADS_TO,
        replyTo: lead.email,
        subject: `Nuevo lead: ${lead.negocio}`,
        text: `${lead.nombre}\n${lead.email}\n${lead.telefono}\n${lead.necesitas}\n${lead.mensaje}`,
      }),
    );
  }

  if (tasks.length === 0) return;
  await Promise.all(tasks);
}
