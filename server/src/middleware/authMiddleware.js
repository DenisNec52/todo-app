import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token mancante o non valido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token non valido o scaduto' });
  }
};
