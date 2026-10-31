import crypto from 'crypto';
import { validationResult } from 'express-validator';

import { User } from '../models/User.js';
import { appUrl, sendMail } from '../services/mailer.js';

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
const RESET_TTL_MS = 60 * 60 * 1000; // 1 ora

// Risposta sempre identica: non rivela se l'email e' registrata.
const GENERIC = { message: 'Se l\'email è registrata, riceverai un link per reimpostare la password.' };

export const forgotPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Dati non validi', errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = hashToken(token);
      user.resetPasswordExpires = new Date(Date.now() + RESET_TTL_MS);
      await user.save();

      const link = `${appUrl()}/reset-password?token=${token}`;
      try {
        await sendMail({
          to: user.email,
          subject: 'Reimposta la tua password - Todo App',
          text: `Ciao ${user.name},\n\nper scegliere una nuova password apri questo link (valido 1 ora):\n${link}\n\nSe non l'hai richiesto tu, ignora questa mail.`,
          html: `<p>Ciao ${user.name},</p><p>per scegliere una nuova password <a href="${link}">clicca qui</a> (link valido 1 ora).</p><p>Se non l'hai richiesto tu, ignora questa mail.</p>`,
        });
      } catch (mailError) {
        console.error('Invio mail di reset fallito', mailError.message);
      }
    }
    res.json(GENERIC);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Dati non validi', errors: errors.array() });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: hashToken(req.body.token),
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Link non valido o scaduto' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password aggiornata. Ora puoi accedere.' });
  } catch (error) {
    next(error);
  }
};
