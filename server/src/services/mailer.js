import nodemailer from 'nodemailer';

// Invio mail via SMTP generico (Brevo, Gmail con password per app, Mailgun, ...).
// Se SMTP_HOST non e' impostato la mail e' disattivata: l'app continua a funzionare
// e il messaggio viene solo scritto nei log (utile in sviluppo).
let transporter;

const getTransporter = () => {
  if (!process.env.SMTP_HOST) return null;
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT) || 587;
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }
  return transporter;
};

export const mailEnabled = () => Boolean(process.env.SMTP_HOST);

export const sendMail = async ({ to, subject, text, html }) => {
  const tx = getTransporter();
  if (!tx) {
    console.log(`[mail disattivata] a: ${to} | oggetto: ${subject}\n${text}`);
    return { sent: false };
  }
  await tx.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
  return { sent: true };
};

export const appUrl = () => (process.env.APP_URL || 'http://localhost:5173').replace(/\/$/, '');
