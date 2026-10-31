import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

import { JWT_SECRET } from '../config.js';
import { User } from '../models/User.js';
import { sendMail } from '../services/mailer.js';

const createToken = (user) =>
  jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: '7d',
  });

export const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Dati non validi', errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email già registrata' });
    }

    const user = await User.create({ name, email, password });
    const token = createToken(user);

    // Mail di benvenuto: non blocca la registrazione se l'invio fallisce.
    sendMail({
      to: user.email,
      subject: 'Benvenuto su Todo App',
      text: `Ciao ${user.name}, il tuo account è stato creato. Buon lavoro!`,
      html: `<p>Ciao ${user.name}, il tuo account è stato creato. Buon lavoro!</p>`,
    }).catch((err) => console.error('Invio mail di benvenuto fallito', err.message));

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Credenziali non valide', errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
};
